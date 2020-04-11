package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

// PostHandler receive a list params and output.
func PostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	list, ok := r.Form["list"]
	if !ok {
		fmt.Println("get param failed.")
		return
	}
	for _, item := range list {
		fmt.Println(item)
	}
	w.Write([]byte("ok"))
}

func TestPostArray(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(PostHandler))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"list": {"foo", "bar"},
	})
	if err != nil {
		fmt.Print(err)
		return
	}
	defer res.Body.Close()

	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Print(err)
		return
	}
	fmt.Println(string(bytes))
}
