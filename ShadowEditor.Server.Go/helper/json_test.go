package helper

import "testing"

func TestJSON(t *testing.T) {
	obj := map[string]interface{}{
		"foo": 1, // float64
		"bar": []interface{}{
			"hello",
			123, // float64
		},
	}

	bytes, err := ToJSON(obj)
	if err != nil {
		t.Error(err)
		return
	}

	var result interface{}

	err = FromJSON(bytes, &result)
	if err != nil {
		t.Error(err)
		return
	}

	data, ok := result.(map[string]interface{})
	if !ok {
		t.Error("interface can not be converted to map[string]interface{}")
		return
	}

	foo, ok := data["foo"].(float64)
	if !ok {
		t.Error("foo can not be converted to float64")
		return
	}

	if 1 != foo {
		t.Errorf("foo expect to be `1`, got `%v`", foo)
		return
	}

	bar, ok := data["bar"].([]interface{})
	if !ok {
		t.Error("bar can not be converted to []interface{}")
		return
	}

	bar0, ok := bar[0].(string)
	if !ok {
		t.Error("bar[0] can not be converted to string")
		return
	}

	if "hello" != bar0 {
		t.Errorf("bar[0] expect to be `hello`, got `%v`", bar0)
		return
	}

	bar1, ok := bar[1].(float64)
	if !ok {
		t.Error("bar[1] can not be converted to float64")
		return
	}

	if 123 != bar1 {
		t.Errorf("bar[1] expect to be `123`, got `%v`", bar1)
		return
	}
}
