// +build ignore

package helper

import "testing"

func TestRedis(t *testing.T) {
	redis, err := Redis{}.Create("localhost:6379", 0)
	if err != nil {
		t.Error(err)
		return
	}
	err = redis.Set("foo", []byte("bar"))
	if err != nil {
		t.Error(err)
		return
	}
	bytes, hit, err := redis.Get("foo")
	if err != nil {
		t.Error(err)
		return
	}
	if !hit {
		t.Error("redis not hit")
		return
	}
	result := string(bytes)
	if result != "bar" {
		t.Errorf("expect bar, %v get", result)
	}
}
