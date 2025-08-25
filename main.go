package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	exptrace "golang.org/x/exp/trace"
	gotraceui "honnef.co/go/gotraceui/trace/ptrace"
)

func main() {
	f, err := os.Open("trace.out")
	if err != nil {
		return
	}
	defer f.Close()

	r, err := exptrace.NewReader(f)
	if err != nil {
		return
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

	for _, g := range tr.Goroutines {

		if g.Function == nil {
			continue
		}

		// Only keep goroutines from "main" package
		if !strings.HasPrefix(g.Function.Func, "main.") {
			continue
		}

		s := time.Duration(g.EffectiveStart() - startTs)
		e := time.Duration(g.EffectiveEnd() - startTs)
		fmt.Printf("ID %d, ParentID %d start=%v, end=%v, duration=%v\n",
			g.ID, g.Parent, s, e, e-s)
	}

}
