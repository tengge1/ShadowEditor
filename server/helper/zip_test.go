// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"io/ioutil"
	"os"
	"testing"
)

// Use functions borrowed from copy_test.go to test Zip and Unzip.

func TestZip(t *testing.T) {
	// source dir
	sourceDirName, err := ioutil.TempDir("", "")
	if err != nil {
		t.Error(err)
	}
	if err := prepareTestTree(sourceDirName); err != nil {
		t.Error(err)
	}
	t.Logf("sourceDirName: %v", sourceDirName)

	// create zip file
	dest, err := ioutil.TempFile(os.TempDir(), "*.zip")
	if err != nil {
		t.Error(err)
	}
	dest.Close()
	destPath := dest.Name()

	if err := Zip(sourceDirName, destPath); err != nil {
		t.Error(err)
	}

	// unzip
	unzipDir, err := ioutil.TempDir("", "")
	if err != nil {
		t.Error(err)
	}

	if err := UnZip(destPath, unzipDir); err != nil {
		t.Error(err)
	}

	// check unzip files
	checkTestTree(unzipDir, t)
}
