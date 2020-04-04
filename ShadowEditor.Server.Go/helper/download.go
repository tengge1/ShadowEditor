package helper

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

// Download download a file from server
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
