// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

// Reference URL: https://github.com/andrewkroh/sys/blob/master/windows/svc/example/service.go

// +build windows

package win

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/tengge1/shadoweditor/cmd"

	"golang.org/x/sys/windows/svc"
	"golang.org/x/sys/windows/svc/debug"
	"golang.org/x/sys/windows/svc/eventlog"
)

const (
	// ServiceName is the default service name on Windows.
	ServiceName = "ShadowEditor"
	// ServiceDisplayName is the name show in the Service Manager.
	ServiceDisplayName = "Shadow Editor"
)

var elog debug.Log

func init() {
	cmd.ShouldRunService = shouldRunService
}

// shouldRunService determines if this is running as a service.
func shouldRunService() bool {
	isIntSess, err := svc.IsAnInteractiveSession()
	if err != nil {
		fmt.Printf("failed to determine if we are running in an interactive session: %v\n", err)
		return false
	}
	if !isIntSess {
		runService(ServiceName, false)
		return true
	}
	return false
}

// Service is the ShadowEditor service model.
type Service struct{}

// Execute execute the ShadowEditor service.
func (m *Service) Execute(args []string, r <-chan svc.ChangeRequest, changes chan<- svc.Status) (ssec bool, errno uint32) {
	const cmdsAccepted = svc.AcceptStop | svc.AcceptShutdown | svc.AcceptPauseAndContinue
	changes <- svc.Status{State: svc.StartPending}
	elog.Info(1, "start RunServe")
	if err := os.Chdir(filepath.Dir(os.Args[0])); err != nil {
		elog.Error(1, err.Error())
		changes <- svc.Status{State: svc.StopPending}
		return
	}
	// cmd.SetCfgFile(filepath.Join(filepath.Dir(os.Args[0]), "config.toml"))
	go func() {
		if err := cmd.RunServe(); err != nil {
			// something wrong occurs, write to the system logs.
			elog.Error(1, err.Error())
			changes <- svc.Status{State: svc.StopPending}
			return
		}
	}()
	elog.Info(1, "RunServe started")
	changes <- svc.Status{State: svc.Running, Accepts: cmdsAccepted}
loop:
	for {
		select {
		case c := <-r:
			switch c.Cmd {
			case svc.Interrogate:
				elog.Info(1, "Interrogate")
				changes <- c.CurrentStatus
				// Testing deadlock from https://code.google.com/p/winsvc/issues/detail?id=4
				time.Sleep(100 * time.Millisecond)
				changes <- c.CurrentStatus
			case svc.Stop, svc.Shutdown:
				elog.Info(1, "Stop")
				break loop
			default:
				elog.Error(1, fmt.Sprintf("unexpected control request #%d", c))
			}
		}
	}
	changes <- svc.Status{State: svc.StopPending}
	return
}

func runService(name string, isDebug bool) {
	var err error
	if isDebug {
		elog = debug.New(name)
	} else {
		elog, err = eventlog.Open(name)
		if err != nil {
			return
		}
	}
	defer elog.Close()

	elog.Info(1, fmt.Sprintf("starting %s service", name))
	run := svc.Run
	if isDebug {
		run = debug.Run
	}
	err = run(name, &Service{})
	if err != nil {
		elog.Error(1, fmt.Sprintf("%s service failed: %v", name, err))
		return
	}
	elog.Info(1, fmt.Sprintf("%s service stopped", name))
}
