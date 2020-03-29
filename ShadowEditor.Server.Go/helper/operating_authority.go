package helper

import (
	"github.com/tengge1/shadoweditor/helper/authority"
	"github.com/tengge1/shadoweditor/model/system"
)

// GetAllOperatingAuthorities Get all operatingAuthorities
func GetAllOperatingAuthorities() []system.OperatingAuthority {
	authorities := []system.OperatingAuthority{}

	for key, value := range authority.All {
		authorities = append(authorities, system.OperatingAuthority{
			ID:   key,
			Name: value,
		})
	}

	return authorities
}
