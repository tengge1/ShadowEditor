// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package backupdatabase

import (
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/BackupDatabase/Run", Handle, server.Administrator)
}

// Handle backup collections to a directory.
func Handle(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// Get `mongodump` path.
	cmd := bson.M{
		"serverStatus": 1,
	}

	sr, err := db.RunCommand(cmd)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	var doc bson.D
	err = sr.Decode(&doc)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	status := doc.Map()

	path := status["process"].(string)
	dir := filepath.Dir(path)

	var dump string
	if strings.HasPrefix(runtime.GOOS, "windows") {
		dump = filepath.Join(dir, "mongodump.exe")

		if _, err := os.Stat(dump); os.IsNotExist(err) {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "mongodump is not existed.",
			})
			return
		}
	} else {
		dump = filepath.Join(dir, "mongodump")
	}

	// Get mongodb information.
	uri, _ := url.Parse(db.ConnectionString)
	host := uri.Hostname()
	port := uri.Port()
	dbName := db.DatabaseName
	now := time.Now()

	backupDir := server.MapPath("../backup/database/dump" + helper.TimeToString(now, "yyyyMMddHHmmss"))

	if _, err := os.Stat(backupDir); os.IsNotExist(err) {
		os.MkdirAll(backupDir, 0755)
	}

	// Start a process to backup MongoDB.
	process := exec.Command(dump, "--host", host, "--port", port, "--db", dbName, "--out", backupDir)

	err = process.Run()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	result := backupResult{}
	result.Code = 200
	result.Msg = "Backup database successfully!"
	result.Path = backupDir
	helper.WriteJSON(w, result)
}

type backupResult struct {
	server.Result
	Path string
}
