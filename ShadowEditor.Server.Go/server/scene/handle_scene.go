package scene

import (
	"fmt"
	"net/http"
	"strconv"
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
	scene := Scene{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Scene/List", scene.List)
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Scene/HistoryList", scene.HistoryList)
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Scene/Load", scene.Load)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Scene/Edit", scene.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Scene/Save", scene.Save)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Scene/Delete", scene.Delete)
}

// Scene 场景控制器
type Scene struct {
}

// List 获取列表
func (Scene) List(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// 获取所有类别
	categories := []category.Model{}
	db.FindAll(server.CategoryCollectionName, &categories)

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
				"$or": bson.A{
					bson.M{
						"UserID": user.ID,
					},
					bson.M{
						"IsPublic": true,
					},
				},
			}

			if user.Name == "Administrator" {
				filter1 = bson.M{
					"$or": bson.A{
						filter1,
						bson.M{
							"UserID": bson.M{
								"$exists": 0,
							},
						},
					},
				}
			}
			db.FindMany(server.SceneCollectionName, filter1, &docs, &opts)
		} else { // 不登录可以查看所有公开场景
			filter1 := bson.M{
				"IsPublic": true,
			}
			db.FindMany(server.SceneCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(server.SceneCollectionName, &docs, &opts)
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

		thumbnail := ""
		if doc["Thumbnail"] != nil {
			thumbnail = doc["Thumbnail"].(string)
		}

		isPublic := false
		if doc["IsPublic"] != nil {
			isPublic = doc["IsPublic"].(bool)
		}

		info := Model{
			ID:             doc["ID"].(primitive.ObjectID).Hex(),
			Name:           doc["Name"].(string),
			CategoryID:     categoryID,
			CategoryName:   categoryName,
			TotalPinYin:    helper.PinYinToString(doc["TotalPinYin"]),
			FirstPinYin:    helper.PinYinToString(doc["FirstPinYin"]),
			CollectionName: doc["CollectionName"].(string),
			Version:        int(doc["Version"].(int32)),
			CreateTime:     doc["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:     doc["UpdateTime"].(primitive.DateTime).Time(),
			Thumbnail:      thumbnail,
			IsPublic:       isPublic,
		}
		list = append(list, info)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// HistoryList 获取场景历史列表
func (Scene) HistoryList(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
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
	find, _ := db.FindOne(server.SceneCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The scene is not existed!",
		})
		return
	}

	list := []HistoryModel{}

	sceneID := doc["ID"].(primitive.ObjectID).Hex()
	name := doc["CollectionName"].(string)
	version := doc["Version"].(int32)
	createTime := doc["CreateTime"].(primitive.DateTime).Time()

	list = append(list, HistoryModel{
		ID:         doc["_id"].(primitive.ObjectID).Hex(),
		SceneID:    sceneID,
		SceneName:  name,
		Version:    int(version),
		IsNew:      true,
		CreateTime: createTime,
		UpdateTime: doc["UpdateTime"].(primitive.DateTime).Time(),
	})

	// history versions
	historyName := fmt.Sprintf("%v%v", name, server.HistorySuffix)
	historyCollection, _ := db.GetCollection(historyName)

	if historyCollection != nil {
		filter1 := bson.M{
			"metadata.generator": "OptionsSerializer",
		}
		opts1 := options.FindOptions{
			Sort: bson.M{
				"_version": -1,
			},
		}
		docs1 := bson.A{}
		db.FindMany(historyName, filter1, &docs1, &opts1)

		for _, i := range docs1 {
			n := i.(primitive.D).Map()
			historyID := n["_id"].(primitive.ObjectID)

			list = append(list, HistoryModel{
				ID:         historyID.Hex(),
				SceneID:    sceneID,
				SceneName:  name,
				Version:    int(n["_version"].(int32)),
				IsNew:      false,
				CreateTime: createTime,
				UpdateTime: historyID.Timestamp(),
			})
		}
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Load 获取数据
func (Scene) Load(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}
	version := -1
	if _version, err := strconv.Atoi(strings.TrimSpace(r.FormValue("Version"))); err == nil {
		version = _version
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
	find, _ := db.FindOne(server.SceneCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The scene is not existed!",
		})
		return
	}

	collectionName := doc["CollectionName"].(string)

	docs := bson.A{}
	if version == -1 {
		db.FindAll(collectionName, &docs)
	} else {
		filter = bson.M{
			server.VersionField: version,
		}
		db.FindMany(collectionName+server.HistorySuffix, filter, &docs)
	}

	helper.WriteBSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: docs,
	})
}

// Edit 编辑
func (Scene) Edit(w http.ResponseWriter, r *http.Request) {
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
	if strings.HasPrefix(name, "_") {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to start with _.",
		})
		return
	}

	thumbnail := strings.TrimSpace(r.FormValue("Thumbnail"))
	category := strings.TrimSpace(r.FormValue("Category"))
	isPublic := strings.TrimSpace(r.FormValue("IsPublic"))

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		filter11 := bson.M{
			"ID": id,
		}
		doc := bson.M{}
		find, _ := db.FindOne(server.SceneCollectionName, filter11, &doc)

		if !find {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "The scene is not existed.",
			})
			return
		}

		// save other people's scene
		if doc["UserID"] != nil && doc["UserID"].(string) != user.ID {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "Permission denied.",
			})
			return
		}

		// not admin save scene without UserID
		if doc["UserID"] == nil && user.RoleName != "Administrator" {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "Permission denied.",
			})
			return
		}
	}

	pinyin := helper.ConvertToPinYin(name)

	filter := bson.M{
		"ID": id,
	}
	set := bson.M{
		"Name":        name,
		"TotalPinYin": pinyin.TotalPinYin,
		"FirstPinYin": pinyin.FirstPinYin,
		"Thumbnail":   thumbnail,
		"IsPublic":    isPublic == "true",
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

	db.UpdateOne(server.SceneCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Save 保存
func (Scene) Save(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		id = primitive.NewObjectID()
	}

	name := strings.TrimSpace(r.FormValue("Name"))
	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}
	if strings.HasPrefix(name, "_") {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to start with _.",
		})
		return
	}

	data := strings.TrimSpace(r.FormValue("Data"))

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
	find, _ := db.FindOne(server.SceneCollectionName, filter, &doc)

	now := time.Now()
	var collectionName string
	version := -1

	if !find { // create scene
		collectionName = "Scene" + helper.TimeToString(now, "yyyyMMddHHmmss")
		version = 0
	} else { // edit scene
		collectionName = doc["CollectionName"].(string)
		if doc["Version"] != nil {
			version = int(doc["Version"].(int32))
		} else {
			version = 0
		}
		version++
	}

	if !find {
		pinyin := helper.ConvertToPinYin(name)
		doc = bson.M{
			"ID":             id,
			"Name":           name,
			"TotalPinYin":    pinyin.TotalPinYin,
			"FirstPinYin":    pinyin.FirstPinYin,
			"CollectionName": collectionName,
			"Version":        version,
			"CreateTime":     now,
			"UpdateTime":     now,
			"IsPublic":       false,
		}
		if server.Config.Authority.Enabled {
			user, err := server.GetCurrentUser(r)

			if err != nil && user != nil {
				doc["UserID"] = user.ID
			}
		}

		db.InsertOne(server.SceneCollectionName, doc)
	} else {
		update := bson.M{
			"$set": bson.M{
				"Version":    version,
				"UpdateTime": now,
			},
		}
		db.UpdateOne(server.SceneCollectionName, filter, update)

		// move current scene data to history
		old := []bson.M{}
		db.FindAll(collectionName, &old)

		for _, i := range old {
			i[server.VersionField] = version - 1
		}

		if len(old) > 0 {
			// remove _id; otherwise deplicated
			for i := 0; i < len(old); i++ {
				delete(old[i], "_id")
			}

			oldData := []interface{}{}
			for _, i := range old {
				oldData = append(oldData, i)
			}

			db.InsertMany(collectionName+server.HistorySuffix, oldData)
		}
	}

	// save new scene data
	var list []interface{}
	bson.UnmarshalExtJSON([]byte(data), false, &list)

	docs := bson.A{}

	for _, i := range list {
		docs = append(docs, i)
	}

	db.DeleteAll(collectionName)
	db.InsertMany(collectionName, docs)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Scene) Delete(w http.ResponseWriter, r *http.Request) {
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
	find, _ := db.FindOne(server.SceneCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The scene is not existed.",
		})
		return
	}

	// delete scene summary
	db.DeleteOne(server.SceneCollectionName, filter)

	collectionName := doc["CollectionName"].(string)

	// delete scene data
	db.DropCollection(collectionName)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
