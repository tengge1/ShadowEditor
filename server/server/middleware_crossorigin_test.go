package server

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCrossOriginMiddleware(t *testing.T) {
	origin := "http://192.168.0.2"
	hello := "Hello, world!"
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(hello))
	}
	// test server
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("Origin", origin) // Header is case insensitive, `Origin` or `origin` is ok.
		CrossOriginMiddleware(w, r, handler)
	}))
	defer ts.Close()
	// get response
	resp, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}
	defer resp.Body.Close()
	// check header
	methodsHeader := resp.Header.Get("Access-Control-Allow-Methods")
	originHeader := resp.Header.Get("Access-Control-Allow-Origin")

	if methodsHeader == "" ||
		!strings.Contains(methodsHeader, "OPTIONS") ||
		!strings.Contains(methodsHeader, "POST") ||
		!strings.Contains(methodsHeader, "GET") {
		t.Errorf("Access-Control-Allow-Methods is not set properly, got %v", methodsHeader)
	}

	if originHeader != origin {
		t.Errorf("Access-Control-Allow-Origin is not set properly, got %v", originHeader)
	}
	// check body
	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Error(err)
	}
	str := string(bytes)
	if str != hello {
		t.Errorf("expect %v, got %v", hello, str)
	}
}
