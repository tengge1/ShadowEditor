package main

import (
	"fmt"
)

func main() {
	a := "hello"

	{
		a := "world"
		fmt.Printf("in: %v\n", a)
	}

	fmt.Printf("out: %v\n", a)
}
