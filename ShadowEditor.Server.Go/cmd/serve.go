package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

var serveCmd = &cobra.Command{
	Use:     "serve",
	Short:   "Use shadoweditor server to provider data",
	Aliases: []string{"server"},
	Long:    `Use shadoweditor server to provider data.`,
	Run: func(cmd *cobra.Command, args []string) {
		config, err := helper.GetConfig("./config.toml")
		if err != nil {
			log.Fatal(err)
			return
		}

		server.Start(config)
	},
}
