package main

import (
	"fmt"
	"log"
	"os"

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

	for _, g := range tr.Goroutines {
		fmt.Printf("ID: %d ParentID: %d Start: %v, End: %v\n", g.ID, g.Parent, g.EffectiveStart(), g.EffectiveEnd())
	}
}
