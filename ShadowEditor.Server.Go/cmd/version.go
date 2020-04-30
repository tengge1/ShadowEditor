package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// versionCmd show the version information.
//
// TODO: move the version number to one place,
// then it is easy to modify when we publish new version.
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of ShadowEditor",
	Long:  `All software has versions. This is ShadowEditor's`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("ShadowEditor version: v0.4.6")
	},
}
