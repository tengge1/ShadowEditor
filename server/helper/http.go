// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

// EnableCrossDomain sets the `Access-Control-Allow-Methods` header and the
// `Access-Control-Allow-Origin` header to the response to enable cross domain.
//
// TODO: We should restrict the origin, and may set in `config.toml`.
func EnableCrossDomain(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if origin == "" { // not cross origin
		return
	}

	header := w.Header()
	header.Set("Access-Control-Allow-Methods", "OPTIONS,POST,GET")
	header.Set("Access-Control-Allow-Origin", origin)
}

// Get create a get request to the server.
func Get(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

// Post create a post request to the server.
func Post(url string, data url.Values) ([]byte, error) {
	resp, err := http.PostForm(url, data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

// Write write a string response to the web client.
func Write(w http.ResponseWriter, args ...interface{}) (int, error) {
	header := w.Header()

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	return w.Write([]byte(fmt.Sprint(args...)))
}

// Writef write a string response to the web client with format string.
func Writef(w http.ResponseWriter, format string, args ...interface{}) (int, error) {
	header := w.Header()

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	return w.Write([]byte(fmt.Sprint(args...)))
}

// WriteJSON write a json response to the web client.
func WriteJSON(w http.ResponseWriter, obj interface{}) (int, error) {
	header := w.Header()

	header.Set("Content-Type", "application/json")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	bytes, err := ToJSON(obj)
	if err != nil {
		return 0, err
	}

	return w.Write(bytes)
}

// WriteFile write a file stream to the webbrowser.
func WriteFile(w http.ResponseWriter, path, name string) (int, error) {
	stat, err := os.Stat(path)
	if os.IsNotExist(err) {
		w.WriteHeader(http.StatusNotFound)
		return 0, err
	}

	if stat.IsDir() {
		w.WriteHeader(http.StatusNotFound)
		return 0, fmt.Errorf("%v is not a file", path)
	}

	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return 0, err
	}

	header := w.Header()

	header.Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%v"`, url.QueryEscape(name)))
	header.Set("Content-Length", strconv.Itoa(len(bytes)))
	header.Set("Content-Type", "application/octet-stream; charset=GB2312")

	return w.Write(bytes)
}
