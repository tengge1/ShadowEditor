// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package typeface

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

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Typeface/Add", Add, server.Administrator)
}

// Add upload a typeface.
func Add(w http.ResponseWriter, r *http.Request) {
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
	savePath := fmt.Sprintf("/Upload/Font/%v/%v", helper.TimeToString(now, "yyyyMMddHHmmss"), fileName)

	physicalPath := server.MapPath(savePath)
	physicalDir := filepath.Dir(physicalPath)

	if _, err := os.Stat(physicalDir); os.IsNotExist(err) {
		os.MkdirAll(physicalDir, 0755)
	}

	if _, err := os.Stat(physicalPath); err == nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The file is already existed.",
		})
		return
	}

	source, _ := file.Open()
	defer source.Close()

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
		"Url":         savePath,
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
