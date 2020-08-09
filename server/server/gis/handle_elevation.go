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
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/dimfeld/httptreemux"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

var (
	elevation = ArcgisElevation{}
)

func init() {
	server.Handle(http.MethodGet, "/api/Map/Elevation/", elevation.HandlePJSON, server.None)
	server.Handle(http.MethodGet, "/api/Map/Elevation/tile/:z/:y/:x", elevation.HandleTiles, server.None)
	server.Handle(http.MethodGet, "/api/Map/Elevation/tilemap/:z/:y/:x/:v/:u", elevation.HandleTilemap, server.None)
}

// ArcgisElevation cache elevations from arcgis server.
// Visit: http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D
type ArcgisElevation struct {
}

// HandlePJSON serves WorldElevation3D metadata from arcgis server.
func (a ArcgisElevation) HandlePJSON(w http.ResponseWriter, r *http.Request) {
	path := server.MapPath("/Upload/Tiles/Atm/WorldElevation3D.json")
	if _, err := os.Stat(path); err == nil {
		a.serveFile(w, r, path)
		return
	}

	url := "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/?f=pjson"
	byts, err := helper.Get(url)
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

	a.serveFile(w, r, path)
}

// HandleTiles serves elevation tiles from arcgis server.
func (a ArcgisElevation) HandleTiles(w http.ResponseWriter, r *http.Request) {
	params := httptreemux.ContextParams(r.Context())
	x, err := strconv.Atoi(params["x"])
	y, err := strconv.Atoi(params["y"])
	z, err := strconv.Atoi(params["z"])
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	path := server.MapPath(fmt.Sprintf("/Upload/Tiles/Atm/Tiles/%v/%v/%v.elev", z, y, x))
	if _, err := os.Stat(path); err == nil {
		a.serveFile(w, r, path)
		return
	}

	url := fmt.Sprintf("http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/%v/%v/%v", z, y, x)
	byts, err := helper.Get(url)
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

	a.serveFile(w, r, path)
}

// HandleTilemap serves elevation tilemaps from arcgis server.
func (a ArcgisElevation) HandleTilemap(w http.ResponseWriter, r *http.Request) {
	params := httptreemux.ContextParams(r.Context())
	x, err := strconv.Atoi(params["x"])
	y, err := strconv.Atoi(params["y"])
	z, err := strconv.Atoi(params["z"])
	u, err := strconv.Atoi(params["u"])
	v, err := strconv.Atoi(params["v"])
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	path := server.MapPath(fmt.Sprintf("/Upload/Tiles/Atm/Tilemap/%v/%v/%v/%v/%v.json", z, y, x, v, u))
	if _, err := os.Stat(path); err == nil {
		a.serveFile(w, r, path)
		return
	}

	url := fmt.Sprintf("https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tilemap/%v/%v/%v/%v/%v", z, y, x, v, u)
	byts, err := helper.Get(url)
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

	a.serveFile(w, r, path)
}

// serveFile serve a arcgis file.
func (ArcgisElevation) serveFile(w http.ResponseWriter, r *http.Request, path string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// w.Header().Set("Cache-Control", "max-age=86400")
	// w.Header().Set("ETag", "0od3nd2cbk83")
	// w.Header().Set("Server", "Apache")
	// w.Header().Set("Vary", "Accept-Encoding")
	// w.Header().Set("X-Robots-Tag:", "noindex")

	if _, err := os.Stat(path); os.IsNotExist(err) {
		server.Logger.Errorf("%v not found", path)
		w.WriteHeader(http.StatusNotFound)
		return
	}
	byts, err := ioutil.ReadFile(path)
	if err != nil {
		server.Logger.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(byts)
}
