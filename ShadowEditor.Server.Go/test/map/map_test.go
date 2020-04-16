package main

import "testing"

func TestMap(t *testing.T) {
	person := map[string]interface{}{
		"name": "ming",
		"age":  18,
		"home": "beijing",
	}
	t.Logf("len(person): %v", len(person))

	for i, n := range person {
		t.Logf("%v: %v", i, n)
	}
}
