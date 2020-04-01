package main

import (
	"testing"

	homedir "github.com/mitchellh/go-homedir"
)

func TestHomeDir(t *testing.T) {
	dir, err := homedir.Dir()
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(dir)
}
