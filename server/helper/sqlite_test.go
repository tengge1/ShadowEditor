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

func TestSQLite(t *testing.T) {
	client := NewSQLite("./test.db")
	defer client.Close()

	client.Exec("create table test (name text, age int)")

	client.Exec("insert into test (name, age) values ('xiaoming', 12)")

	rows := client.Query("select * from test where name='xiaoming'")

	for rows.Next() {
		var name string
		var age int
		err := rows.Scan(&name, &age)
		if err != nil {
			t.Error(err)
			return
		}
		t.Logf("name: %v, age: %v", name, age)
	}

	client.Exec("drop table test")
}
