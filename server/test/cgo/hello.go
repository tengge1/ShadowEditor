package main

/*
#include <stdio.h>

void hello()
{
	puts("Hello,world!");
}
*/
import "C"

func main() {
	C.hello()
}
