package helper

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"
)

var (
	DirTree = map[string]interface{}{
		"foo": map[string]interface{}{
			"type":     "dir",
			"children": map[string]interface{}{},
		},
		"bar.txt": map[string]interface{}{
			"type": "file",
		},
	}
)

func prepareTestDirTree() error {
	root, err := ioutil.TempDir("", "")
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Join(tmpDir, "1"))
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Join(tmpDir, tree), 0755)
	if err != nil {
		os.RemoveAll(tmpDir)
		return "", err
	}
	return tmpDir, nil
}

func TestCopyDirectory(t *testing.T) {
	os.TempDir()
}

func TestRemoveEmptyDirectory(t *testing.T) {

}

func TestTempDir(t *testing.T) {
	t.Log(os.TempDir())
	tmpDir, err := ioutil.TempDir("", "")
	if err != nil {
		t.Error(err)
		return
	}
	defer os.Remove(tmpDir)
	t.Log(tmpDir)
}
