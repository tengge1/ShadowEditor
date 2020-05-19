// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package scene

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/ExportScene/Run", Scene, server.PublishScene)
}

// Scene publish scene to static contents.
func Scene(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	version, err := strconv.Atoi(strings.TrimSpace(r.FormValue("version")))
	if err != nil {
		version = -1
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"ID": id,
	}

	var doc bson.M
	find, _ := db.FindOne(server.SceneCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The scene is not existed!",
		})
		return
	}

	// get scene data
	collectionName := doc["CollectionName"].(string)

	var docs bson.A

	if version == -1 { // lastest version
		db.FindAll(collectionName, &docs)
	} else { // specific version
		filter = bson.M{
			server.VersionField: version,
		}
		db.FindMany(fmt.Sprintf("%v%v", collectionName, server.HistorySuffix), filter, &docs)
	}

	// create temp dir
	now := time.Now()

	path := server.MapPath(fmt.Sprintf("/temp/%v", helper.TimeToString(now, "yyyyMMddHHmmss")))

	if _, err := os.Stat(path); os.IsNotExist(err) {
		os.MkdirAll(path, 0755)
	}

	// copy static contents
	viewPath := server.MapPath("/view.html")

	bytes, err := ioutil.ReadFile(viewPath)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	viewFileData := string(bytes)

	// replace server url in order to publish to `Git Pages`
	viewFileData = strings.ReplaceAll(viewFileData, "location.origin", "'.'")

	// replace `<%SceneID%>` with real scene id, so it is not necessary to add `SceneID` or `SceneFile` params
	viewFileData = strings.ReplaceAll(viewFileData, "<%SceneID%>", id.Hex())

	ioutil.WriteFile(filepath.Join(path, "view.html"), []byte(viewFileData), 0755)

	faviconPath := server.MapPath("/favicon.ico")
	helper.CopyFile(faviconPath, filepath.Join(path, "favicon.ico"))

	assetsPath := server.MapPath("/assets")
	err = helper.CopyDirectory(assetsPath, filepath.Join(path, "assets"))
	if err != nil {
		log.Println(err.Error())
		return
	}

	buildPath := server.MapPath("/build")
	helper.CopyDirectory(buildPath, filepath.Join(path, "build"))

	// analysis scene, and copy necessary assets
	data := bson.A{}

	urls := []string{}

	for _, i := range docs {
		doc := i.(primitive.D).Map()
		generator := doc["metadata"].(primitive.D).Map()["generator"].(string)

		if generator == "ServerObject" { // server model
			userData := doc["userData"].(primitive.D).Map()
			urls = append(urls, userData["Url"].(string)) // model files

			if val, ok := userData["Animation"].(primitive.D); ok { // MMD animation
				urls = append(urls, val.Map()["Url"].(string))
			}
			if val, ok := userData["CameraAnimation"].(primitive.D); ok { // MMD camara animation
				urls = append(urls, val.Map()["Url"].(string))
			}
			if val, ok := userData["Audio"].(primitive.D); ok { // MMD audio
				urls = append(urls, val.Map()["Url"].(string))
			}
		} else if generator == "SceneSerializer" { // scene
			if val, ok := doc["background"].(primitive.D); ok { // texture or cube texture
				background := val.Map()
				if background["metadata"].(primitive.D).Map()["generator"].(string) == "CubeTextureSerializer" { // cube texture
					array := background["image"].(bson.A)
					for _, j := range array {
						urls = append(urls, j.(primitive.D).Map()["src"].(string))
					}
				} else { // other texture
					urls = append(urls, background["image"].(primitive.D).Map()["src"].(string))
				}
			}
		} else if generator == "MeshSerializer" || generator == "SpriteSerializer" { // mesh
			if val, ok := doc["material"].(bson.A); ok {
				for _, material := range val {
					getURLInMaterial(material.(primitive.D).Map(), &urls)
				}
			} else if val, ok := doc["material"].(primitive.D); ok {
				getURLInMaterial(val.Map(), &urls)
			}
		} else if generator == "AudioSerializer" {
			userData := doc["userData"].(primitive.D).Map()
			urls = append(urls, userData["Url"].(string))
		}

		data = append(data, doc)
	}

	// write scene data to files
	{
		path := filepath.Join(path, "Scene", id.Hex()+".txt")
		dir := filepath.Dir(path)
		if _, err := os.Stat(dir); os.IsNotExist(err) {
			os.MkdirAll(dir, 0755)
		}

		// copy assets
		file, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY, 0755)
		if err != nil {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}
		defer file.Close()

		bytes, err := helper.ToJSON(data)
		if err != nil {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}

		file.Write(bytes)
	}

	for _, url := range urls {
		if !strings.HasPrefix(url, "/") { // maybe base64 url
			continue
		}

		// LOL has multiple urls, and they are split by `;`
		_urls := strings.Split(url, ";")

		for _, _url := range _urls {
			if _url == "" {
				continue
			}

			sourceDirName := filepath.Dir(server.MapPath(_url))
			targetDirName := filepath.Dir(strings.ReplaceAll(path+_url, "/", string(os.PathSeparator)))

			helper.CopyDirectory(sourceDirName, targetDirName)
		}
	}

	result := sceneResult{}
	result.Code = 200
	result.Msg = "Export successfully!"
	result.URL = fmt.Sprintf("/temp/%v/view.html?sceneFile=%v", helper.TimeToString(now, "yyyyMMddHHmmss"), id.Hex())
	helper.WriteJSON(w, result)
}

func getURLInMaterial(material bson.M, urls *[]string) {
	var materials []bson.M
	if val, ok := material["alphaMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["aoMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["bumpMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["displacementMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["emissiveMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["envMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["lightMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["map"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["metalnessMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["normalMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}
	if val, ok := material["roughnessMap"].(primitive.D); ok {
		materials = append(materials, val.Map())
	}

	for _, material := range materials {
		image := material["image"].(primitive.D).Map()
		src := image["src"].(string)
		if strings.HasPrefix(src, "/") {
			*urls = append(*urls, src)
		}
	}
}

type sceneResult struct {
	server.Result
	URL string `json:"Url"`
}
