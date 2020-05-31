// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package user

import (
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/User/ChangePassword", ChangePassword, server.Login)
}

// ChangePassword change a user's password
func ChangePassword(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	oldPassword := strings.TrimSpace(r.FormValue("OldPassword"))
	newPassword := strings.TrimSpace(r.FormValue("NewPassword"))
	confirmPassword := strings.TrimSpace(r.FormValue("ConfirmPassword"))

	user, err := server.GetCurrentUser(r)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if user == nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The user is not existed.",
		})
		return
	}

	// check whether password is empty
	if oldPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Old password is not allowed to be empty.",
		})
		return
	}

	if newPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "New password is not allowed to be empty.",
		})
		return
	}

	if confirmPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Confirm password is not allowed to be empty.",
		})
		return
	}

	if newPassword != confirmPassword {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "New password and confirm password is not the same.",
		})
		return
	}

	// verify old password
	oldPassword = helper.MD5(oldPassword + user.Salt)

	if oldPassword != user.Password {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Old password is not correct.",
		})
		return
	}

	// change password
	salt := helper.TimeToString(time.Now(), "yyyyMMddHHmmss")
	password := helper.MD5(newPassword + salt)

	userID, _ := primitive.ObjectIDFromHex(user.ID)

	filter := bson.M{
		"ID": userID,
	}
	update := bson.M{
		"$set": bson.M{
			"Password": password,
			"Salt":     salt,
		},
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	db.UpdateOne(server.UserCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Password changed successfully!",
	})
}
