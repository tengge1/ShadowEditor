package server

import "testing"

func TestGetUser(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	admin, err := GetUser("5dd101a84859d02218efef84")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(admin)

	user, err := GetUser("5dd108e64859d222181f0397")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(user)
}
