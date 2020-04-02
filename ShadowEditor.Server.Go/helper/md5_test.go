package helper

import "testing"

func TestMD5(t *testing.T) {
	str := "The fog is getting thicker!"
	result := MD5(str)
	if result != "bd009e4d93affc7c69101d2e0ec4bfde" {
		t.Errorf("md5: expect bd009e4d93affc7c69101d2e0ec4bfde, got %v", result)
	}
}
