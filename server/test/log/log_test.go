package log

import (
	"testing"

	"github.com/sirupsen/logrus"
)

func TestLog(t *testing.T) {
	logger := logrus.New()
	logger.Infoln("Hello, world!")
}
