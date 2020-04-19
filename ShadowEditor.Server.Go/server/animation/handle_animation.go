package animation

import (
	"fmt"
	"io"
	"io/ioutil"
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
	handler := Animation{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Animation/List", handler.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Animation/Add", handler.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Animation/Edit", handler.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Animation/Delete", handler.Delete)
}

// Animation 动画控制器
type Animation struct {
}

// List 获取列表
func (Animation) List(w http.ResponseWriter, r *http.Request) {
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
		"Type": "Animation",
	}
	categories := []category.Model{}
	db.FindMany(server.CategoryCollectionName, filter, &categories)

	docs := bson.A{}

	opts := options.FindOptions{
		Sort: bson.M{
			"_id": -1,
		},
	}

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		if user != nil {
			filter1 := bson.M{
				"UserID": user.ID,
			}

			if user.RoleName == "Administrator" {
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
			db.FindMany(server.AnimationCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(server.AnimationCollectionName, &docs, &opts)
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

		thumbnail, _ := doc["Thumbnail"].(string)

		info := Model{
			ID:           doc["_id"].(primitive.ObjectID).Hex(),
			Name:         doc["Name"].(string),
			CategoryID:   categoryID,
			CategoryName: categoryName,
			TotalPinYin:  helper.PinYinToString(doc["TotalPinYin"]),
			FirstPinYin:  helper.PinYinToString(doc["FirstPinYin"]),
			Type:         doc["Type"].(string),
			URL:          doc["Url"].(string),
			Thumbnail:    thumbnail,
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
func (Animation) Add(w http.ResponseWriter, r *http.Request) {
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

	if strings.ToLower(fileExt) != ".zip" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Only zip file is allowed!",
		})
		return
	}

	// save file
	now := time.Now()

	savePath := fmt.Sprintf("/Upload/Animation/%v", helper.TimeToString(now, "yyyyMMddHHmmss"))
	physicalPath := helper.MapPath(savePath)

	tempPath := physicalPath + "\\temp"

	if _, err := os.Stat(tempPath); os.IsNotExist(err) {
		os.MkdirAll(tempPath, 0755)
	}

	targetPath := fmt.Sprintf("%v/%v", tempPath, fileName)
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

	helper.UnZip(targetPath, physicalPath)

	os.RemoveAll(tempPath)

	// justify file type
	entryFileName := ""
	animationType := Unknown

	infos, err := ioutil.ReadDir(physicalPath)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	for _, info := range infos {
		if !info.IsDir() && strings.HasSuffix(strings.ToLower(info.Name()), ".vmd") {
			entryFileName = savePath + info.Name()
			animationType = Mmd
			break
		}
	}

	if animationType == Unknown {
		os.RemoveAll(physicalPath)
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Unknown file type!",
		})
		return
	}

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
		"Thumbnail":   "",
		"TotalPinYin": pinyin.TotalPinYin,
		"Type":        animationType,
		"Url":         entryFileName,
	}

	if server.Config.Authority.Enabled {
		user, err := server.GetCurrentUser(r)

		if err != nil && user != nil {
			doc["UserID"] = user.ID
		}
	}

	db.InsertOne(server.AnimationCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Upload successfully!",
	})
}

// Edit 编辑
func (Animation) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}
	name := strings.TrimSpace(r.FormValue("Name"))
	description := strings.TrimSpace(r.FormValue("Description"))

	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
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

	// 判断是否是系统内置角色
	filter := bson.M{
		"ID": id,
	}
	doc := bson.M{}
	find, _ := db.FindOne(server.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Modifying system built-in roles is not allowed.",
		})
		return
	}

	// 更新用户信息
	update := bson.M{
		"$set": bson.M{
			"Name":        name,
			"UpdateTime":  time.Now(),
			"Description": description,
		},
	}

	db.UpdateOne(server.RoleCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Animation) Delete(w http.ResponseWriter, r *http.Request) {
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
		"ID": id,
	}

	doc := bson.M{}
	find, _ := db.FindOne(server.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "It is not allowed to delete system built-in roles.",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(server.RoleCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
