package helper

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestEnableCrossDomain(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("Origin", "http://192.168.0.2") // just test
		EnableCrossDomain(w, r)
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}

	t.Logf("Access-Control-Allow-Methods: %v", res.Header.Get("Access-Control-Allow-Methods"))
	t.Logf("Access-Control-Allow-Origin: %v", res.Header.Get("Access-Control-Allow-Origin"))
}
