package helper

import (
	"net/url"
	"testing"
)

func TestGet(t *testing.T) {
	bytes, err := Get("http://www.baidu.com")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(string(bytes))
}

func TestPost(t *testing.T) {
	bytes, err := Post("https://passport.baidu.com/v2/api/?login", url.Values{"username": {"foo"}, "password": {"bar"}})
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(string(bytes))
}
