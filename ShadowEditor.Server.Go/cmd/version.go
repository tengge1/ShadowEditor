package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of ShadowEditor",
	Long:  `All software has versions. This is ShadowEditor's`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("ShadowEditor Static Site Generator v0.4.6 -- HEAD")
	},
}
