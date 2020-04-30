package server

// GetAllOperatingAuthorities returns all operating authorities.
func GetAllOperatingAuthorities() []OperatingAuthority {
	list := []OperatingAuthority{}

	for _, val := range authorities {
		list = append(list, OperatingAuthority{
			ID:   val[0],
			Name: val[1],
		})
	}

	return list
}

var authorities = [][]string{
	{"ADMINISTRATOR", Administrator},
	{"LOGIN", Login},
	{"LIST_ANIMATION", ListAnimation},
	{"ADD_ANIMATION", AddAnimation},
	{"EDIT_ANIMATION", EditAnimation},
	{"DELETE_ANIMATION", DeleteAnimation},
	{"LIST_AUDIO", ListAudio},
	{"ADD_AUDIO", AddAudio},
	{"EDIT_AUDIO", EditAudio},
	{"DELETE_AUDIO", DeleteAudio},
	{"LIST_CATEGORY", ListCategory},
	{"SAVE_CATEGORY", SaveCategory},
	{"DELETE_CATEGORY", DeleteCategory},
	{"LIST_CHARACTER", ListCharacter},
	{"EDIT_CHARACTER", EditCharacter},
	{"SAVE_CHARACTER", SaveCharacter},
	{"DELETE_CHARACTER", DeleteCharacter},
	{"LIST_MAP", ListMap},
	{"ADD_MAP", AddMap},
	{"EDIT_MAP", EditMap},
	{"DELETE_MAP", DeleteMap},
	{"LIST_MATERIAL", ListMaterial},
	{"EDIT_MATERIAL", EditMaterial},
	{"SAVE_MATERIAL", SaveMaterial},
	{"DELETE_MATERIAL", DeleteMaterial},
	{"LIST_MESH", ListMesh},
	{"ADD_MESH", AddMesh},
	{"EDIT_MESH", EditMesh},
	{"DELETE_MESH", DeleteMesh},
	{"LIST_PARTICLE", ListParticle},
	{"EDIT_PARTICLE", EditParticle},
	{"SAVE_PARTICLE", SaveParticle},
	{"DELETE_PARTICLE", DeleteParticle},
	{"LIST_PREFAB", ListPrefab},
	{"EDIT_PREFAB", EditPrefab},
	{"SAVE_PREFAB", SavePrefab},
	{"DELETE_PREFAB", DeletePrefab},
	{"EDIT_SCENE", EditScene},
	{"SAVE_SCENE", SaveScene},
	{"PUBLISH_SCENE", PublishScene},
	{"DELETE_SCENE", DeleteScene},
	{"LIST_SCREENSHOT", ListScreenshot},
	{"ADD_SCREENSHOT", AddScreenshot},
	{"EDIT_SCREENSHOT", EditScreenshot},
	{"DELETE_SCREENSHOT", DeleteScreenshot},
	{"LIST_VIDEO", ListVideo},
	{"ADD_VIDEO", AddVideo},
	{"EDIT_VIDEO", EditVideo},
	{"DELETE_VIDEO", DeleteVideo},
}

const (
	// Administrator means the user has all the authorities.
	Administrator string = "Administrator"
	// Login means the user has logined in.
	Login string = "Login"
	// ListAnimation means the user can get the animation list.
	ListAnimation string = "List Animation"
	// AddAnimation means the user can upload animation.
	AddAnimation string = "Add Animation"
	// EditAnimation means the user can edit the animation name and thumbnail he uploaded.
	EditAnimation string = "Edit Animation"
	// DeleteAnimation means the user can delete the animation he uploaded.
	DeleteAnimation string = "Delete Animation"
	// ListAudio means the user can get the audio list.
	ListAudio string = "List Audio"
	// AddAudio means the user can upload audio.
	AddAudio string = "Add Audio"
	// EditAudio means the user can edit audio name and thumbnail he uploaded.
	EditAudio string = "Edit Audio"
	// DeleteAudio means the user can delete audio he uploaded.
	DeleteAudio string = "Delete Audio"
	// ListCategory means the user can get his category list.
	ListCategory string = "List Category"
	// SaveCategory means the user can add new category.
	SaveCategory string = "Save Category"
	// DeleteCategory means the user can delete his category.
	DeleteCategory string = "Delete Category"
	// ListCharacter means the user can get the character list.
	ListCharacter string = "List Character"
	// EditCharacter means the user can edit character name and thumbnail he uploaded.
	EditCharacter string = "Edit Character"
	// SaveCharacter means the user can save new character he created.
	SaveCharacter string = "Save Character"
	// DeleteCharacter means the user can delete character he created.
	DeleteCharacter string = "Delete Character"
	// ListMap means the user can get the texture list.
	ListMap string = "List Map"
	// AddMap means the user can add new texture.
	AddMap string = "Add Map"
	// EditMap means the user can edit texture name and thumbnail he uploaded.
	EditMap string = "Edit Map"
	// DeleteMap means the user can delete the texture he uploaded.
	DeleteMap string = "Delete Map"
	// ListMaterial means the user can get the material list.
	ListMaterial string = "List Material"
	// EditMaterial means the user can edit material name and thumbnail he saved.
	EditMaterial string = "Edit Material"
	// SaveMaterial means the user can save a new material.
	SaveMaterial string = "Save Material"
	// DeleteMaterial means the user can delete the material he saved.
	DeleteMaterial string = "Delete Material"
	// ListMesh means the user can get the mesh list.
	ListMesh string = "List Mesh"
	// AddMesh means the user can upload new mesh.
	AddMesh string = "Add Mesh"
	// EditMesh means the user can edit mesh name and thumbnail he uploaded.
	EditMesh string = "Edit Mesh"
	// DeleteMesh means the user can delete mesh he uploaded.
	DeleteMesh string = "Delete Mesh"
	// ListParticle means the user can get the particle list.
	ListParticle string = "List Particle"
	// EditParticle means the user can edit particle name and thumbnail he saved.
	EditParticle string = "Edit Particle"
	// SaveParticle means the user can save new particle.
	SaveParticle string = "Save Particle"
	// DeleteParticle means the user can delete particle he saved.
	DeleteParticle string = "Delete Particle"
	// ListPrefab means the user can get prefab list.
	ListPrefab string = "List Prefab"
	// EditPrefab means the user can edit prefab name and thumbnail.
	EditPrefab string = "Edit Prefab"
	// SavePrefab means the user can save new prefab.
	SavePrefab string = "SavePrefab"
	// DeletePrefab means the user can delete prefab.
	DeletePrefab string = "Delete Prefab"
	// EditScene means the user can edit scene name and thumbnail he saved.
	EditScene string = "Edit Scene"
	// SaveScene means the user can save new scene.
	SaveScene string = "Save Scene"
	// PublishScene means the user can publish new scene to static content.
	PublishScene string = "Publish Scene"
	// DeleteScene means the user can delete scenes he saved.
	DeleteScene string = "Delete Scene"
	// ListScreenshot means the user can get the screenshot list.
	ListScreenshot string = "List Screenshot"
	// AddScreenshot means the user can save new screenshot.
	AddScreenshot string = "Add Screenshot"
	// EditScreenshot means the user can edit screenshot name and thumbnail he saved.
	EditScreenshot string = "Edit Screenshot"
	// DeleteScreenshot means the user can delete screenshot he saved.
	DeleteScreenshot string = "Delete Screenshot"
	// ListVideo means the user can get the video list he saved.
	ListVideo string = "List Video"
	// AddVideo means the user can record new video and upload.
	AddVideo string = "Add Video"
	// EditVideo means the user can edit video name and thumbnail he saved.
	EditVideo string = "Edit Video"
	// DeleteVideo means the user can delete video he uploaded.
	DeleteVideo string = "Delete Video"
)

// OperatingAuthority is operating authority model.
type OperatingAuthority struct {
	// ID is authority ID.
	ID string
	// Name is authority name.
	Name string
}
