package timeformat

import (
	"testing"
	"time"
)

func TestFormat(t *testing.T) {
	now := time.Now()
	t.Log(now.Format("2006-01-02T15:04:05Z07:00"))
	t.Log(now.Format("2007-01-02T15:04:05Z07:00"))
}
