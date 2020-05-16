// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"testing"
)

func TestPostgreSQL(t *testing.T) {
	post := NewPostgreSQL("localhost", 5432, "postgres", "123", "postgres")
	defer post.Close()

	post.Exec("create table test (name text, age int)")

	post.Exec("insert into test (name, age) values ('xiaoming', 12)")

	rows := post.Query("select * from test where name='xiaoming'")

	for rows.Next() {
		cols, err := rows.Values()
		if err != nil {
			t.Error(err)
			return
		}
		t.Log(cols)
	}

	post.Exec("drop table test")
}
