package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
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

func main() {
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

	// Build nodes (cast GoID -> int64 where needed)
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

		for i, c := range n.Children {
			assign(c, depth+1, n.Color, i)
		}
	}

	for i, c := range root.Children {
		assign(c, 1, "", i)
	}

	// Print JSON
	out, _ := json.MarshalIndent(root, "", "  ")
	fmt.Println(string(out))
}

// ---- Color helpers ----

// Generate N distinct colors evenly spaced around the HSL color wheel
func generatePalette(n int) []string {
	colors := make([]string, n)
	for i := 0; i < n; i++ {
		hue := float64(i) * 360.0 / float64(n) // distribute evenly
		colors[i] = hslToHex(hue, 70, 50)      // saturation 70%, lightness 50%
	}
	return colors
}

func hslToHex(h, s, l float64) string {
	c := (1 - abs(2*l/100-1)) * (s / 100)
	x := c * (1 - abs(float64(int(h/60)%2)-1))
	m := l/100 - c/2
	var r, g, b float64
	switch {
	case h < 60:
		r, g, b = c, x, 0
	case h < 120:
		r, g, b = x, c, 0
	case h < 180:
		r, g, b = 0, c, x
	case h < 240:
		r, g, b = 0, x, c
	case h < 300:
		r, g, b = x, 0, c
	default:
		r, g, b = c, 0, x
	}
	return fmt.Sprintf("#%02X%02X%02X",
		int((r+m)*255), int((g+m)*255), int((b+m)*255))
}

func abs(x float64) float64 {
	if x < 0 {
		return -x
	}
	return x
}

// lighten makes a hex color lighter by factor in [0..1]
func lighten(hex string, factor float64) string {
	if len(hex) != 7 || hex[0] != '#' {
		return hex
	}
	var r, g, b int
	_, _ = fmt.Sscanf(hex[1:], "%02x%02x%02x", &r, &g, &b)
	r = clamp(int(float64(r)+(255.0-float64(r))*factor), 0, 255)
	g = clamp(int(float64(g)+(255.0-float64(g))*factor), 0, 255)
	b = clamp(int(float64(b)+(255.0-float64(b))*factor), 0, 255)
	return fmt.Sprintf("#%02X%02X%02X", r, g, b)
}

func clamp(v, lo, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}
