package walk

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

func TestWalk(t *testing.T) {
	if err := filepath.Walk("../", walkFunc); err != nil {
		t.Error(err)
	}
}

func walkFunc(path string, info os.FileInfo, err error) error {
	if err != nil {
		return err
	}
	fmt.Printf("%v %v\n", path, info.IsDir())
	return nil
}
