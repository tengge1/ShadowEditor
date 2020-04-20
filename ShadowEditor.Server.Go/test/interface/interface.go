package main

import (
	"fmt"
)

func main() {
	var book11 Readable = Book1{}
	book11.Read()

	var book12 Readable = &Book1{}
	book12.Read()

	// var book21 Readable = Book2{}
	// book21.Read()

	var book22 Readable = &Book2{}
	book22.Read()
}

// Readable an interface
type Readable interface {
	Read()
}

// Book1 book
type Book1 struct{}

func (Book1) Read() {
	fmt.Println("foo")
}

// Book2 book
type Book2 struct{}

func (*Book2) Read() {
	fmt.Println("bar")
}

// Read method
func Read() {
	fmt.Println("bar")
}
