// +build ignore

package server

import (
	"os"
	"io"
	"fmt"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/model/animation"
	"github.com/tengge1/shadoweditor/model/category"

	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	animation := Animation{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Animation/List", animation.List)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Animation/Add", animation.Add)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Animation/Edit", animation.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Animation/Delete", animation.Delete)
}

// Animation 动画控制器
type Animation struct {
}

// List 获取列表
func (Animation) List(w http.ResponseWriter, r *http.Request) {
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
		"Type": "Animation",
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
			db.FindMany(shadow.AnimationCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(shadow.AnimationCollectionName, &docs, &opts)
	}

	list := []animation.Model{}
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

		totalPinYin, ok := doc["TotalPinYin"].(string)
		if !ok {
			arr := doc["TotalPinYin"].(primitive.A)
			for _, item := range arr {
				totalPinYin += item.(string)
			}
		}
		firstPinYin, ok := doc["FirstPinYin"].(string)
		if !ok {
			arr := doc["TotalPinYin"].(primitive.A)
			for _, item := range arr {
				firstPinYin += item.(string)
			}
		}

		thumbnail, _ := doc["Thumbnail"].(string)

		info := animation.Model{
			ID:           doc["_id"].(primitive.ObjectID).Hex(),
			Name:         doc["Name"].(string),
			CategoryID:   categoryID,
			CategoryName: categoryName,
			TotalPinYin:  totalPinYin,
			FirstPinYin:  firstPinYin,
			Type:         doc["Type"].(string),
			URL:          doc["Url"].(string),
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
func (Animation) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	var Request = HttpContext.Current.Request;
    var Server = HttpContext.Current.Server;

    if len(r.FormFile) == 0 {
        helper.WriteJSON(w, model.Result {
            Code: 300,
            Msg: "Please select an file.",
		})
		return
    }

    // 文件信息
    var file = Request.Files[0];
    var fileName = file.FileName;
    var fileSize = file.ContentLength;
    var fileType = file.ContentType;
    var fileExt = Path.GetExtension(fileName);
    var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

    if fileExt == null || strings.ToLower(fileExt) != ".zip" {
        helper.WriteJSON(w, model.Result {
            Code: 300,
            Msg: "Only zip file is allowed!",
		})
		return
    }

    // 保存文件
    var now = DateTime.Now;

    savePath := fmt.Sprintf("/Upload/Animation/%v", helper.TimeToString(now, "yyyyMMddHHmmss"));
    physicalPath := Server.MapPath(savePath);

    tempPath := physicalPath + "\\temp" // zip压缩文件临时保存目录

    if !Directory.Exists(tempPath) {
        Directory.CreateDirectory(tempPath);
    }

    file.SaveAs("{tempPath}\\{fileName}");

	// 解压文件
    ZipHelper.Unzip($"{tempPath}\\{fileName}", physicalPath);

	// 删除临时目录
	os.RemoveAll(tempPath)

    // 判断文件类型
	entryFileName := ""
	
    animationType := animation.Unknown

    var files = Directory.GetFiles(physicalPath);

    if files.Where(o => o.ToLower().EndsWith(".vmd")).Count() > 0 { // mmd动画文件或mmd相机动画文件
        entryFileName = files.Where(o => o.ToLower().EndsWith(".vmd")).FirstOrDefault();
        entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
        animationType = AnimationType.mmd;
    }

    if entryFileName == null || animationType == AnimationType.unknown {
        Directory.Delete(physicalPath, true);

        helper.WriteJSON(w, model.Result {
            Code: 300,
            Msg: "Unknown file type!",
		})
		return
    }

    pinyin := helper.GetTotalPinYin(fileNameWithoutExt);

    // 保存到Mongo
	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result {
            Code: 300,
            Msg: err.Error(),
		})
		return
	}

    doc := bson.M {
        "AddTime": BsonDateTime.Create(now),
        "FileName": fileName,
        "FileSize": fileSize,
        "FileType": fileType,
        "FirstPinYin": string.Join("", pinyin.FirstPinYin),
        "Name": fileNameWithoutExt,
        "SaveName": fileName,
        "SavePath": savePath,
        "Thumbnail": "",
        "TotalPinYin": string.Join("", pinyin.TotalPinYin),
        "Type": animationType.ToString(),
        "Url": entryFileName,
    }

    if context.Config.Authority.Enabled {
        user := context.GetCurrentUser();

        if user != null {
            doc["UserID"] = user.ID;
        }
    }

    db.InsertOne(Constant.AnimationCollectionName, doc)

    helper.WriteJSON(w, model.Result {
        Code: 200,
        Msg: "Upload successfully!",
    })
}

// Edit 编辑
func (Animation) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}
	name := strings.TrimSpace(r.FormValue("Name"))
	description := strings.TrimSpace(r.FormValue("Description"))

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

	// 判断是否是系统内置角色
	filter := bson.M{
		"ID": id,
	}
	doc := bson.M{}
	find, _ := db.FindOne(shadow.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, model.Result{
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

	db.UpdateOne(shadow.RoleCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Animation) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
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
	find, _ := db.FindOne(shadow.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "It is not allowed to delete system built-in roles.",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(shadow.RoleCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
