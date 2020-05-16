// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // mysql driver
)

// NewMySQL create a new MySQL client.
func NewMySQL(host string, port uint16, username, password, database string) *MySQL {
	db, err := sql.Open("mysql", fmt.Sprintf("%v:%v@tcp(%v:%v)/%v", username, password, host, port, database))
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	return &MySQL{db}
}

// MySQL represent a new MySQL client.
type MySQL struct {
	DB *sql.DB
}

// checkDB check whether db is already created.
func (m MySQL) checkDB() {
	if m.DB == nil {
		panic("db is not created")
	}
}

// Prepare creates a prepared statement for later queries or executions.
func (m MySQL) Prepare(query string) (stat *sql.Stmt) {
	m.checkDB()

	stat, err := m.DB.Prepare(query)
	if err != nil {
		panic(err)
	}

	return
}

// Exec executes a query without returning any rows.
func (m MySQL) Exec(query string, args ...interface{}) (result sql.Result) {
	m.checkDB()

	result, err := m.DB.Exec(query, args...)
	if err != nil {
		panic(err)
	}

	return
}

// Query executes a query that returns rows, typically a SELECT.
func (m MySQL) Query(query string, args ...interface{}) (rows *sql.Rows) {
	m.checkDB()

	rows, err := m.DB.Query(query, args...)
	if err != nil {
		panic(err)
	}

	return
}

// QueryRow executes a query that is expected to return at most one row.
func (m MySQL) QueryRow(query string, args ...interface{}) (rows *sql.Row) {
	m.checkDB()

	return m.DB.QueryRow(query, args...)
}

// Close closes the database and prevents new queries from starting.
func (m MySQL) Close() {
	m.checkDB()

	if err := m.DB.Close(); err != nil {
		panic(err)
	}
}
