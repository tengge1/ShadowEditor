// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

import (
	"bufio"
	"fmt"
	"os"

	"github.com/inconshreveable/mousetrap"
	"github.com/spf13/cobra"

	"github.com/tengge1/shadoweditor/server"
)

// serveCmd launch the shadow editor server.
var serveCmd = &cobra.Command{
	Use:     "serve",
	Short:   "Start server",
	Aliases: []string{"server"},
	Long:    `Use shadow editor server to provider scene and model data.`,
	Run: func(cmd *cobra.Command, args []string) {
		if err := RunServe(); err != nil {
			fmt.Println(err.Error())
		}
		wait()
	},
}

func init() {
	AddCommand(serveCmd)
}

// RunServe check the config file, and start the server.
func RunServe() error {
	// Read config file `./config.toml`.
	if _, err := os.Stat(cfgFile); os.IsNotExist(err) {
		return fmt.Errorf("cannot find config file: %v", cfgFile)
	}

	err := server.Create(cfgFile)
	if err != nil {
		return err
	}

	server.Start()

	return nil
}

func wait() {
	// When you double click ShadowEditor.exe in the Windows explorer,
	// wait in order not to crash immediately.
	if mousetrap.StartedByExplorer() {
		reader := bufio.NewReader(os.Stdin)
		reader.ReadString('\n')
	}
}
