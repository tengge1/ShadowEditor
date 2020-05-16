// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3" // sqlite3 driver for go using database/sql
)

// NewSQLite create a new sqlite connection.
func NewSQLite(path string) *SQLite {
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}

	return &SQLite{db}
}

// SQLite is a SQLite client.
type SQLite struct {
	DB *sql.DB
}

// checkDB check whether db is created.
func (s SQLite) checkDB() {
	if s.DB == nil {
		panic("db is not created")
	}
}

// Prepare creates a prepared statement for later queries or executions.
func (s SQLite) Prepare(query string) (stat *sql.Stmt) {
	s.checkDB()

	stat, err := s.DB.Prepare(query)
	if err != nil {
		panic(err)
	}

	return
}

// Exec executes a query without returning any rows.
func (s SQLite) Exec(query string, args ...interface{}) (result sql.Result) {
	s.checkDB()

	result, err := s.DB.Exec(query, args...)
	if err != nil {
		panic(err)
	}

	return
}

// Query executes a query that returns rows, typically a SELECT.
func (s SQLite) Query(query string, args ...interface{}) (rows *sql.Rows) {
	s.checkDB()

	rows, err := s.DB.Query(query, args...)
	if err != nil {
		panic(err)
	}

	return
}

// QueryRow executes a query that is expected to return at most one row.
func (s SQLite) QueryRow(query string, args ...interface{}) *sql.Row {
	s.checkDB()

	return s.DB.QueryRow(query, args...)
}

// Close closes the database and prevents new queries from starting.
func (s SQLite) Close() {
	s.checkDB()

	if err := s.DB.Close(); err != nil {
		panic(err)
	}
}
