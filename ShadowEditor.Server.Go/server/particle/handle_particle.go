package particle

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"github.com/tengge1/shadoweditor/server/category"
)

func init() {
	particle := Particle{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Particle/List", particle.List)
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Particle/Get", particle.Get)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Particle/Edit", particle.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Particle/Save", particle.Save)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Particle/Delete", particle.Delete)
}

// Particle 材质控制器
type Particle struct {
}

// List 获取列表
func (Particle) List(w http.ResponseWriter, r *http.Request) {
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
		"Type": "Particle",
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
			db.FindMany(shadow.ParticleCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(shadow.ParticleCollectionName, &docs, &opts)
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

// Get 获取
func (Particle) Get(w http.ResponseWriter, r *http.Request) {

}

// Edit 编辑
func (Particle) Edit(w http.ResponseWriter, r *http.Request) {

}

// Save 保存
func (Particle) Save(w http.ResponseWriter, r *http.Request) {

}

// Delete 删除
func (Particle) Delete(w http.ResponseWriter, r *http.Request) {

}
