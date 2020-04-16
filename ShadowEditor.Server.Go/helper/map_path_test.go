package helper

import "testing"

func TestMapPath(t *testing.T) {
	path := MapPath("/Upload/texture/test.jpg")
	t.Log(path)
}
