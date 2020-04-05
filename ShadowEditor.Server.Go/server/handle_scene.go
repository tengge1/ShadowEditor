package server

import (
	"net/http"

	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/server/base"
)

func init() {
	assets := Assets{}
	base.Register("/api/Scene/List", http.MethodGet, assets.List)
}

// Scene 场景控制器
type Scene struct {
}

// List 获取列表
func (Scene) List(w http.ResponseWriter, r *http.Request) {
	db, err := context.Mongo()
	if err != nil {
		base.Write(w, err.Error())
		return
	}

	_ = db

	// 获取所有类别
	// categories, err := db.Collection(helper.CategoryCollectionName).Find(context.TODO())

	// collection := db.Collection(helper.SceneCollectionName)

	// var docs = []bson.M{}

	// if helper.Config.Authority.Enabled {
	// 	user, _ := helper.GetCurrentUser(r)

	// 	if user != nil {
	// 		filter1 := bson.M{
	// 			"UserID": user.ID,
	// 		}
	// 		filter11 := bson.M{
	// 			"IsPublic": true,
	// 		}
	// 		filter1 = bson.M{
	// 			"$or": bson.A{
	// 				filter1,
	// 				filter11,
	// 			},
	// 		}

	// 		if user.Name == "Administrator" {
	// 			var filter2 = bson.M{
	// 				"UserID": bson.M{
	// 					"$exists": 1,
	// 				},
	// 			}
	// 			var filter3 = bson.M{
	// 				"$not": filter2,
	// 			}
	// 			filter1 = Bson.M{
	// 				"$or": bson.A{
	// 					filter1,
	// 					filter3,
	// 				},
	// 			}
	// 		}
	// 		docs = mongo.FindMany(Constant.SceneCollectionName, filter1).ToList()
	// 	} else { // 不登录可以查看所有公开场景
	// 		filter1 := bson.M{
	// 			"IsPublic": true,
	// 		}
	// 		docs = db.FindMany(context.TODO(), Constant.SceneCollectionName, filter1).ToList()
	// 	}
	// } else {
	// 	docs = db.FindAll(context.TODO(), helper.SceneCollectionName).ToList()
	// }

	// var list = [] model.Scene{}

	// for _, i := range docs {
	// 	var categoryID = "";
	// 	var categoryName = "";

	// 	if i["Category"] && i["Category"] != "" {
	// 		for _, category := categories {

	// 		}

	// 		var doc = categories.Where(n => n["_id"].ToString() == i["Category"].ToString()).FirstOrDefault();
	// 		if (doc != null)
	// 		{
	// 			categoryID = doc["_id"].ToString();
	// 			categoryName = doc["Name"].ToString();
	// 		}
	// 	}

	// 	info := model.Scene {
	// 		ID = i["ID"].AsObjectId.ToString(),
	// 		Name = i["Name"].AsString,
	// 		CategoryID = categoryID,
	// 		CategoryName = categoryName,
	// 		TotalPinYin = i["TotalPinYin"].ToString(),
	// 		FirstPinYin = i["FirstPinYin"].ToString(),
	// 		CollectionName = i["CollectionName"].AsString,
	// 		Version = i["Version"].AsInt32,
	// 		CreateTime = i["CreateTime"].ToUniversalTime(),
	// 		UpdateTime = i["UpdateTime"].ToUniversalTime(),
	// 		Thumbnail = i.Contains("Thumbnail") && !i["Thumbnail"].IsBsonNull ? i["Thumbnail"].ToString() : null,
	// 		IsPublic = i.Contains("IsPublic") ? i["IsPublic"].ToBoolean() : false,
	// 	};
	// 	list.Add(info);
	// }

	// list = list.OrderByDescending(o => o.UpdateTime).ToList();

	// result := base.Result{
	// 	Code: 200,
	// 	Msg: "Get Successfully!"
	// }

	// base.WriteJSON(w, result)
}
