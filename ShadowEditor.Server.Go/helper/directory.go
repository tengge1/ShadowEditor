package helper

import (
	"os"
	"path/filepath"
)

// CopyDirectory copy one directory and its content to another
func CopyDirectory(sourceDirName, destDirName string) error {
	err := filepath.Walk(sourceDirName, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		return nil
	})

	return err
}

// RemoveEmptyDirectory remove empty folder under path
func RemoveEmptyDirectory(path string) {

}
