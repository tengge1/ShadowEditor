package panic

import (
	"fmt"
	"testing"
)

func TestErr2Panic(t *testing.T) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Print(r)
		}
	}()

	ThrowFunc()
}

func ThrowFunc() {
	if err := ErrFunc(); err != nil {
		panic(err)
	}
}

func ErrFunc() error {
	return fmt.Errorf("this is a new error")
}
