package context

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMux(t *testing.T) {
	Mux.UsingContext().Handle(http.MethodGet, "/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, world!"))
	})
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Mux.ServeHTTP(w, r)
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()

	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Error(err)
		return
	}
	if string(bytes) != "Hello, world!" {
		t.Errorf("mux expect `Hello, world!`, get `%v`", string(bytes))
	}
}
