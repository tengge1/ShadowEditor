// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package gis

import (
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Map/Elev", HandleElev, server.None)
}

// HandleElev returns a nasa elev tile.
func HandleElev(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	x, err := strconv.Atoi(r.FormValue("x"))
	y, err := strconv.Atoi(r.FormValue("y"))
	z, err := strconv.Atoi(r.FormValue("z")) // wrong
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	bbox := r.FormValue("bbox")
	aabb := strings.Split(bbox, ",")
	minLon, err := strconv.ParseFloat(aabb[0], 64)
	maxLon, err := strconv.ParseFloat(aabb[2], 64)
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	z = int(math.Log2(360 / (maxLon - minLon)))

	path := server.MapPath(fmt.Sprintf("/Upload/Tiles/Elev/%v/%v/%v.bil", z, y, x))
	if _, err := os.Stat(path); err == nil {
		byts, err := ioutil.ReadFile(path)
		if err != nil {
			server.Logger.Error(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		writeByts(w, "application/bil16", byts)
		return
	}

	url := fmt.Sprintf("https://worldwind26.arc.nasa.gov/elev?service=WMS&request=GetMap&version=1.3.0&transparent=TRUE&layers=GEBCO&styles=&format=application/bil16&width=256&height=256&crs=EPSG:4326&bbox=%v", bbox)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	req.Header.Set("UserAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36")

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	byts, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	dir := filepath.Dir(path)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	if err := ioutil.WriteFile(path, byts, 0755); err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	writeByts(w, "application/bil16", byts)
}
