package main

import (
	"fmt"
	"reflect"
)

// Person is a person.
type Person struct {
	Name string `default:"xiaoming"`
	Age  int    `default:"18"`
}

// GetName get the name of a person.
func (p Person) GetName() string {
	return p.Name
}

// SetName set the name of a person.
func (p Person) SetName(name string) {
	p.Name = name
}

// GetAge get the age of a person.
func (p Person) GetAge() int {
	return p.Age
}

// SetAge set the age of a person.
func (p Person) SetAge(age int) {
	p.Age = age
}

func main() {
	person := Person{}
	typ := reflect.TypeOf(person)

	// print all the fields
	num := typ.NumField()
	for i := 0; i < num; i++ {
		field := typ.Field(i)
		fmt.Printf("%v\t%v\t%v\n", field.Name, field.Type.Name(), field.Tag.Get("default"))
	}
	fmt.Println()

	// print all the methods
	num = typ.NumMethod()
	for i := 0; i < num; i++ {
		method := typ.Method(i)
		fmt.Printf("%v\n", method.Name)
	}
}
