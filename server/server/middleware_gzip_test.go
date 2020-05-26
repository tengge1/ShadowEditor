package server

import (
	"bytes"
	"compress/gzip"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGZipMiddleware(t *testing.T) {
	hello := "Hello, world!"
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(hello))
	}
	// test server
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("Accept-Encoding", "gzip")
		GZipMiddleware(w, r, handler)
	}))
	defer ts.Close()
	// get response
	resp, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}
	defer resp.Body.Close()
	// check header
	acceptEncodingHeader := resp.Header.Get("Content-Encoding")

	if acceptEncodingHeader != "gzip" {
		t.Errorf("Content-Encoding is not set properly, got %v", acceptEncodingHeader)
	}

	// check body
	byts, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Error(err)
	}

	reader, err := gzip.NewReader(bytes.NewReader(byts))
	if err != nil {
		t.Error(err)
	}
	defer reader.Close()
	byts, err = ioutil.ReadAll(reader)
	if err != nil {
		t.Error(err)
	}
	str := string(byts)
	if str != hello {
		t.Errorf("expect %v, got %v", hello, str)
	}
}
