package helper

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
)

// UnZip unzip a .zip file.
func UnZip(filename, path string) error {
	r, err := zip.OpenReader(filename)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		name := f.Name
		target := fmt.Sprintf("%v/%v", path, name)
		if f.FileInfo().IsDir() {
			_, err := os.Stat(target)
			if os.IsNotExist(err) {
				os.MkdirAll(target, 0755)
			}
		} else {
			reader, err := f.Open()
			if err != nil {
				return err
			}
			defer reader.Close()
			writer, err := os.Create(target)
			if err != nil {
				return err
			}
			defer writer.Close()
			io.Copy(writer, reader)
		}
	}
	return nil
}
