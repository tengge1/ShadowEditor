package mesh

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
	mesh := Mesh{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Mesh/List", mesh.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Mesh/Add", mesh.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Mesh/Edit", mesh.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Mesh/Delete", mesh.Delete)
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Mesh/Download", mesh.Download)
}

// Mesh 网格控制器
type Mesh struct {
}

// List 获取列表
func (Mesh) List(w http.ResponseWriter, r *http.Request) {
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
		"Type": "Mesh",
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
			db.FindMany(server.MeshCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(server.MeshCollectionName, &docs, &opts)
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
			// CreateTime:   doc["CreateTime"].(primitive.DateTime).Time(),
			// UpdateTime:   doc["UpdateTime"].(primitive.DateTime).Time(),
			Thumbnail: thumbnail,
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
func (Mesh) Add(w http.ResponseWriter, r *http.Request) {
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

	savePath := fmt.Sprintf("/Upload/Model/%v", helper.TimeToString(now, "yyyyMMddHHmmss"))
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
	meshType := Unknown

	infos, err := ioutil.ReadDir(physicalPath)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	for _, info := range infos {
		if info.IsDir() {
			continue
		}
		if strings.HasSuffix(strings.ToLower(info.Name()), ".3ds") {
			entryFileName = savePath + info.Name()
			meshType = ThreeDs
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".3mf") {
			entryFileName = savePath + info.Name()
			meshType = ThreeMf
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".amf") {
			entryFileName = savePath + info.Name()
			meshType = Amf
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".assimp") {
			entryFileName = savePath + info.Name()
			meshType = Assimp
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".bin") {
			entryFileName = savePath + info.Name()
			meshType = Binary
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".json") {
			entryFileName = savePath + info.Name()
			meshType = JSON
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".js") {
			entryFileName = savePath + info.Name()
			meshType = Js
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".awd") {
			entryFileName = savePath + info.Name()
			meshType = Awd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".babylon") {
			entryFileName = savePath + info.Name()
			meshType = Babylon
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".bvh") {
			entryFileName = savePath + info.Name()
			meshType = Bvh
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".ctm") {
			entryFileName = savePath + info.Name()
			meshType = Ctm
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".dae") {
			entryFileName = savePath + info.Name()
			meshType = Dae
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".drc") {
			entryFileName = savePath + info.Name()
			meshType = Drc
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".fbx") {
			entryFileName = savePath + info.Name()
			meshType = Fbx
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".gcode") {
			entryFileName = savePath + info.Name()
			meshType = Gcode
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".glb") {
			entryFileName = savePath + info.Name()
			meshType = Glb
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".gltf") {
			entryFileName = savePath + info.Name()
			meshType = Gltf
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".kmz") {
			entryFileName = savePath + info.Name()
			meshType = Kmz
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".md2") {
			entryFileName = savePath + info.Name()
			meshType = Md2
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".nrrd") {
			entryFileName = savePath + info.Name()
			meshType = Nrrd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".obj") {
			entryFileName = savePath + info.Name()
			meshType = Obj
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pcd") {
			entryFileName = savePath + info.Name()
			meshType = Pcd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pdb") {
			entryFileName = savePath + info.Name()
			meshType = Pdb
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".ply") {
			entryFileName = savePath + info.Name()
			meshType = Ply
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pmd") {
			entryFileName = savePath + info.Name()
			meshType = Pmd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pmx") {
			entryFileName = savePath + info.Name()
			meshType = Pmx
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".prwm") {
			entryFileName = savePath + info.Name()
			meshType = Prwm
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".sea") {
			entryFileName = savePath + info.Name()
			meshType = Sea3d
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".stl") {
			entryFileName = savePath + info.Name()
			meshType = Stl
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".vrm") {
			entryFileName = savePath + info.Name()
			meshType = Vrm
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".wrl") {
			entryFileName = savePath + info.Name()
			meshType = Vrml
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".vtk") {
			entryFileName = savePath + info.Name()
			meshType = Vtk
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".x") {
			entryFileName = savePath + info.Name()
			meshType = X
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".lmesh") {
			lmesh := info.Name()
			lanim := ""
			ltexture := ""
			for _, n := range infos {
				if strings.HasSuffix(strings.ToLower(info.Name()), ".lanim") {
					lanim = n.Name()
				} else if strings.HasSuffix(strings.ToLower(info.Name()), ".png") {
					ltexture = n.Name()
				}
			}
			if lanim == "" {
				helper.WriteJSON(w, server.Result{
					Code: 300,
					Msg:  "lanim file is not uploaded!",
				})
				return
			}
			if ltexture == "" {
				helper.WriteJSON(w, server.Result{
					Code: 300,
					Msg:  "png file is not uploaded!",
				})
				return
			}
			lmesh = savePath + lmesh
			lanim = savePath + lanim
			ltexture = savePath + ltexture
			entryFileName = fmt.Sprintf("%v;%v;%v", lmesh, lanim, ltexture)
			meshType = Lol
			break
		}
	}

	if meshType == Unknown {
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
		"Type":        meshType,
		"Url":         entryFileName,
	}

	if server.Config.Authority.Enabled {
		user, err := server.GetCurrentUser(r)

		if err != nil && user != nil {
			doc["UserID"] = user.ID
		}
	}

	db.InsertOne(server.MeshCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Upload successfully!",
	})
}

// Edit 编辑
func (Mesh) Edit(w http.ResponseWriter, r *http.Request) {
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

	image := strings.TrimSpace(r.FormValue("Image"))
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
		"_id": id,
	}
	set := bson.M{
		"Name":        name,
		"TotalPinYin": pinyin.TotalPinYin,
		"FirstPinYin": pinyin.FirstPinYin,
		"Thumbnail":   image,
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

	db.UpdateOne(server.AnimationCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Mesh) Delete(w http.ResponseWriter, r *http.Request) {
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
	find, _ := db.FindOne(server.AnimationCollectionName, filter, &doc)

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

	db.DeleteOne(server.AnimationCollectionName, filter)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}

// Download 下载
func (Mesh) Download(w http.ResponseWriter, r *http.Request) {

}
