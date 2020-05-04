// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package tools

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	handler := Typeface{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Typeface/List", handler.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Typeface/Add", handler.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Typeface/Delete", handler.Delete)
}

// Typeface 字体控制器
type Typeface struct {
}

// List 获取列表
func (Typeface) List(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	opts := options.FindOptions{
		Sort: bson.M{
			"Name": 1,
		},
	}

	var docs bson.A
	db.FindAll(server.PluginCollectionName, &docs, &opts)

	list := []Model{}

	for _, i := range docs {
		doc := i.(primitive.D).Map()
		model := Model{
			ID:          doc["ID"].(primitive.ObjectID).Hex(),
			Name:        doc["Name"].(string),
			TotalPinYin: doc["TotalPinYin"].(string),
			FirstPinYin: doc["FirstPinYin"].(string),
			CreateTime:  doc["CreateTime"].(primitive.DateTime).Time(),
		}
		list = append(list, model)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Add 添加
func (Typeface) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(server.Config.Upload.MaxSize)

	files := r.MultipartForm.File
	if len(files) != 1 || !strings.HasSuffix(files["file"][0].Filename, ".ttf") {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Only font file (.ttf) is allowed to upload.",
		})
		return
	}

	file := files["file"][0]
	fileName := file.Filename

	// save file
	now := time.Now()
	savePath := fmt.Sprintf("/Upload/Font/%v", helper.TimeToString(now, "yyyyMMddHHmmss"))

	physicalPath := server.MapPath(savePath)
	if _, err := os.Stat(physicalPath); os.IsNotExist(err) {
		os.MkdirAll(physicalPath, 0755)
	}

	if _, err := os.Stat(filepath.Join(physicalPath, fileName)); os.IsNotExist(err) {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The file is already existed.",
		})
		return
	}

	source, _ := file.Open()
	dest, err := os.Create(physicalPath)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	defer dest.Close()
	io.Copy(dest, source)

	// save to mongo
	// fileSize := file.Size
	// fileType := file.Header.Get("Content-Type")
	fileNameWithoutExt := strings.TrimRight(fileName, filepath.Ext(fileName))

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
		"Name":        fileNameWithoutExt,
		"TotalPinYin": pinyin.TotalPinYin,
		"FirstPinYin": pinyin.FirstPinYin,
		"Url":         filepath.Join(savePath, fileName),
		"CreateTime":  now,
		"UpdateTime":  now,
		"Status":      0,
	}

	db.InsertOne(server.TypefaceCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Typeface) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
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

	doc := bson.M{}
	find, _ := db.FindOne(server.TypefaceCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The asset is not existed!",
		})
		return
	}

	// delete file dir
	url := doc["Url"].(string)
	physicalPath := server.MapPath(url)
	dir := filepath.Dir(physicalPath)

	err = os.RemoveAll(dir)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	db.DeleteOne(server.TypefaceCollectionName, filter)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
