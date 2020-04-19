package helper

import (
	"fmt"
	"strings"
)

// MapPath convert a root relative path to physical absolute path.
func MapPath(path string) string {
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	return fmt.Sprintf("../ShadowEditor.Web%v", path)
}
