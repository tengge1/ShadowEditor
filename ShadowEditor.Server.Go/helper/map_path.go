package helper

import (
	"fmt"
	"path/filepath"
	"strings"
)

// MapPath convert a root relative path to physical absolute path.
func MapPath(path string) string {
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	path = strings.ReplaceAll(path, "/", string(filepath.Separator))
	return fmt.Sprintf("../ShadowEditor.Web%v", path)
}
