// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package texture

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Map/Add", Add, server.AddTexture)
}

// Add upload a texture.
func Add(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(server.Config.Upload.MaxSize)
	files := r.MultipartForm.File

	// check upload file
	if len(files) != 1 && len(files) != 6 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Only one or six files is allowed to upload!",
		})
		return
	}

	for _, val := range files {
		ext := filepath.Ext(val[0].Filename)
		if ext == "" ||
			strings.ToLower(ext) != ".jpg" &&
				strings.ToLower(ext) != ".jpeg" &&
				strings.ToLower(ext) != ".png" &&
				strings.ToLower(ext) != ".gif" &&
				strings.ToLower(ext) != ".mp4" {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "Only jpg, png, mp4 file is allowed to upload!",
			})
			return
		}
	}

	// save file
	now := time.Now()

	savePath := fmt.Sprintf("/Upload/Texture/%v", helper.TimeToString(now, "yyyyMMddHHmmss"))
	physicalPath := server.MapPath(savePath)

	if _, err := os.Stat(physicalPath); os.IsNotExist(err) {
		os.MkdirAll(physicalPath, 0755)
	}

	for _, val := range files {
		target, err := os.Create(fmt.Sprintf("%v/%v", physicalPath, val[0].Filename))
		if err != nil {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}
		defer target.Close()

		source, err := val[0].Open()
		if err != nil {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}
		defer source.Close()
		io.Copy(target, source)
	}

	// save to Mongo
	// Cute Texture: File info use posX except url.
	var file *multipart.FileHeader = nil
	if len(files) == 6 {
		file = files["PosX"][0]
	} else {
		file = files["file"][0]
	}

	fileName := file.Filename
	fileSize := file.Size
	fileType := file.Header.Get("Content-Type")
	fileExt := filepath.Ext(fileName)
	fileNameWithoutExt := strings.TrimRight(fileName, fileExt)

	pinyin := helper.ConvertToPinYin(fileNameWithoutExt)

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	doc := bson.M{
		"ID":          primitive.NewObjectID(),
		"AddTime":     now,
		"FileName":    fileName,
		"FileSize":    fileSize,
		"FileType":    fileType,
		"FirstPinYin": pinyin.FirstPinYin,
		"Name":        fileNameWithoutExt,
		"SaveName":    fileName,
		"SavePath":    savePath,
	}

	if strings.ToLower(filepath.Ext(file.Filename)) == ".mp4" {
		// TODO: generate mp4 thumbnail
		doc["Thumbnail"] = ""
	} else {
		// TODO: sky ball is too big, generate a thumbnail
		doc["Thumbnail"] = fmt.Sprintf("%v/%v", savePath, fileName)
	}

	doc["TotalPinYin"] = pinyin.TotalPinYin

	if len(files) == 6 { // Cute Texture
		doc["Type"] = Cube

		doc1 := bson.M{
			"PosX": fmt.Sprintf("%v/%v", savePath, files["posX"][0].Filename),
			"NegX": fmt.Sprintf("%v/%v", savePath, files["negX"][0].Filename),
			"PosY": fmt.Sprintf("%v/%v", savePath, files["posY"][0].Filename),
			"NegY": fmt.Sprintf("%v/%v", savePath, files["negY"][0].Filename),
			"PosZ": fmt.Sprintf("%v/%v", savePath, files["posZ"][0].Filename),
			"NegZ": fmt.Sprintf("%v/%v", savePath, files["negZ"][0].Filename),
		}

		doc["Url"] = doc1
	} else if strings.ToLower(filepath.Ext(file.Filename)) == ".mp4" { // 视频贴图
		doc["Type"] = Video
		doc["Url"] = fmt.Sprintf("%v/%v", savePath, fileName)
	} else if fileType == "skyBall" {
		doc["Type"] = SkyBall
		doc["Url"] = fmt.Sprintf("%v/%v", savePath, fileName)
	} else {
		doc["Type"] = Unknown
		doc["Url"] = fmt.Sprintf("%v/%v", savePath, fileName)
	}

	doc["CreateTime"] = now
	doc["UpdateTime"] = now

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		if user != nil {
			doc["UserID"] = user.ID
		}
	}

	db.InsertOne(server.MapCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Upload successfully!",
	})
}
