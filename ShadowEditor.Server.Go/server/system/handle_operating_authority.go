package system

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
)

func init() {
	authority := OperatingAuthority{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/OperatingAuthority/Get", authority.Get)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/OperatingAuthority/Save", authority.Save)
}

// OperatingAuthority 操作权限管理
type OperatingAuthority struct {
}

// Get 根据角色ID获取权限
func (OperatingAuthority) Get(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	roleID := r.FormValue("roleID")

	objectID, err := primitive.ObjectIDFromHex(roleID)
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

	// 判断是否是系统内置角色
	filter := bson.M{
		"ID": objectID,
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

	// 获取权限信息
	authorities := shadow.GetAllOperatingAuthorities()
	filter = bson.M{
		"RoleID": roleID,
	}

	docs := []OperatingAuthorityModel{}

	err = db.FindMany(shadow.OperatingAuthorityCollectionName, filter, &docs)

	rows := []map[string]interface{}{}

	for _, i := range authorities {
		// 管理员组默认具有所有权限
		enabled := false
		if roleName == "Administrator" {
			enabled = true
		} else {
			for _, doc := range docs {
				if doc.AuthorityID == i.ID {
					enabled = true
					break
				}
			}
		}

		rows = append(rows, map[string]interface{}{
			"ID":      i.ID,
			"Name":    i.Name,
			"Enabled": enabled,
		})
	}

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: map[string]interface{}{
			"total": len(rows),
			"rows":  rows,
		},
	})
}

// Save 保存
func (OperatingAuthority) Save(w http.ResponseWriter, r *http.Request) {

}

// OperatingAuthorityModel is _operating_authority collection structure.
type OperatingAuthorityModel struct {
	RoleID      string
	AuthorityID string
}
