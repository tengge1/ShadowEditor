package panic

import (
	"fmt"
	"testing"
)

func TestPanic2Err(t *testing.T) {
	CatchFunc()
}

func CatchFunc() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Print(r)
		}
	}()

	PanicFunc()
}

func PanicFunc() {
	panic("Something is wrong!")
}
