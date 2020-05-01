// +build ignore

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

	_ "github.com/mattn/go-sqlite3" // sqlite3 driver for go using database/sql
)

// NewSQLite create a new sqlite connection.
func NewSQLite(path string) (*SQLite, error) {
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return &SQLite{db}, nil
}

// SQLite is a SQLite client.
type SQLite struct {
	DB *sql.DB
}

// Prepare creates a prepared statement for later queries or executions.
func (s SQLite) Prepare(query string) (*sql.Stmt, error) {
	if s.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return s.DB.Prepare(query)
}

// Exec executes a query without returning any rows.
func (s SQLite) Exec(query string, args ...interface{}) (sql.Result, error) {
	if s.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return s.DB.Exec(query, args...)
}

// Query executes a query that returns rows, typically a SELECT.
func (s SQLite) Query(query string, args ...interface{}) (*sql.Rows, error) {
	if s.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return s.DB.Query(query, args...)
}

// QueryRow executes a query that is expected to return at most one row.
func (s SQLite) QueryRow(query string, args ...interface{}) (*sql.Row, error) {
	if s.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return s.DB.QueryRow(query, args...), nil
}

// Close closes the database and prevents new queries from starting.
func (s SQLite) Close() error {
	if s.DB == nil {
		return fmt.Errorf("db is not created")
	}
	return s.DB.Close()
}
