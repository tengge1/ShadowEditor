package panic

import (
	"errors"
	"fmt"
	"testing"
)

func TestPanic2Err(t *testing.T) {
	err := CatchFunc()
	if err != nil {
		fmt.Print(err)
	}
}

func CatchFunc() (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = errors.New(r.(string))
		}
	}()

	PanicFunc()
	return nil
}

func PanicFunc() {
	panic("Something is wrong!")
}
