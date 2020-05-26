package server

import (
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
	tr := &http.Transport{
		// IMPORTANT: You should set DisableCompression to true, or http.Get will
		// decompress the response automatically.
		DisableCompression: true,
	}
	client := &http.Client{Transport: tr}
	resp, err := client.Get(ts.URL)
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
	reader, err := gzip.NewReader(resp.Body)
	if err != nil {
		t.Error(err)
	}
	defer reader.Close()
	bytes, err := ioutil.ReadAll(reader)
	if err != nil {
		t.Error(err)
	}
	str := string(bytes)
	if str != hello {
		t.Errorf("expect %v, got %v", hello, str)
	}
}
