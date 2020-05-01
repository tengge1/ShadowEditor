// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"testing"
	"time"
)

func TestTimeToString(t *testing.T) {
	now := time.Now()
	t.Log(TimeToString(now, "yyyy-MM-dd HH:mm:ss"))
	t.Log(TimeToString(now, "yyyyMMddHHmmss"))
	t.Log(TimeToString(now, "yyyyMMdd"))
	t.Log(TimeToString(now, "HHmmss"))
}
