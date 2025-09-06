package main

import (
	"log"
	"os"
	"sort"
	"strings"
	"time"

	exptrace "golang.org/x/exp/trace"
	gotraceui "honnef.co/go/gotraceui/trace/ptrace"
)

// Node represents our JSON structure
type Node struct {
	ID           int64   `json:"id"`
	Start        float64 `json:"start"`
	End          float64 `json:"end"`
	PercentStart float64 `json:"percentStart"`
	PercentEnd   float64 `json:"percentEnd"`
	Color        string  `json:"color"`
	Children     []*Node `json:"children"`
	ParentID     int64   `json:"-"` // internal only
}

func ParseTrace() (*Node, error) {
	f, err := os.Open("trace.out")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	r, err := exptrace.NewReader(f)
	if err != nil {
		log.Fatal(err)
	}

	tr, err := gotraceui.Parse(r, func(float64) {})
	if err != nil {
		log.Fatal(err)
	}

	// Find earliest start time among goroutines
	var startTs exptrace.Time
	first := true
	for _, g := range tr.Goroutines {
		s := g.EffectiveStart()
		if first || s < startTs {
			startTs = s
			first = false
		}
	}

	nodes := map[int64]*Node{}

	// Build nodes
	for _, g := range tr.Goroutines {
		if g.Function == nil {
			continue
		}
		// Only keep goroutines from main.*
		if !strings.HasPrefix(g.Function.Func, "main.") {
			continue
		}

		s := time.Duration(g.EffectiveStart() - startTs)
		e := time.Duration(g.EffectiveEnd() - startTs)

		gid := int64(g.ID)
		parent := int64(g.Parent)

		nodes[gid] = &Node{
			ID:       gid,
			Start:    s.Seconds(),
			End:      e.Seconds(),
			ParentID: parent,
			Children: []*Node{},
		}
	}

	// Find root (ParentID == 0)
	var root *Node
	for _, n := range nodes {
		if n.ParentID == 0 {
			root = n
			break
		}
	}
	if root == nil {
		log.Fatal("no root goroutine found (ParentID==0)")
	}

	// Compute root duration & base fields
	rootDuration := root.End - root.Start
	if rootDuration <= 0 {
		rootDuration = 1
	}
	root.PercentStart = 0
	root.PercentEnd = 100
	root.Color = "#000000"

	// Build parent -> children links
	for _, n := range nodes {
		if n == root {
			continue
		}
		if p, ok := nodes[n.ParentID]; ok {
			p.Children = append(p.Children, n)
		}
	}

	// Auto-generate distinct colors for root children
	rootChildren := len(root.Children)
	palette := generatePalette(rootChildren)

	// Assign percents relative to root and colors
	var assign func(n *Node, depth int, parentColor string, idx int)
	assign = func(n *Node, depth int, parentColor string, idx int) {
		n.PercentStart = ((n.Start - root.Start) / rootDuration) * 100
		n.PercentEnd = ((n.End - root.Start) / rootDuration) * 100

		if depth == 1 {
			// assign root children distinct palette colors
			n.Color = palette[idx%len(palette)]
		} else {
			// child gets lighter variant of parent color
			n.Color = lighten(parentColor, 0.3)
		}

		// sort children by start time before assigning
		sort.Slice(n.Children, func(i, j int) bool {
			return n.Children[i].Start < n.Children[j].Start
		})

		for i, c := range n.Children {
			assign(c, depth+1, n.Color, i)
		}
	}

	// sort root children as well
	sort.Slice(root.Children, func(i, j int) bool {
		return root.Children[i].Start < root.Children[j].Start
	})

	for i, c := range root.Children {
		assign(c, 1, "", i)
	}

	// Print JSON
	// out, _ := json.MarshalIndent(root, "", "  ")
	// fmt.Println(string(out))

	return root, nil
}
