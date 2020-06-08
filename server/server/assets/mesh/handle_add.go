// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

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

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Mesh/Add", Add, server.AddMesh)
}

// Add upload a mesh.
func Add(w http.ResponseWriter, r *http.Request) {
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
	physicalPath := server.MapPath(savePath)

	tempPath := filepath.Join(physicalPath, "temp")

	if _, err := os.Stat(tempPath); os.IsNotExist(err) {
		os.MkdirAll(tempPath, 0755)
	}

	targetPath := filepath.Join(tempPath, fileName)
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
			// Here is url, DO NOT use filepath.Join
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = ThreeDs
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".3mf") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = ThreeMf
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".amf") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Amf
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".assimp") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Assimp
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".bin") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Binary
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".json") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = JSON
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".js") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Js
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".awd") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Awd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".babylon") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Babylon
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".bvh") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Bvh
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".ctm") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Ctm
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".dae") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Dae
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".drc") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Drc
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".fbx") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Fbx
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".gcode") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Gcode
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".glb") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Glb
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".gltf") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Gltf
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".kmz") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Kmz
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".md2") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Md2
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".nrrd") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Nrrd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".obj") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Obj
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pcd") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Pcd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pdb") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Pdb
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".ply") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Ply
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pmd") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Pmd
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".pmx") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Pmx
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".prwm") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Prwm
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".sea") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Sea3d
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".stl") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Stl
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".vrm") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Vrm
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".wrl") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Vrml
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".vtk") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = Vtk
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".x") {
			entryFileName = fmt.Sprintf("%v/%v", savePath, info.Name())
			meshType = X
			break
		} else if strings.HasSuffix(strings.ToLower(info.Name()), ".lmesh") {
			lmesh := info.Name()
			lanim := ""
			ltexture := ""
			for _, n := range infos {
				if strings.HasSuffix(strings.ToLower(n.Name()), ".lanim") {
					lanim = n.Name()
				} else if strings.HasSuffix(strings.ToLower(n.Name()), ".png") {
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
			lmesh = fmt.Sprintf("%v/%v", savePath, lmesh)
			lanim = fmt.Sprintf("%v/%v", savePath, lanim)
			ltexture = fmt.Sprintf("%v/%v", savePath, ltexture)
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
		user, _ := server.GetCurrentUser(r)

		if user != nil {
			doc["UserID"] = user.ID
		}
	}

	db.InsertOne(server.MeshCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Upload successfully!",
	})
}
