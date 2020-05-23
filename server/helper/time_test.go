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

func TestTimeFormat(t *testing.T) {
	now := time.Date(2020, 5, 23, 21, 30, 12, 0, time.Local)

	date := now.Format(DateFormat)
	tim := now.Format(TimeFormat)
	datetime := now.Format(DateTimeFormat)
	full := now.Format(time.RFC3339)

	if date != "2020-05-23" {
		t.Errorf("expecte 2020-05-23, got %v", date)
	}

	if tim != "21:30:12" {
		t.Errorf("expecte 21:30:12, got %v", tim)
	}

	if datetime != "2020-05-23 21:30:12" {
		t.Errorf("expecte 2020-05-23 21:30:12, got %v", datetime)
	}

	if full != "2020-05-23T21:30:12+08:00" {
		t.Errorf("expecte 2020-05-23T21:30:12+08:00, got %v", full)
	}
}

func TestTimeToString(t *testing.T) {
	now := time.Date(2020, 5, 23, 21, 30, 12, 0, time.Local)

	date := TimeToString(now, "yyyy-MM-dd")
	tim := TimeToString(now, "HH:mm:ss")
	datetime := TimeToString(now, "yyyy-MM-dd HH:mm:ss")

	if date != "2020-05-23" {
		t.Errorf("expecte 2020-05-23, got %v", date)
	}

	if tim != "21:30:12" {
		t.Errorf("expecte 21:30:12, got %v", tim)
	}

	if datetime != "2020-05-23 21:30:12" {
		t.Errorf("expecte 2020-05-23 21:30:12, got %v", datetime)
	}
}
