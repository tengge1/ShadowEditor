// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"net/http"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server/system"
	"go.mongodb.org/mongo-driver/bson"
)

// ValidateTokenMiddleware is used to validate user's credentials.
func ValidateTokenMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	if !Config.Authority.Enabled { // authority is not enabled
		next(w, r)
		return
	}

	auth, ok := apiAuthorities[r.URL.Path]
	if !ok {
		// path is not registered.
		Logger.Errorf("%v is not registered", r.URL.Path)
		writeNotAllowed(w)
		return
	}

	// api needs no authority
	if auth == None {
		logAPI(r.URL.Path, auth, "", true)
		next(w, r)
		return
	}

	// check whether user has the authority required
	user, _ := GetCurrentUser(r)
	username := ""

	if user != nil {
		username = user.Username
		for _, item := range user.OperatingAuthorities {
			if item == string(auth) {
				logAPI(r.URL.Path, auth, user.Username, true)
				next(w, r)
				return
			}
		}
	}

	// check whether can initialize the system
	if auth == Initialize && canInitialize() {
		logAPI(r.URL.Path, auth, username, true)
		next(w, r)
		return
	}

	// user doesn't has the authority required
	logAPI(r.URL.Path, auth, username, false)
	writeNotAllowed(w)
}

// writeNotAllowed write a not allowed response to the client.
func writeNotAllowed(w http.ResponseWriter) {
	result := Result{
		Code: 301,
		Msg:  "Not allowed.",
	}
	json, _ := helper.ToJSON(result)
	w.Write(json)
}

// canInitialize means if we can initialize the system. Return true when
// the system is not initialized.
func canInitialize() bool {
	db, err := Mongo()
	if err != nil {
		return false
	}

	config := system.Config{}
	find, err := db.FindOne(ConfigCollectionName, bson.M{}, &config)
	if err != nil {
		return false
	}

	return !find || !config.Initialized
}

// logAPI logs the request path and the execute result.
func logAPI(path string, auth Authority, username string, success bool) {
	if username == "" {
		// Guest means the user who is not logged in.
		username = "Guest"
	}

	result := "Fail"
	if success {
		result = "Success"
	}

	Logger.Infof("%v %v %v %v", path, string(auth), username, result)
}
