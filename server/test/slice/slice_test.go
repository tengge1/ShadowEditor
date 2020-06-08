package slice

import "testing"

func TestSlice(t *testing.T) {
	a := []float64{}
	a[1] = 3
	t.Log(a[0])
	t.Log(a[1])
}
