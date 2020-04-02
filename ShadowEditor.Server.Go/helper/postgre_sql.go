package helper

import (
	"context"
	"fmt"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

// PostgreSQL PostgreSQL helper
type PostgreSQL struct {
	Connection *pgx.Conn
}

// Create create new PostgreSQL Client width connString
func (p PostgreSQL) Create(host string, port uint16, user, password, database string) (*PostgreSQL, error) {
	connConfig := pgx.ConnConfig{
		Config: pgconn.Config{
			Host:     host,
			Port:     port,
			User:     user,
			Password: password,
			Database: database,
		},
	}
	conn, err := pgx.ConnectConfig(context.Background(), &connConfig)
	if err != nil {
		return nil, err
	}

	p.Connection = conn

	return &p, nil
}

// Query query records with sql string
func (p PostgreSQL) Query(sql string) (pgx.Rows, error) {
	if p.Connection == nil {
		return nil, fmt.Errorf("connection is not created")
	}
	rows, err := p.Connection.Query(context.Background(), sql)
	if err != nil {
		return nil, err
	}
	return rows, nil
}
