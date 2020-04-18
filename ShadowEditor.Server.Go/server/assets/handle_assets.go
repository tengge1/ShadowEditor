package assets

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	assets := Assets{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Assets/List", assets.List)
}

// Assets (所有)资源控制器
type Assets struct {
}

// List 获取信息列表
func (Assets) List(w http.ResponseWriter, r *http.Request) {
	db, err := context.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	var sceneCount, meshCount, mapCount, materialCount, audioCount, animationCount, particleCount,
		prefabCount, characterCount, screenshotCount, videoCount int64

	if context.Config.Authority.Enabled {
		user, _ := context.GetCurrentUser(r)
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

			sceneCount, _ = db.Count(shadow.SceneCollectionName, filter)
			meshCount, _ = db.Count(shadow.MeshCollectionName, filter)
			mapCount, _ = db.Count(shadow.MapCollectionName, filter)
			materialCount, _ = db.Count(shadow.MaterialCollectionName, filter)
			audioCount, _ = db.Count(shadow.AudioCollectionName, filter)
			animationCount, _ = db.Count(shadow.AnimationCollectionName, filter)
			particleCount, _ = db.Count(shadow.ParticleCollectionName, filter)
			prefabCount, _ = db.Count(shadow.PrefabCollectionName, filter)
			characterCount, _ = db.Count(shadow.CharacterCollectionName, filter)
			screenshotCount, _ = db.Count(shadow.ScreenshotCollectionName, filter)
			videoCount, _ = db.Count(shadow.VideoCollectionName, filter)
		}
	} else {
		filter := bson.M{}

		sceneCount, _ = db.Count(shadow.SceneCollectionName, filter)
		meshCount, _ = db.Count(shadow.MeshCollectionName, filter)
		mapCount, _ = db.Count(shadow.MapCollectionName, filter)
		materialCount, _ = db.Count(shadow.MaterialCollectionName, filter)
		audioCount, _ = db.Count(shadow.AudioCollectionName, filter)
		animationCount, _ = db.Count(shadow.AnimationCollectionName, filter)
		particleCount, _ = db.Count(shadow.ParticleCollectionName, filter)
		prefabCount, _ = db.Count(shadow.PrefabCollectionName, filter)
		characterCount, _ = db.Count(shadow.CharacterCollectionName, filter)
		screenshotCount, _ = db.Count(shadow.ScreenshotCollectionName, filter)
		videoCount, _ = db.Count(shadow.VideoCollectionName, filter)
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

	helper.WriteJSON(w, result)
}

// AssetsResult a result contains assets nums
type AssetsResult struct {
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
