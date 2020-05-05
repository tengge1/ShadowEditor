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

	_ "github.com/go-sql-driver/mysql" // mysql driver
)

// NewMySQL create a new MySQL client.
func NewMySQL(host string, port uint16, username, password, database string) (*MySQL, error) {
	db, err := sql.Open("mysql", fmt.Sprintf("%v:%v@tcp(%v:%v)/%v", username, password, host, port, database))
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return &MySQL{db}, nil
}

// MySQL represent a new MySQL client.
type MySQL struct {
	DB *sql.DB
}

// Prepare creates a prepared statement for later queries or executions.
func (m MySQL) Prepare(query string) (*sql.Stmt, error) {
	if m.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return m.DB.Prepare(query)
}

// Exec executes a query without returning any rows.
func (m MySQL) Exec(query string, args ...interface{}) (sql.Result, error) {
	if m.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return m.DB.Exec(query, args...)
}

// Query executes a query that returns rows, typically a SELECT.
func (m MySQL) Query(query string, args ...interface{}) (*sql.Rows, error) {
	if m.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return m.DB.Query(query, args...)
}

// QueryRow executes a query that is expected to return at most one row.
func (m MySQL) QueryRow(query string, args ...interface{}) (*sql.Row, error) {
	if m.DB == nil {
		return nil, fmt.Errorf("db is not created")
	}
	return m.DB.QueryRow(query, args...), nil
}

// Close closes the database and prevents new queries from starting.
func (m MySQL) Close() error {
	if m.DB == nil {
		return fmt.Errorf("db is not created")
	}
	return m.DB.Close()
}
