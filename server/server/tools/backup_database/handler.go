// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package backupdatabase

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/BackupDatabase/Run", Handle)
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
	sr, err := db.RunCommand("{ serverStatus: 1, asserts: 0, repl: 0, metrics: 0, locks: 0 }")
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	var status []map[string]interface{}
	sr.Decode(&status)

	path := status[0]["process"].(string)
	dir := filepath.Dir(path)
	dump := filepath.Join(dir, "mongodump.exe")

	if _, err := os.Stat(dump); os.IsNotExist(err) {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "mongodump.exe is not existed.",
		})
		return
	}

	// Get mongodb information.
	uri, _ := url.Parse(db.ConnectionString)
	host := uri.Host
	port := uri.Port()
	dbName := db.DatabaseName
	now := time.Now()

	backupDir := server.MapPath("/backup/database/dump" + helper.TimeToString(now, "yyyyMMddHHmmss"))

	if _, err := os.Stat(backupDir); os.IsNotExist(err) {
		os.MkdirAll(backupDir, 0755)
	}

	// Start a process to backup MongoDB.
	cmd := fmt.Sprintf("--host %v --port %v --db %v --out %v", host, port, dbName, backupDir)
	process := exec.Command(dump, cmd)
	process.Start()

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
