package helper

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/otiai10/copy"
)

// CopyDirectory copy the contents in one directory to another.
func CopyDirectory(sourceDirName, destDirName string) error {
	return copy.Copy(sourceDirName, destDirName)
}

// CopyFile copy one file from source path to dest path.
func CopyFile(sourcePath, destPath string) error {
	// check sourcePath
	stat, err := os.Stat(sourcePath)
	if os.IsNotExist(err) {
		return fmt.Errorf("%v is not existed", sourcePath)
	}
	if stat.IsDir() {
		return fmt.Errorf("%v is dir, not file", sourcePath)
	}
	modes := stat.Mode()

	// check destPath
	stat, err = os.Stat(destPath)
	if os.IsNotExist(err) {
		dir := filepath.Dir(destPath)
		if _, err := os.Stat(dir); os.IsNotExist(err) {
			os.MkdirAll(dir, 0755)
		}
	} else if err == nil && stat.IsDir() {
		return fmt.Errorf("%v is dir", destPath)
	}

	// copy file
	bytes, err := ioutil.ReadFile(sourcePath)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(destPath, bytes, modes)
}
