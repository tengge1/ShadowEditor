// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package login

import (
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Login/Login", Login, server.None)
}

// Login log in the system.
func Login(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := strings.TrimSpace(r.FormValue("Username"))
	password := strings.TrimSpace(r.FormValue("Password"))

	if username == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Username is not allowed to be empty.",
		})
		return
	}

	if password == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Password is not allowed to be empty.",
		})
		return
	}

	// get salt
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"Username": username,
	}

	user := bson.M{}
	find, _ := db.FindOne(server.UserCollectionName, filter, &user)
	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The username or password is wrong.",
		})
		return
	}

	salt := user["Salt"].(string)

	// verity password
	filter1 := bson.M{
		"Password": helper.MD5(password + salt),
	}
	filter = bson.M{
		"$and": bson.A{filter, filter1},
	}

	find, _ = db.FindOne(server.UserCollectionName, filter, &user)
	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The username or password is wrong.",
		})
		return
	}

	// write userID to cookie
	id := user["ID"].(primitive.ObjectID).Hex()

	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(1)).Unix()
	claims["iat"] = time.Now().Unix()
	claims["userID"] = id
	token.Claims = claims

	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	fmt.Fprintln(w, "Error extracting the key")
	// 	fatal(err)
	// }

	tokenString, err := token.SignedString([]byte(server.Config.Authority.SecretKey))
	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Error while signing the token.",
		})
		return
	}

	expire := time.Now().AddDate(0, 0, 1)
	cookie := http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  expire,
		HttpOnly: true,
		Path:     "/",
		SameSite: http.SameSiteDefaultMode,
	}
	http.SetCookie(w, &cookie)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Login successfully!",
		Data: map[string]string{
			"Username": user["Username"].(string),
			"Name":     user["Name"].(string),
		},
	})
}
