// +build ignore

// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"fmt"

	"github.com/go-redis/redis"
)

// Redis represent a new redis client.
//
// TODO: We may use redis to store GIS tiled data in the future.
type Redis struct {
	Client *redis.Client
}

// Create create a new redis client.
func (r Redis) Create(addr string, dbName int) (*Redis, error) {
	client := redis.NewClient(&redis.Options{
		Addr: addr,
		DB:   dbName,
	})

	pong, err := client.Ping().Result()
	if err != nil {
		return nil, err
	}

	if pong != "PONG" {
		return nil, fmt.Errorf("redis did not respond with 'PONG', '%s'", pong)
	}

	r.Client = client

	return &r, nil
}

// Set set redis key value.
func (r *Redis) Set(key string, val []byte) error {
	return r.Client.
		Set(key, val, 0).
		Err()
}

// Get get a redis value through a key.
func (r *Redis) Get(key string) (val []byte, hit bool, err error) {
	val, err = r.Client.Get(key).Bytes()

	switch err {
	case nil: // cache hit
		return val, true, nil
	case redis.Nil: // cache miss
		return val, false, nil
	default: // error
		return val, false, err
	}
}

// Del deleta a redis key.
func (r *Redis) Del(key string) (err error) {
	return r.Client.Del(key).Err()
}
