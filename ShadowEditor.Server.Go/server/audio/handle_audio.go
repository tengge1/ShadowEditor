package audio

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
	"github.com/tengge1/shadoweditor/server/category"
)

func init() {
	handler := Audio{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Audio/List", handler.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Audio/Add", handler.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Audio/Edit", handler.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Audio/Delete", handler.Delete)
}

// Audio 音频控制器
type Audio struct {
}

// List 获取列表
func (Audio) List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// 获取所有类别
	filter := bson.M{
		"Type": "Audio",
	}
	categories := []category.Model{}
	db.FindMany(server.CategoryCollectionName, filter, &categories)

	docs := bson.A{}

	opts := options.FindOptions{
		Sort: bson.M{
			"UpdateTime": -1,
		},
	}

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		if user != nil {
			filter1 := bson.M{
				"UserID": user.ID,
			}

			if user.Name == "Administrator" {
				filter2 := bson.M{
					"UserID": bson.M{
						"$exists": 0,
					},
				}
				filter1 = bson.M{
					"$or": bson.A{
						filter1,
						filter2,
					},
				}
			}
			db.FindMany(server.AudioCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(server.AudioCollectionName, &docs, &opts)
	}

	list := []Model{}
	for _, i := range docs {
		doc := i.(primitive.D).Map()
		categoryID := ""
		categoryName := ""

		if doc["Category"] != nil {
			for _, category := range categories {
				if category.ID == doc["Category"].(string) {
					categoryID = category.ID
					categoryName = category.Name
					break
				}
			}
		}

		info := Model{
			ID:           doc["_id"].(primitive.ObjectID).Hex(),
			Name:         doc["Name"].(string),
			CategoryID:   categoryID,
			CategoryName: categoryName,
			TotalPinYin:  helper.PinYinToString(doc["TotalPinYin"]),
			FirstPinYin:  helper.PinYinToString(doc["FirstPinYin"]),
			Type:         doc["Type"].(string),
			URL:          doc["Url"].(string),
			CreateTime:   doc["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:   doc["UpdateTime"].(primitive.DateTime).Time(),
		}

		list = append(list, info)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Add 添加
func (Audio) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(server.Config.Upload.MaxSize)
	files := r.MultipartForm.File

	// check upload file
	if len(files) != 1 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select an file.",
		})
		return
	}

	file := files["file"][0]
	fileName := file.Filename
	fileSize := file.Size
	fileType := file.Header.Get("Content-Type")
	fileExt := filepath.Ext(fileName)
	fileNameWithoutExt := strings.TrimRight(fileName, fileExt)

	if strings.ToLower(fileExt) != ".mp3" && strings.ToLower(fileExt) != ".wav" && strings.ToLower(fileExt) != ".ogg" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Only mp3, wav, ogg format is allowed!",
		})
		return
	}

	// save file
	now := time.Now()

	savePath := fmt.Sprintf("/Upload/Audio/%v", helper.TimeToString(now, "yyyyMMddHHmmss"))
	physicalPath := helper.MapPath(savePath)

	if _, err := os.Stat(physicalPath); os.IsNotExist(err) {
		os.MkdirAll(physicalPath, 0755)
	}

	targetPath := fmt.Sprintf("%v/%v", physicalPath, fileName)
	target, err := os.Create(targetPath)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	defer target.Close()

	source, err := file.Open()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	defer source.Close()

	io.Copy(target, source)

	// save to mongo
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
		"TotalPinYin": pinyin.TotalPinYin,
		"Type":        Unknown,
		"Url":         savePath + fileName,
		"CreateTime":  now,
		"UpdateTime":  now,
	}

	if server.Config.Authority.Enabled {
		user, err := server.GetCurrentUser(r)

		if err != nil && user != nil {
			doc["UserID"] = user.ID
		}
	}

	db.InsertOne(server.AudioCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Upload successfully!",
	})
}

// Edit 编辑
func (Audio) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}

	name := strings.TrimSpace(r.FormValue("Name"))
	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	category := strings.TrimSpace(r.FormValue("Category"))

	// update mongo
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	pinyin := helper.ConvertToPinYin(name)

	filter := bson.M{
		"ID": id,
	}
	set := bson.M{
		"Name":        name,
		"TotalPinYin": pinyin.TotalPinYin,
		"FirstPinYin": pinyin.FirstPinYin,
	}
	update := bson.M{
		"$set": set,
	}
	if category == "" {
		update["$unset"] = bson.M{
			"Category": 1,
		}
	} else {
		set["Category"] = category
	}

	db.UpdateOne(server.AudioCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Audio) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
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
		"_id": id,
	}

	doc := bson.M{}
	find, _ := db.FindOne(server.AudioCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The asset is not existed!",
		})
		return
	}

	path := doc["SavePath"].(string)
	physicalPath := helper.MapPath(path)
	os.RemoveAll(physicalPath)

	db.DeleteOne(server.AudioCollectionName, filter)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
