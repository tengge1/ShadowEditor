// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"compress/gzip"
	"net/http"
	"strconv"
	"strings"
)

// GZipMiddleware is used for determining if the incoming request should be served gzipped data.
// When the request `Content-Encoding` contains `gzip`, we write a gzipped response.
func GZipMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
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

// gzipResponseWriter is a fake ResponseWriter that is responsible for compressing responses.
type gzipResponseWriter struct {
	status int
	resp   http.ResponseWriter
}

func (w gzipResponseWriter) Header() http.Header {
	return w.resp.Header()
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	writer := gzip.NewWriter(w.resp)
	defer writer.Close()

	n, err := writer.Write(b)
	if err != nil {
		return 0, err
	}

	w.resp.Header().Del("Content-Length")
	w.resp.Header().Set("Content-Length", strconv.Itoa(n))

	return n, nil
}

func (w gzipResponseWriter) WriteHeader(i int) {
	w.status = i
	w.resp.WriteHeader(i)
}
