package system

import (
	"net/http"

	"github.com/tengge1/shadoweditor/context"
)

func init() {
	authority := OperatingAuthority{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/OperatingAuthority/Get", authority.Get)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/OperatingAuthority/Save", authority.Save)
}

// OperatingAuthority 操作权限管理
type OperatingAuthority struct {
}

// Get 根据角色ID获取权限
func (OperatingAuthority) Get(w http.ResponseWriter, r *http.Request) {

}

// Save 保存
func (OperatingAuthority) Save(w http.ResponseWriter, r *http.Request) {

}
