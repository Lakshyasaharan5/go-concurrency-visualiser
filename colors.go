package main

import (
	"fmt"
	"math/rand"
	"time"
)

// Generate N distinct colors evenly spaced around the HSL color wheel
func generatePalette(n int) []string {
	rand.Seed(time.Now().UnixNano())
	colors := make([]string, n)
	for i := 0; i < n; i++ {
		hue := float64(i) * 360.0 / float64(n) // evenly spaced hue
		sat := 50 + rand.Float64()*40          // random saturation [50–90%]
		light := 40 + rand.Float64()*30        // random lightness [40–70%]
		colors[i] = hslToHex(hue, sat, light)
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
