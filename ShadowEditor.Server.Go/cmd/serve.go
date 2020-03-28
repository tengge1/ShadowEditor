package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var serveCmd = &cobra.Command{
	Use:     "serve",
	Short:   "Use shadoweditor server to provider data",
	Aliases: []string{"server"},
	Long:    `Use shadoweditor server to provider data.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("ShadowEditor serve started")
	},
}
