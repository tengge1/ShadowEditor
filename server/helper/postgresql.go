// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"context"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

// NewPostgreSQL create a new postgreSQL connection.
//
// TODO: PostgreSQL and PostGIS is useful in GIS. We may add GIS feature in the feature.
func NewPostgreSQL(host string, port uint16, user, password, database string) *PostgreSQL {
	connConfig, err := pgx.ParseConfig("")
	if err != nil {
		panic(err)
	}
	connConfig.Host = host
	connConfig.Port = port
	connConfig.User = user
	connConfig.Password = password
	connConfig.Database = database

	conn, err := pgx.ConnectConfig(context.Background(), connConfig)
	if err != nil {
		panic(err)
	}

	err = conn.Ping(context.TODO())
	if err != nil {
		panic(err)
	}

	return &PostgreSQL{conn}
}

// PostgreSQL postgreSQL connection.
type PostgreSQL struct {
	Connection *pgx.Conn
}

func (p PostgreSQL) checkConn() {
	if p.Connection == nil {
		panic("connection is not created")
	}
}

// Query query records with sql string.
func (p PostgreSQL) Query(sql string, args ...interface{}) (rows pgx.Rows) {
	p.checkConn()

	rows, err := p.Connection.Query(context.Background(), sql, args...)
	if err != nil {
		panic(err)
	}

	return
}

// Exec execute a sql.
func (p PostgreSQL) Exec(sql string, args ...interface{}) (tag pgconn.CommandTag) {
	p.checkConn()

	tag, err := p.Connection.Exec(context.TODO(), sql, args...)
	if err != nil {
		panic(err)
	}

	return
}

// Close close connection.
func (p PostgreSQL) Close() {
	p.checkConn()

	if err := p.Connection.Close(context.TODO()); err != nil {
		panic(err)
	}
}
