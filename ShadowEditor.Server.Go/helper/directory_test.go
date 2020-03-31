package helper

import (
	"os"
	"testing"

	"io/ioutil"
)

func TestCopyDirectory(t *testing.T) {

}

func TestRemoveEmptyDirectory(t *testing.T) {

}

func TestTempDir(t *testing.T) {
	t.Log(os.TempDir())
}

func TestWalk(t *testing.T) {
	children, err := ioutil.ReadDir("./")
	if err != nil {
		t.Error(err)
		return
	}

	for _, child := range children {
		childType := "file"
		if child.IsDir() {
			childType = "dir"
		}
		t.Logf("%v\t%v", child.Name(), childType)
	}
}
