package helper

import (
	"testing"
)

func TestPostgreSQL(t *testing.T) {
	post, err := NewPostgreSQL("localhost", 5432, "postgres", "123", "postgres")
	if err != nil {
		t.Error(err)
		return
	}
	defer post.Close()

	_, err = post.Exec("create table test (name text, age int)")
	if err != nil {
		t.Error(err)
		return
	}

	_, err = post.Exec("insert into test (name, age) values ('xiaoming', 12)")
	if err != nil {
		t.Error(err)
		return
	}

	rows, err := post.Query("select * from test where name='xiaoming'")
	if err != nil {
		t.Error(err)
		return
	}

	for rows.Next() {
		cols, err := rows.Values()
		if err != nil {
			t.Error(err)
			return
		}
		t.Log(cols)
	}

	_, err = post.Exec("drop table test")
	if err != nil {
		t.Error(err)
		return
	}
}
