package helper

import (
	"testing"
	"time"
)

func TestTimeToString(t *testing.T) {
	now := time.Now()
	t.Log(TimeToString(now, "yyyy-MM-dd HH:mm:ss"))
	t.Log(TimeToString(now, "yyyyMMddHHmmss"))
	t.Log(TimeToString(now, "yyyyMMdd"))
	t.Log(TimeToString(now, "HHmmss"))
}
