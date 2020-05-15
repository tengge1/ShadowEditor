package return1

import (
	"fmt"
	"testing"
)

func TestReturn(t *testing.T) {
	result := returnFunc()
	fmt.Println(result)
}

func returnFunc() (result int) {
	result, num := 5, 6
	if result > 3 {
		fmt.Println(num)
	}
	return
}
