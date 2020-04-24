package editor

import (
	"os"
	"path/filepath"

	"github.com/tengge1/shadoweditor/server/export/editor/data"
)

// CreateDataFile create data files to the export scene.
func CreateDataFile(path string) {
	dirName := filepath.Join(path, "api")

	if _, err := os.Stat(dirName); err != nil {
		os.MkdirAll(dirName, 0755)
	}

	data.CreateAssetsDataFile(path)
	data.CreateAnimationDataFile(path)
	data.CreateAudioDataFile(path)
	data.CreateCategoryDataFile(path)
	data.CreateMapDataFile(path)
	data.CreateMaterialDataFile(path)
	data.CreateMeshDataFile(path)
	data.CreateExportSceneDataFile(path)
	data.CreateSceneDataFile(path)
	data.CreateToolsDataFile(path)
	data.CreateUploadDataFile(path)
}
