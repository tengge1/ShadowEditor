package middleware

import (
	"compress/gzip"
	"net/http"
	"strconv"
	"strings"
)

// GZipHandler is responsible for determining if the incoming request should be served gzipped data.
func GZipHandler(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	encoding := r.Header.Get("Accept-Encoding")
	if encoding == "" {
		next.ServeHTTP(w, r)
		return
	}

	compress := true

	for _, n := range strings.Split(encoding, ",") {
		if (strings.Contains(n, "gzip") || strings.Contains(n, "*")) && strings.HasSuffix(n, ";q=0") {
			compress = false
			break
		}
	}

	if !compress {
		next.ServeHTTP(w, r)
		return
	}

	w.Header().Set("Content-Encoding", "gzip")

	next.ServeHTTP(gzipResponseWriter{resp: w}, r)
}

// gzipResponseWriter is responsible for compressing responses
// when the http status code == 200.
type gzipResponseWriter struct {
	status int
	resp   http.ResponseWriter
}

func (w gzipResponseWriter) Header() http.Header {
	return w.resp.Header()
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	if w.status != http.StatusOK {
		return w.resp.Write(b)
	}

	writer := gzip.NewWriter(w.resp)
	defer writer.Close()

	n, err := writer.Write(b)
	if err != nil {
		return 0, err
	}

	w.resp.Header().Set("Content-Length", strconv.Itoa(n))

	return n, nil
}

func (w gzipResponseWriter) WriteHeader(i int) {
	w.resp.Header().Del("Content-Length")
	w.status = i
	w.resp.WriteHeader(i)
}
