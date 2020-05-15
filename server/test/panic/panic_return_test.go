package panic

import (
	"fmt"
	"testing"
)

func TestReturn(t *testing.T) {
	callPanic(true)
}

func callPanic(flag bool) {
	fmt.Println("before panic")
	if flag {
		panic("Panic!!!")
	}
	fmt.Println("after panic")
}
