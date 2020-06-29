// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package nasa

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Map/Tiles", Tiles, server.None)
}

// Tiles returns a map tile.
func Tiles(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	x, err := strconv.Atoi(r.FormValue("x"))
	y, err := strconv.Atoi(r.FormValue("y"))
	z, err := strconv.Atoi(r.FormValue("z"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	path := server.MapPath(fmt.Sprintf("/Upload/Tiles/Bing/%v/%v/%v.png", z, y, x))
	if _, err := os.Stat(path); err == nil {
		byts, err := ioutil.ReadFile(path)
		if err != nil {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}
		writeByts(w, byts)
		return
	}

	quadKey := TileXYToQuadKey(x, y, z)
	url := fmt.Sprintf("http://t0.ssl.ak.tiles.virtualearth.net/tiles/a%v.jpeg?g=5793", quadKey)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	req.Header.Set("Referer", "http://cn.bing.com/ditu/")
	req.Header.Set("UserAgent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36")

	client := http.Client{}
	resp, err := client.Do(r)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	byts, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	dir := filepath.Dir(path)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	if err := ioutil.WriteFile(path, byts, 0755); err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	writeByts(w, byts)
}

func writeByts(w http.ResponseWriter, byts []byte) {
	header := w.Header()
	header.Set("Content-Length", strconv.Itoa(len(byts)))
	header.Set("Content-Type", "image/png")
	w.WriteHeader(http.StatusOK)
	w.Write(byts)
}
