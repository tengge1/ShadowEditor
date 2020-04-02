package helper

import (
	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/model/system"
)

// GetAllOperatingAuthorities Get all operatingAuthorities
func GetAllOperatingAuthorities() []system.OperatingAuthority {
	authorities := []system.OperatingAuthority{}

	for key, value := range shadow.OperatingAuthority {
		authorities = append(authorities, system.OperatingAuthority{
			ID:   key,
			Name: value,
		})
	}

	return authorities
}
