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
	Content  string // content when is a file
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
					Name:    "Foo2.txt",
					Type:    FileType,
					Content: "Hello, world.",
				},
			},
		}, {
			Name:    "Bar.txt",
			Type:    FileType,
			Content: "The quick brown fox jumps over the lazy dog.",
		},
	}
)

func TestCopyDirectory(t *testing.T) {
	// source dir
	sourceDirName, err := ioutil.TempDir("", "")
	if err != nil {
		t.Error(err)
	}
	if err := prepareTestTree(sourceDirName); err != nil {
		t.Error(err)
	}
	t.Logf("sourceDirName: %v", sourceDirName)

	// dest dir
	destDirName, err := ioutil.TempDir("", "")
	if err != nil {
		t.Error(err)
	}
	t.Logf("destDirName: %v", destDirName)

	// copy dir
	if err = CopyDirectory(sourceDirName, destDirName); err != nil {
		t.Error(err)
	}

	// verify dest dir
	checkTestTree(destDirName, t)
}

func TestCopyFile(t *testing.T) {
	str := "hello, world!"

	// source file
	sourceFile, err := ioutil.TempFile(os.TempDir(), "*.txt")
	if err != nil {
		t.Error(err)
	}
	defer sourceFile.Close()

	if _, err := sourceFile.Write([]byte(str)); err != nil {
		t.Error(err)
	}

	// dest file
	destPath := os.TempDir() + "/foo/bar.txt"

	if err := CopyFile(sourceFile.Name(), destPath); err != nil {
		t.Error(err)
	}

	bytes, err := ioutil.ReadFile(destPath)
	if err != nil {
		t.Error(err)
	}

	if string(bytes) != str {
		t.Errorf("expect %v, got %v", str, string(bytes))
	}
}

// prepareTestTree create directories and files descibe by `Tree`.
func prepareTestTree(root string) error {
	if _, err := os.Stat(root); os.IsNotExist(err) {
		os.MkdirAll(root, 0755)
	}
	return createNode(root, Tree)
}

// createNode create a directory or file describe by `FileInfo`.
func createNode(parent string, infos []FileInfo) error {
	for _, info := range infos {
		path := filepath.Join(parent, info.Name)
		if info.Type == DirType { // info is a dir
			if _, err := os.Stat(path); os.IsNotExist(err) {
				os.Mkdir(path, 0755)
			}
			if info.Children != nil && len(info.Children) > 0 {
				if err := createNode(path, info.Children); err != nil {
					return err
				}
			}
		} else if info.Type == FileType { // info is a file
			if _, err := os.Stat(path); os.IsNotExist(err) {
				if err := ioutil.WriteFile(path, []byte(info.Content), 0755); err != nil {
					return err
				}
			}
		} else {
			return fmt.Errorf("unknown FileInfo type: %v", info.Type)
		}
	}
	return nil
}

// checkTestTree verify if copy rightly.
func checkTestTree(root string, t *testing.T) {
	if _, err := os.Stat(root); os.IsNotExist(err) {
		t.Errorf("%v is not created", root)
	}
	checkNode(root, Tree, t)
}

// checkNode verify a directory or file is copy rightly as described by FileInfo.
func checkNode(parent string, infos []FileInfo, t *testing.T) {
	for _, info := range infos {
		path := filepath.Join(parent, info.Name)
		if info.Type == DirType { // info is a dir
			stat, err := os.Stat(path)
			if os.IsNotExist(err) {
				t.Errorf("%v is not created", path)
			}
			if !stat.IsDir() {
				t.Errorf("expect a dir, got a file")
			}
			if info.Children != nil && len(info.Children) > 0 {
				checkNode(path, info.Children, t)
			}
		} else if info.Type == FileType { // info is a file
			stat, err := os.Stat(path)
			if os.IsNotExist(err) {
				t.Errorf("%v is not created", path)
			}
			if stat.IsDir() {
				t.Errorf("expect a file, got a dir")
			}
			bytes, err := ioutil.ReadFile(path)
			if err != nil {
				t.Error(err)
			}
			if content := string(bytes); content != info.Content {
				t.Errorf("expect %v, got %v", info.Content, content)
			}
		} else {
			t.Errorf("unknown FileInfo type: %v", info.Type)
		}
	}
}
