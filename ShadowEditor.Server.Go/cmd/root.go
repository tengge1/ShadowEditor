package main

import (
	"github.com/spf13/cobra"
)

var (
	cfgFile string

	rootCmd = &cobra.Command{
		Use:   "ShadowEditor",
		Short: "3d scene editor based on three.js",
		Long: `ShadowEditor is a 3d scene editor based on three.js.
This application uses mongodb to store data.`,
	}
)

// Execute executes the root command.
func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "./config.toml", "config file")

	rootCmd.AddCommand(serveCmd)
	rootCmd.AddCommand(versionCmd)
}
