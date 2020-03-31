package helper

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
)

// CopyDirectory copy one directory and its content to another
func CopyDirectory(sourceDirName, destDirName string) error {
	children, err := ioutil.ReadDir(sourceDirName)
	if err != nil {
		return err
	}
	for _, child := range children {
		sourcePath := fmt.Sprintf("%v/%v", sourceDirName, child.Name())
		destPath := fmt.Sprintf("%v/%v", destDirName, child.Name())
		if child.IsDir() {
			_, err = os.Stat(destPath)
			if !os.IsExist(err) {
				os.MkdirAll(destPath, 0777)
			}
		} else {
			writer, err := os.Create(destPath)
			if err != nil {
				return err
			}
			defer writer.Close()
			reader, err := os.Open(sourcePath)
			if err != nil {
				return err
			}
			defer reader.Close()
			io.Copy(writer, reader)
		}
	}
	return nil
}

// RemoveEmptyDirectory remove empty folder under path
func RemoveEmptyDirectory(path string) {

}
