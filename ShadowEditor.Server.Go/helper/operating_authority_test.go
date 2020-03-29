package helper

import "testing"

func TestGetAllOperatingAuthorities(t *testing.T) {
	authorities := GetAllOperatingAuthorities()

	for _, item := range authorities {
		t.Log(item)
	}
}
