// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

// Reference URL: https://github.com/andrewkroh/sys/blob/master/windows/svc/example/manage.go

// +build windows

package win

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"github.com/tengge1/shadoweditor/cmd"
	"golang.org/x/sys/windows/svc"
	"golang.org/x/sys/windows/svc/mgr"
)

// stopCmd stop ShadowEditor service on Windows.
var stopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop service on Windows",
	Long:  `Stop service on Windows`,
	Run: func(cmd *cobra.Command, args []string) {
		if err := controlService(ServiceName, svc.Stop, svc.Stopped); err != nil {
			fmt.Println(err.Error())
		}
	},
}

func init() {
	cmd.AddCommand(stopCmd)
}

func controlService(name string, c svc.Cmd, to svc.State) error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()
	s, err := m.OpenService(name)
	if err != nil {
		return fmt.Errorf("could not access service: %v", err)
	}
	defer s.Close()
	status, err := s.Control(c)
	if err != nil {
		return fmt.Errorf("could not send control=%d: %v", c, err)
	}
	timeout := time.Now().Add(10 * time.Second)
	for status.State != to {
		if timeout.Before(time.Now()) {
			return fmt.Errorf("timeout waiting for service to go to state=%d", to)
		}
		time.Sleep(300 * time.Millisecond)
		status, err = s.Query()
		if err != nil {
			return fmt.Errorf("could not retrieve service status: %v", err)
		}
	}
	return nil
}
