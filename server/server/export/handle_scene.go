// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package export

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
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/ExportScene/Run", Scene)
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

	// 获取场景数据
	collectionName := doc["CollectionName"].(string)

	var docs bson.A

	if version == -1 { // 最新版本
		db.FindAll(collectionName, &docs)
	} else { // 特定版本
		filter = bson.M{
			server.VersionField: version,
		}
		db.FindMany(fmt.Sprintf("%v%v", collectionName, server.HistorySuffix), filter, &docs)
	}

	// 创建临时目录
	now := time.Now()

	path := server.MapPath(fmt.Sprintf("/temp/%v", helper.TimeToString(now, "yyyyMMddHHmmss")))

	if _, err := os.Stat(path); os.IsNotExist(err) {
		os.MkdirAll(path, 0755)
	}

	// 拷贝静态资源
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

	viewFileData = strings.ReplaceAll(viewFileData, "location.origin", "'.'") // 替换server地址，以便部署到Git Pages上
	viewFileData = strings.ReplaceAll(viewFileData, "<%SceneID%>", id.Hex())  // 发布场景自动把`<%SceneID%>`替换成真实场景ID，不再需要加`SceneID`或`SceneFile`参数
	ioutil.WriteFile(filepath.Join(path, "view.html"), []byte(viewFileData), 0755)

	faviconPath := server.MapPath("/favicon.ico")
	helper.CopyFile(faviconPath, filepath.Join(path, "favicon.ico"))

	assetsPath := server.MapPath("/assets")
	err = helper.CopyDirectory(assetsPath, filepath.Join(path, "assets"))
	if err != nil {
		log.Fatal(err)
	}

	buildPath := server.MapPath("/build")
	helper.CopyDirectory(buildPath, filepath.Join(path, "build"))

	// 分析场景，拷贝使用的资源
	data := bson.A{}

	urls := []string{}

	for _, i := range docs {
		doc := i.(primitive.D).Map()
		generator := doc["metadata"].(primitive.D).Map()["generator"].(string)

		if generator == "ServerObject" { // 服务端模型
			userData := doc["userData"].(primitive.D).Map()
			urls = append(urls, userData["Url"].(string)) // 模型文件

			if val, ok := userData["Animation"].(primitive.D); ok { // MMD模型动画
				urls = append(urls, val.Map()["Url"].(string))
			}
			if val, ok := userData["CameraAnimation"].(primitive.D); ok { // MMD相机动画
				urls = append(urls, val.Map()["Url"].(string))
			}
			if val, ok := userData["Audio"].(primitive.D); ok { // MMD音频
				urls = append(urls, val.Map()["Url"].(string))
			}
		} else if generator == "SceneSerializer" { // 场景
			if val, ok := doc["background"].(primitive.D); ok { // 贴图或立方体纹理
				background := val.Map()
				if background["metadata"].(primitive.D).Map()["generator"].(string) == "CubeTextureSerializer" { // 立方体纹理
					array := background["image"].(bson.A)
					for _, j := range array {
						urls = append(urls, j.(primitive.D).Map()["src"].(string))
					}
				} else { // 普通纹理
					urls = append(urls, background["image"].(primitive.D).Map()["src"].(string))
				}
			}
		} else if generator == "MeshSerializer" || generator == "SpriteSerializer" { // 模型
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

	// 将场景写入文件
	{
		path := filepath.Join(path, "Scene", id.Hex()+".txt")
		dir := filepath.Dir(path)
		if _, err := os.Stat(dir); os.IsNotExist(err) {
			os.MkdirAll(dir, 0755)
		}

		// 复制资源
		file, err := os.OpenFile(path, os.O_CREATE, 0755)
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
		if strings.HasPrefix(url, "/") { // 可能是base64地址
			continue
		}

		// LOL模型存在多个url，两个url之间用分号分隔
		_urls := strings.Split(url, ";")

		for _, _url := range _urls {
			if _url == "" {
				continue
			}

			sourceDirName := filepath.Dir(server.MapPath(url))
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
		*urls = append(*urls, image["src"].(string))
	}
}

type sceneResult struct {
	server.Result
	URL string `json:"Url"`
}
