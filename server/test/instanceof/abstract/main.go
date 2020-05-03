package main

import (
	"fmt"
)

type animal interface {
	bark()
}

type dog interface {
}

type husky struct {
}

func (husky) bark() {
	fmt.Println("I and a husky.")
}

func main() {
	var h interface{} = husky{}

	if _, ok := h.(dog); ok {
		fmt.Println("husky is a dog")
	} else {
		fmt.Println("husky is not a dog")
	}

	if _, ok := h.(animal); ok {
		fmt.Println("husky is an animal")
	} else {
		fmt.Println("husky is not an animal")
	}
}
