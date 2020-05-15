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
	if result, num := 5, 6; result > 3 {
		fmt.Println(num)
	}
	return
}
