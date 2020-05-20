package reflects

import (
	"reflect"
	"testing"
)

const Foo = "Bar"

func TestConst(t *testing.T) {
	typ := reflect.TypeOf(Foo)
	t.Log(typ.Name())
	t.Log(typ.String())
}
