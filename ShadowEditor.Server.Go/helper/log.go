package helper

import (
	"fmt"
	"log"
	"os"
	"runtime"
)

// NewLogger create a new logger
func NewLogger(path string) (*Logger, error) {
	file, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		return nil, err
	}
	logger := log.New(file, "", log.Ldate|log.Ltime)
	return &Logger{logger}, nil
}

// Logger a logger
type Logger struct {
	logger *log.Logger
}

// Debug output a debug log
func (l Logger) Debug(msg string) {
	l.outputf("Debug", "%v", msg)
}

// Debugf output a debug log
func (l Logger) Debugf(format string, v ...interface{}) {
	l.outputf("Debug", format, v...)
}

// Info output an info log
func (l Logger) Info(msg string) {
	l.outputf("Info", "%v", msg)
}

// Infof output an info log
func (l Logger) Infof(format string, v ...interface{}) {
	l.outputf("Info", format, v...)
}

// Warn output a warn log
func (l Logger) Warn(msg string) {
	l.outputf("Warn", "%v", msg)
}

// Warnf output a warn log
func (l Logger) Warnf(format string, v ...interface{}) {
	l.outputf("Warn", format, v...)
}

// Error output an error log
func (l Logger) Error(msg string) {
	l.outputf("Error", "%v", msg)
}

// Errorf output an error log
func (l Logger) Errorf(format string, v ...interface{}) {
	l.outputf("Error", format, v...)
}

// Fatal output a fatal log
func (l Logger) Fatal(msg string) {
	l.outputf("Fatal", "%v", msg)
}

// Fatalf output a fatal log
func (l Logger) Fatalf(format string, v ...interface{}) {
	l.outputf("Fatal", format, v...)
}

func (l Logger) outputf(typ, format string, v ...interface{}) {
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
