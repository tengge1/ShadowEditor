package nextafter

import (
	"math"
	"testing"
)

func TestNextAfter(t *testing.T) {
	r := math.Nextafter(0, 1)
	t.Log(r)
}
