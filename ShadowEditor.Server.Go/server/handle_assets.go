package server

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server/base"
)

func init() {
	assets := Assets{}
	base.Register("/api/Assets/List", assets.List)
}

// Assets (所有)资源控制器
type Assets struct {
}

// List 获取信息列表
func (Assets) List(w http.ResponseWriter, r *http.Request) {
	db, err := helper.Mongo()
	if err != nil {
		base.Write(w, err.Error())
		return
	}

	var sceneCount, meshCount, mapCount, materialCount, audioCount, animationCount, particleCount,
		prefabCount, characterCount, screenshotCount, videoCount int64

	if helper.Config.Authority.Enabled {
		user, _ := helper.GetCurrentUser(r)
		if user != nil {
			filter := bson.M{
				"UserID": user.ID,
			}
			if user.RoleName == "Administrator" {
				filter1 := bson.M{
					"$exist": "UserID",
				}
				filter2 := bson.M{
					"$not": filter1,
				}
				filter = bson.M{
					"$or": bson.A{
						filter1,
						filter2,
					},
				}
			}

			sceneCount, _ = db.Collection(helper.SceneCollectionName).CountDocuments(context.TODO(), filter)
			meshCount, _ = db.Collection(helper.MeshCollectionName).CountDocuments(context.TODO(), filter)
			mapCount, _ = db.Collection(helper.MapCollectionName).CountDocuments(context.TODO(), filter)
			materialCount, _ = db.Collection(helper.MaterialCollectionName).CountDocuments(context.TODO(), filter)
			audioCount, _ = db.Collection(helper.AudioCollectionName).CountDocuments(context.TODO(), filter)
			animationCount, _ = db.Collection(helper.AnimationCollectionName).CountDocuments(context.TODO(), filter)
			particleCount, _ = db.Collection(helper.ParticleCollectionName).CountDocuments(context.TODO(), filter)
			prefabCount, _ = db.Collection(helper.PrefabCollectionName).CountDocuments(context.TODO(), filter)
			characterCount, _ = db.Collection(helper.CharacterCollectionName).CountDocuments(context.TODO(), filter)
			screenshotCount, _ = db.Collection(helper.ScreenshotCollectionName).CountDocuments(context.TODO(), filter)
			videoCount, _ = db.Collection(helper.VideoCollectionName).CountDocuments(context.TODO(), filter)
		}
	} else {
		filter := bson.M{}

		sceneCount, _ = db.Collection(helper.SceneCollectionName).CountDocuments(context.TODO(), filter)
		meshCount, _ = db.Collection(helper.MeshCollectionName).CountDocuments(context.TODO(), filter)
		mapCount, _ = db.Collection(helper.MapCollectionName).CountDocuments(context.TODO(), filter)
		materialCount, _ = db.Collection(helper.MaterialCollectionName).CountDocuments(context.TODO(), filter)
		audioCount, _ = db.Collection(helper.AudioCollectionName).CountDocuments(context.TODO(), filter)
		animationCount, _ = db.Collection(helper.AnimationCollectionName).CountDocuments(context.TODO(), filter)
		particleCount, _ = db.Collection(helper.ParticleCollectionName).CountDocuments(context.TODO(), filter)
		prefabCount, _ = db.Collection(helper.PrefabCollectionName).CountDocuments(context.TODO(), filter)
		characterCount, _ = db.Collection(helper.CharacterCollectionName).CountDocuments(context.TODO(), filter)
		screenshotCount, _ = db.Collection(helper.ScreenshotCollectionName).CountDocuments(context.TODO(), filter)
		videoCount, _ = db.Collection(helper.VideoCollectionName).CountDocuments(context.TODO(), filter)
	}

	result := AssetsResult{
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

	base.WriteJSON(w, result)
}

// AssetsResult a result contains assets nums
type AssetsResult struct {
	base.Result
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
