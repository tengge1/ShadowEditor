// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
)

// NewLogger create a new logger to generate logs.
func NewLogger(path string) (*Logger, error) {
	dir := filepath.Dir(path)
	_, err := os.Stat(dir)
	if os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	file, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		return nil, err
	}
	logger := log.New(file, "", log.Ldate|log.Ltime)
	return &Logger{logger}, nil
}

// Logger a logger that can record messages.
type Logger struct {
	logger *log.Logger
}

type logLevel string

const (
	debug logLevel = "Debug"
	info  logLevel = "Info"
	warn  logLevel = "Warn"
	erro  logLevel = "Error"
	fatal logLevel = "Fatal"
)

// Debug write a debug log.
func (l Logger) Debug(msg string) {
	l.outputf(debug, "%v", msg)
}

// Debugf write a debug log.
func (l Logger) Debugf(format string, v ...interface{}) {
	l.outputf(debug, format, v...)
}

// Info write an info log.
func (l Logger) Info(msg string) {
	l.outputf(info, "%v", msg)
}

// Infof write an info log.
func (l Logger) Infof(format string, v ...interface{}) {
	l.outputf(info, format, v...)
}

// Warn write a warn log.
func (l Logger) Warn(msg string) {
	l.outputf(warn, "%v", msg)
}

// Warnf write a warn log.
func (l Logger) Warnf(format string, v ...interface{}) {
	l.outputf(warn, format, v...)
}

// Error write an error log.
func (l Logger) Error(msg string) {
	l.outputf(erro, "%v", msg)
}

// Errorf write an error log.
func (l Logger) Errorf(format string, v ...interface{}) {
	l.outputf(erro, format, v...)
}

// Fatal write a fatal log.
func (l Logger) Fatal(msg string) {
	l.outputf(fatal, "%v", msg)
}

// Fatalf write a fatal log.
func (l Logger) Fatalf(format string, v ...interface{}) {
	l.outputf(fatal, format, v...)
}

func (l Logger) outputf(typ logLevel, format string, v ...interface{}) {
	_, file, line, ok := runtime.Caller(2)
	if !ok {
		file = "???"
		line = 0
	} else {
		short := file
		for i := len(file) - 1; i > 0; i-- {
			if file[i] == '/' {
				short = file[i+1:]
				break
			}
		}
		file = short
	}
	l.logger.Printf("[%v] %v:%v %v", typ, file, line, fmt.Sprintf(format, v...))
}
