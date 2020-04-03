package helper

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"
)

type Type int

const (
	DirType Type = iota
	FileType
)

type FileInfo struct {
	Name     string
	Type     Type
	Children []FileInfo
}

var (
	Tree = []FileInfo{
		{
			Name: "Foo",
			Type: DirType,
			Children: []FileInfo{
				{
					Name: "Foo1",
					Type: DirType,
				}, {
					Name: "Foo2.txt",
					Type: FileType,
				},
			},
		}, {
			Name: "Bar.txt",
			Type: FileType,
		},
	}
)

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

func prepareTestTree(t *testing.T) error {
	root, err := ioutil.TempDir("", "")
	if err != nil {
		return err
	}
	t.Logf("create temp dir: %v", root)
	_, err = os.Stat(root)
	if !os.IsExist(err) {
		os.MkdirAll(root, 0755)
	}
	return CreateNode(root, Tree)
}

func CreateNode(parent string, infos []FileInfo) error {
	for _, info := range infos {
		path := filepath.Join(parent, info.Name)
		if info.Type == DirType {
			_, err := os.Stat(path)
			if !os.IsExist(err) {
				os.Mkdir(path, 0755)
			}
			if info.Children != nil {
				err := CreateNode(path, info.Children)
				if err != nil {
					return err
				}
			}
		} else if info.Type == FileType {
			_, err := os.Stat(path)
			if !os.IsExist(err) {
				file, err := os.Create(path)
				if err != nil {
					return err
				}
				file.Close()
			}
		} else {
			return fmt.Errorf("unknown FileInfo type: %v", info.Type)
		}
	}
	return nil
}

func TestCopyDirectory(t *testing.T) {
	err := prepareTestTree(t)
	if err != nil {
		t.Error(err)
	}
}
