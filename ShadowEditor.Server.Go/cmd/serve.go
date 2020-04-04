package main

import (
	"log"
	"os"

	"github.com/spf13/cobra"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/server"
)

var serveCmd = &cobra.Command{
	Use:     "serve",
	Short:   "Start shadoweditor server",
	Aliases: []string{"server"},
	Long:    `Use shadoweditor server to provider scene and model data.`,
	Run: func(cmd *cobra.Command, args []string) {
		_, err := os.Stat(cfgFile)
		if os.IsNotExist(err) {
			log.Fatalf("cannot find config file: %v", cfgFile)
			return
		}

		err = context.Create(cfgFile)
		if err != nil {
			log.Fatal(err)
			return
		}

		server.Start()
	},
}
