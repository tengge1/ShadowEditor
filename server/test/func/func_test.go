package func1

import "testing"

var retBool func() bool

func myBool() bool {
	return true
}

func TestFunc(t *testing.T) {
	if retBool == nil {
		t.Log(true)
	} else {
		t.Log(false)
	}
}
