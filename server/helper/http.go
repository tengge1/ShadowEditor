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
func Write(w http.ResponseWriter, args ...interface{}) {
	header := w.Header()

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	w.Write([]byte(fmt.Sprint(args...)))
}

// Writef write a string response to the web client with format string.
func Writef(w http.ResponseWriter, format string, args ...interface{}) {
	header := w.Header()

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	w.Write([]byte(fmt.Sprint(args...)))
}

// WriteJSON write a json response to the web client.
func WriteJSON(w http.ResponseWriter, obj interface{}) error {
	header := w.Header()

	header.Set("Content-Type", "application/json")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	bytes, err := ToJSON(obj)
	if err != nil {
		return err
	}

	w.Write(bytes)

	return nil
}

// Download write a file stream to the webbrowser.
func Download(w http.ResponseWriter, path, name string) {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte(err.Error()))
		return
	}

	header := w.Header()
	header.Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%v"`, url.QueryEscape(name)))
	header.Set("Content-Length", strconv.Itoa(len(bytes)))
	header.Set("Content-Type", "application/octet-stream; charset=GB2312")
	w.Write(bytes)
}
