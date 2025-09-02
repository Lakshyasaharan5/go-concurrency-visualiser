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

	var wg sync.WaitGroup

	// main spawns 4 children sequentially
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			spawnChild(ctx, i)
		}(i)
	}

	wg.Wait()
	time.Sleep(50 * time.Millisecond) // flush trace
}

func spawnChild(ctx context.Context, index int) {
	name := fmt.Sprintf("child-%d", index)
	region := trace.StartRegion(ctx, name)
	defer region.End()

	time.Sleep(100 * time.Millisecond)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		spawnGrandChild(ctx, index)
	}()
	wg.Wait()
}

func spawnGrandChild(ctx context.Context, parentIndex int) {
	name := fmt.Sprintf("grandchild-%d", parentIndex)
	region := trace.StartRegion(ctx, name)
	defer region.End()

	time.Sleep(80 * time.Millisecond)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		spawnGreatGrandChild(ctx, parentIndex)
	}()
	wg.Wait()
}

func spawnGreatGrandChild(ctx context.Context, parentIndex int) {
	name := fmt.Sprintf("greatgrandchild-%d", parentIndex)
	region := trace.StartRegion(ctx, name)
	defer region.End()

	time.Sleep(60 * time.Millisecond)
}
