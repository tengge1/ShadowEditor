package helper

import (
	"io/ioutil"
	"testing"
)

func TestUnZip(t *testing.T) {
	file := "../test/test.zip"
	tmp, err := ioutil.TempDir("/tmp", "unzip")
	if err != nil {
		t.Error(err)
	}
	err = UnZip(file, tmp)
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(tmp)
}
