package texture

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/model/category"

	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	texture := Texture{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Map/List", texture.List)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Map/Add", texture.Add)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Map/Edit", texture.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Map/Delete", texture.Delete)
}

// Texture 贴图控制器
type Texture struct {
}

// List 获取列表
func (Texture) List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// 获取所有类别
	filter := bson.M{
		"Type": "Map",
	}
	categories := []category.Model{}
	db.FindMany(shadow.CategoryCollectionName, filter, &categories)

	docs := bson.A{}

	opts := options.FindOptions{
		Sort: bson.M{
			"_id": -1,
		},
	}

	if context.Config.Authority.Enabled {
		user, _ := context.GetCurrentUser(r)

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
			db.FindMany(shadow.MapCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(shadow.MapCollectionName, &docs, &opts)
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

		var buffer bytes.Buffer

		if url, ok := doc["Url"].(primitive.D); ok { // 立体贴图
			imgs := url.Map()
			buffer.WriteString(imgs["PosX"].(string) + ";")
			buffer.WriteString(imgs["NegX"].(string) + ";")
			buffer.WriteString(imgs["PosY"].(string) + ";")
			buffer.WriteString(imgs["NegY"].(string) + ";")
			buffer.WriteString(imgs["PosZ"].(string) + ";")
		} else { // 其他贴图
			buffer.WriteString(doc["Url"].(string))
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
			URL:          strings.TrimRight(buffer.String(), ";"),
			CreateTime:   doc["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:   doc["UpdateTime"].(primitive.DateTime).Time(),
			Thumbnail:    thumbnail,
		}
		list = append(list, info)
	}

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Add 添加
func (Texture) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(context.Config.Upload.MaxSize)
	files := r.MultipartForm.File

	// 校验上传文件
	if len(files) != 1 && len(files) != 6 {
		helper.WriteJSON(w, model.Result{
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
			helper.WriteJSON(w, model.Result{
				Code: 300,
				Msg:  "Only jpg, png, mp4 file is allowed to upload!",
			})
			return
		}
	}

	// 保存文件
	now := time.Now()

	savePath := fmt.Sprintf("/Upload/Texture/%v", helper.TimeToString(now, "yyyyMMddHHmmss"))
	physicalPath := helper.MapPath(savePath)

	if _, err := os.Stat(physicalPath); os.IsNotExist(err) {
		os.MkdirAll(physicalPath, 0755)
	}

	for _, val := range files {
		target, err := os.Create(fmt.Sprintf("%v/%v", physicalPath, val[0].Filename))
		if err != nil {
			helper.WriteJSON(w, model.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}
		defer target.Close()

		source, err := val[0].Open()
		if err != nil {
			helper.WriteJSON(w, model.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}
		defer source.Close()
		io.Copy(target, source)
	}

	// 保存到Mongo
	// 立体贴图的情况，除Url外，所有信息取posX的信息即可。
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

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
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
		// TODO: 通过插件获取mp4缩略图
		doc["Thumbnail"] = ""
	} else {
		// TODO: 天空球太大，缩略图最好处理一下
		doc["Thumbnail"] = fmt.Sprintf("%v/%v", savePath, fileName)
	}

	doc["TotalPinYin"] = pinyin.TotalPinYin

	if len(files) == 6 { // 立体贴图
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

	if context.Config.Authority.Enabled {
		user, err := context.GetCurrentUser(r)

		if err != nil && user != nil {
			doc["UserID"] = user.ID
		}
	}

	db.InsertOne(shadow.MapCollectionName, doc)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Upload successfully!",
	})
}

// Edit 编辑
func (Texture) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	name := strings.TrimSpace(r.FormValue("Name"))
	category := strings.TrimSpace(r.FormValue("Category"))

	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	if name == "" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
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
		update["unset"] = bson.M{
			"Category": 1,
		}
	} else {
		set["Category"] = category
	}

	db.UpdateOne(shadow.MapCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Texture) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"ID": id,
	}

	doc := bson.M{}
	find, _ := db.FindOne(shadow.MapCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The asset is not existed!",
		})
		return
	}

	// 删除纹理所在目录
	path := doc["SavePath"].(string)
	physicalPath := helper.MapPath(path)

	err = os.RemoveAll(physicalPath)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	db.DeleteOne(shadow.MapCollectionName, filter)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
