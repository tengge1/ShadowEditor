// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"github.com/otiai10/copy"
)

// CopyDirectory copy one directory and its content to another
func CopyDirectory(sourceDirName, destDirName string) error {
	return copy.Copy(sourceDirName, destDirName)
}
