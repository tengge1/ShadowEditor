// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package script

// Model is a script data in the scene. We store scripts in a tree.
// This will help to edit scene scripts using a desktop editor.
// Set `remote.enabled` to true, we use websocket to transform scene scripts
// to some folder.
type Model struct {
	// mongo _id
	ID string
	// parent script id
	PID string
	// script name
	Name string
	// script type
	Type string
	// script source
	Source string
	// THREE.js UUID
	UUID string
	// script order
	Sort int
}
