package helper

import (
	"testing"
)

func TestPostgreSQL(t *testing.T) {
	post, err := PostgreSQL{}.Create("192.168.0.14", 5432, "postgres", "123", "test")
	if err != nil {
		t.Error(err)
		return
	}
	rows, err := post.Query("select * from table1")
	if err != nil {
		t.Error(err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		t.Log(rows.Values())
	}
}
