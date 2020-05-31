// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package summary

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Assets/List", List, server.None)
}

// List returns the assets info list.
func List(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	var sceneCount, meshCount, mapCount, materialCount, audioCount, animationCount, particleCount,
		prefabCount, characterCount, screenshotCount, videoCount int64

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		filter1 := bson.M{
			"IsPublic": true, // public scenes
		}

		var filter bson.M
		if user != nil { // user is login
			filter2 := bson.M{
				"UserID": user.ID, // user's scenes
			}
			if user.RoleName == "Administrator" { // admin user
				filter3 := bson.M{
					"UserID": bson.M{
						"$exists": 0, // scenes without UserID
					},
				}
				filter = bson.M{
					"$or": bson.A{
						filter1,
						filter2,
						filter3,
					},
				}
			} else { // ordinary user
				filter = bson.M{
					"$or": bson.A{
						filter1,
						filter2,
					},
				}
			}
		} else { // guest
			filter = bson.M{
				"$or": bson.A{
					filter1,
				},
			}
		}
		sceneCount, _ = db.Count(server.SceneCollectionName, filter)
		meshCount, _ = db.Count(server.MeshCollectionName, filter)
		mapCount, _ = db.Count(server.MapCollectionName, filter)
		materialCount, _ = db.Count(server.MaterialCollectionName, filter)
		audioCount, _ = db.Count(server.AudioCollectionName, filter)
		animationCount, _ = db.Count(server.AnimationCollectionName, filter)
		particleCount, _ = db.Count(server.ParticleCollectionName, filter)
		prefabCount, _ = db.Count(server.PrefabCollectionName, filter)
		characterCount, _ = db.Count(server.CharacterCollectionName, filter)
		screenshotCount, _ = db.Count(server.ScreenshotCollectionName, filter)
		videoCount, _ = db.Count(server.VideoCollectionName, filter)
	} else {
		filter := bson.M{}

		sceneCount, _ = db.Count(server.SceneCollectionName, filter)
		meshCount, _ = db.Count(server.MeshCollectionName, filter)
		mapCount, _ = db.Count(server.MapCollectionName, filter)
		materialCount, _ = db.Count(server.MaterialCollectionName, filter)
		audioCount, _ = db.Count(server.AudioCollectionName, filter)
		animationCount, _ = db.Count(server.AnimationCollectionName, filter)
		particleCount, _ = db.Count(server.ParticleCollectionName, filter)
		prefabCount, _ = db.Count(server.PrefabCollectionName, filter)
		characterCount, _ = db.Count(server.CharacterCollectionName, filter)
		screenshotCount, _ = db.Count(server.ScreenshotCollectionName, filter)
		videoCount, _ = db.Count(server.VideoCollectionName, filter)
	}

	result := Result{
		SceneCount:      sceneCount,
		MeshCount:       meshCount,
		MapCount:        mapCount,
		MaterialCount:   materialCount,
		AudioCount:      audioCount,
		AnimationCount:  animationCount,
		ParticleCount:   particleCount,
		PrefabCount:     prefabCount,
		CharacterCount:  characterCount,
		ScreenshotCount: screenshotCount,
		VideoCount:      videoCount,
	}
	result.Code = 200
	result.Msg = "Get Successfully!"

	helper.WriteJSON(w, result)
}

// Result is a result contains assets nums.
type Result struct {
	server.Result
	SceneCount      int64 `json:"sceneCount"`
	MeshCount       int64 `json:"meshCount"`
	MapCount        int64 `json:"mapCount"`
	MaterialCount   int64 `json:"materialCount"`
	AudioCount      int64 `json:"audioCount"`
	AnimationCount  int64 `json:"animationCount"`
	ParticleCount   int64 `json:"particleCount"`
	PrefabCount     int64 `json:"prefabCount"`
	CharacterCount  int64 `json:"characterCount"`
	ScreenshotCount int64 `json:"screenshotCount"`
	VideoCount      int64 `json:"videoCount"`
}
