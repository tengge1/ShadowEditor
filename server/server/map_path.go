// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"fmt"
	"path/filepath"
	"strings"
)

// MapPath convert a root relative path to physical absolute path.
func MapPath(path string) string {
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	if path == "/" {
		path = "/index.html"
	}
	path = fmt.Sprintf("%v%v", Config.Path.PublicDir, path)
	return strings.ReplaceAll(path, "/", string(filepath.Separator))
}
