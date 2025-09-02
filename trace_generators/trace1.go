package main

import (
	"context"
	"fmt"
	"os"
	"runtime/trace"
	"sync"
	"time"
)

func main() {
	f, err := os.Create("trace.out")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	if err := trace.Start(f); err != nil {
		panic(err)
	}
	defer trace.Stop()

	ctx, task := trace.NewTask(context.Background(), "main-root")
	defer task.End()

	// run children sequentially
	for i := 0; i < 15; i++ {
		runChild(ctx, i)
	}

	time.Sleep(50 * time.Millisecond) // flush trace
}

func runChild(ctx context.Context, index int) {
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		spawnChild(ctx, index)
	}()

	// wait until this child finishes before moving to next
	wg.Wait()
}

func spawnChild(ctx context.Context, index int) {
	name := fmt.Sprintf("child-%d", index)
	region := trace.StartRegion(ctx, name)
	defer region.End()

	// simulate work
	time.Sleep(100 * time.Millisecond)
}
