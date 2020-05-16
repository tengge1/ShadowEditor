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
func (r Redis) Create(addr string, dbName int) *Redis {
	client := redis.NewClient(&redis.Options{
		Addr: addr,
		DB:   dbName,
	})

	pong, err := client.Ping().Result()
	if err != nil {
		panic(err)
	}

	if pong != "PONG" {
		panic(fmt.Errorf("redis did not respond with 'PONG', '%s'", pong))
	}

	r.Client = client

	return &r
}

// Set set redis key value.
func (r *Redis) Set(key string, val []byte) {
	err := r.Client.
		Set(key, val, 0).
		Err()
	if err != nil {
		panic(err)
	}
}

// Get get a redis value through a key.
func (r *Redis) Get(key string) (val []byte, hit bool) {
	val, err := r.Client.Get(key).Bytes()

	switch err {
	case nil: // cache hit
		return val, true
	case redis.Nil: // cache miss
		return val, false
	default: // error
		panic(err)
	}
}

// Del deleta a redis key.
func (r *Redis) Del(key string) {
	if err := r.Client.Del(key).Err(); err != nil {
		panic(err)
	}
}
