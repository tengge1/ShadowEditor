package system

import (
	_ "github.com/tengge1/shadoweditor/server/system/authority"  // authority api
	_ "github.com/tengge1/shadoweditor/server/system/config"     // config api
	_ "github.com/tengge1/shadoweditor/server/system/department" // department api
	_ "github.com/tengge1/shadoweditor/server/system/initialize" // initialize api
	_ "github.com/tengge1/shadoweditor/server/system/login"      // login api
	_ "github.com/tengge1/shadoweditor/server/system/register"   // register api
	_ "github.com/tengge1/shadoweditor/server/system/role"       // role api
	_ "github.com/tengge1/shadoweditor/server/system/user"       // user api
)
