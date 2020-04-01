package helper

import "testing"

var (
	list = []string{"foo", "bar", "cat", "foo", "dog", "cat"}
)

func TestIndexOf(t *testing.T) {
	index, err := IndexOf(list, "cat", 0)
	if err != nil {
		t.Error(err)
		return
	}
	if index != 2 {
		t.Errorf("IndexOf: expect %v, get %v", 2, index)
	}
}

func TestLastIndexOf(t *testing.T) {

}

func TestFind(t *testing.T) {

}

func TestFindLast(t *testing.T) {

}

func TestFindAll(t *testing.T) {

}

func TestFindIndex(t *testing.T) {

}

func TestFindLastIndex(t *testing.T) {

}
