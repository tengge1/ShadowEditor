package helper

import (
	"log"
	"os"
)

// NewLog create a new logger
func NewLog(path string) (*log.Logger, error) {
	file, err := os.Create(path)
	if err != nil {
		return nil, err
	}
	return log.New(file, "", log.Ldate|log.Ltime|log.Lshortfile), nil
}
