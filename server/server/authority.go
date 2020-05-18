// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

// GetAllAuthorities returns all operating authorities.
func GetAllAuthorities() []AuthorityModel {
	return authorities
}

var authorities = []AuthorityModel{
	// Administrator means the user has all the authorities.
	{"ADMINISTRATOR", "Administrator"},
	// Login means the user has to log in.
	{"LOGIN", "Login"},
	// ListAnimation means the user can get the animation list.
	{"LIST_ANIMATION", "List Animation"},
	// AddAnimation means the user can upload animation.
	{"ADD_ANIMATION", "Add Animation"},
	// EditAnimation means the user can edit the animation name and thumbnail he uploaded.
	{"EDIT_ANIMATION", "Edit Animation"},
	// DeleteAnimation means the user can delete the animation he uploaded.
	{"DELETE_ANIMATION", "Delete Animation"},
	// ListAudio means the user can get the audio list.
	{"LIST_AUDIO", "List Audio"},
	// AddAudio means the user can upload audio.
	{"ADD_AUDIO", "Add Audio"},
	// EditAudio means the user can edit audio name and thumbnail he uploaded.
	{"EDIT_AUDIO", "Edit Audio"},
	// DeleteAudio means the user can delete audio he uploaded.
	{"DELETE_AUDIO", "Delete Audio"},
	// ListCategory means the user can get his category list.
	{"LIST_CATEGORY", "List Category"},
	// SaveCategory means the user can add new category.
	{"SAVE_CATEGORY", "Save Category"},
	// DeleteCategory means the user can delete his category.
	{"DELETE_CATEGORY", "Delete Category"},
	// ListCharacter means the user can get the character list.
	{"LIST_CHARACTER", "List Character"},
	// EditCharacter means the user can edit character name and thumbnail he uploaded.
	{"EDIT_CHARACTER", "Edit Character"},
	// SaveCharacter means the user can save new character he created.
	{"SAVE_CHARACTER", "Save Character"},
	// DeleteCharacter means the user can delete character he created.
	{"DELETE_CHARACTER", "Delete Character"},
	// ListMap means the user can get the texture list.
	{"LIST_MAP", "List Map"},
	// AddMap means the user can add new texture.
	{"ADD_MAP", "Add Map"},
	// EditMap means the user can edit texture name and thumbnail he uploaded.
	{"EDIT_MAP", "Edit Map"},
	// DeleteMap means the user can delete the texture he uploaded.
	{"DELETE_MAP", "Delete Map"},
	// ListMaterial means the user can get the material list.
	{"LIST_MATERIAL", "List Material"},
	// EditMaterial means the user can edit material name and thumbnail he saved.
	{"EDIT_MATERIAL", "Edit Material"},
	// SaveMaterial means the user can save a new material.
	{"SAVE_MATERIAL", "Save Material"},
	// DeleteMaterial means the user can delete the material he saved.
	{"DELETE_MATERIAL", "Delete Material"},
	// ListMesh means the user can get the mesh list.
	{"LIST_MESH", "List Mesh"},
	// AddMesh means the user can upload new mesh.
	{"ADD_MESH", "Add Mesh"},
	// EditMesh means the user can edit mesh name and thumbnail he uploaded.
	{"EDIT_MESH", "Edit Mesh"},
	// DeleteMesh means the user can delete mesh he uploaded.
	{"DELETE_MESH", "Delete Mesh"},
	// ListParticle means the user can get the particle list.
	{"LIST_PARTICLE", "List Particle"},
	// EditParticle means the user can edit particle name and thumbnail he saved.
	{"EDIT_PARTICLE", "Edit Particle"},
	// SaveParticle means the user can save new particle.
	{"SAVE_PARTICLE", "Save Particle"},
	// DeleteParticle means the user can delete particle he saved.
	{"DELETE_PARTICLE", "Delete Particle"},
	// ListPrefab means the user can get prefab list.
	{"LIST_PREFAB", "List Prefab"},
	// EditPrefab means the user can edit prefab name and thumbnail.
	{"EDIT_PREFAB", "Edit Prefab"},
	// SavePrefab means the user can save new prefab.
	{"SAVE_PREFAB", "SavePrefab"},
	// DeletePrefab means the user can delete prefab.
	{"DELETE_PREFAB", "Delete Prefab"},
	// EditScene means the user can edit scene name and thumbnail he saved.
	{"EDIT_SCENE", "Edit Scene"},
	// SaveScene means the user can save new scene.
	{"SAVE_SCENE", "Save Scene"},
	// PublishScene means the user can publish new scene to static content.
	{"PUBLISH_SCENE", "Publish Scene"},
	// DeleteScene means the user can delete scenes he saved.
	{"DELETE_SCENE", "Delete Scene"},
	// ListScreenshot means the user can get the screenshot list.
	{"LIST_SCREENSHOT", "List Screenshot"},
	// AddScreenshot means the user can save new screenshot.
	{"ADD_SCREENSHOT", "Add Screenshot"},
	// EditScreenshot means the user can edit screenshot name and thumbnail he saved.
	{"EDIT_SCREENSHOT", "Edit Screenshot"},
	// DeleteScreenshot means the user can delete screenshot he saved.
	{"DELETE_SCREENSHOT", "Delete Screenshot"},
	// ListVideo means the user can get the video list he saved.
	{"LIST_VIDEO", "List Video"},
	// AddVideo means the user can record new video and upload.
	{"ADD_VIDEO", "Add Video"},
	// EditVideo means the user can edit video name and thumbnail he saved.
	{"EDIT_VIDEO", "Edit Video"},
	// DeleteVideo means the user can delete video he uploaded.
	{"DELETE_VIDEO", "Delete Video"},
}

// AuthorityModel is operating authority model.
type AuthorityModel struct {
	// ID is authority ID.
	ID string
	// Name is authority name.
	Name string
}

// Authority means an authority.
type Authority string

const (
	// Administrator means the user has all the authorities.
	Administrator Authority = "Administrator"
	// Login means the user has to log in.
	Login Authority = "Login"
	// ListAnimation means the user can get the animation list.
	ListAnimation Authority = "List Animation"
	// AddAnimation means the user can upload animation.
	AddAnimation Authority = "Add Animation"
	// EditAnimation means the user can edit the animation name and thumbnail who uploaded.
	EditAnimation Authority = "Edit Animation"
	// DeleteAnimation means the user can delete the animation who uploaded.
	DeleteAnimation Authority = "Delete Animation"
	// ListAudio means the user can get the audio list.
	ListAudio Authority = "List Audio"
	// AddAudio means the user can upload audio.
	AddAudio Authority = "Add Audio"
	// EditAudio means the user can edit audio name and thumbnail who uploaded.
	EditAudio Authority = "Edit Audio"
	// DeleteAudio means the user can delete audio who uploaded.
	DeleteAudio Authority = "Delete Audio"
	// ListCategory means the user can get his category list.
	ListCategory Authority = "List Category"
	// SaveCategory means the user can add new category.
	SaveCategory Authority = "Save Category"
	// DeleteCategory means the user can delete the category who created.
	DeleteCategory Authority = "Delete Category"
	// ListCharacter means the user can get the character list.
	ListCharacter Authority = "List Character"
	// EditCharacter means the user can edit character name and thumbnail who uploaded.
	EditCharacter Authority = "Edit Character"
	// SaveCharacter means the user can save new character who created.
	SaveCharacter Authority = "Save Character"
	// DeleteCharacter means the user can delete character who created.
	DeleteCharacter Authority = "Delete Character"
	// ListMap means the user can get the texture list.
	ListMap Authority = "List Map"
	// AddMap means the user can add new texture.
	AddMap Authority = "Add Map"
	// EditMap means the user can edit texture name and thumbnail who uploaded.
	EditMap Authority = "Edit Map"
	// DeleteMap means the user can delete the texture who uploaded.
	DeleteMap Authority = "Delete Map"
	// ListMaterial means the user can get the material list.
	ListMaterial Authority = "List Material"
	// EditMaterial means the user can edit material name and thumbnail who saved.
	EditMaterial Authority = "Edit Material"
	// SaveMaterial means the user can save a new material.
	SaveMaterial Authority = "Save Material"
	// DeleteMaterial means the user can delete the material who saved.
	DeleteMaterial Authority = "Delete Material"
	// ListMesh means the user can get the mesh list.
	ListMesh Authority = "List Mesh"
	// AddMesh means the user can upload new mesh.
	AddMesh Authority = "Add Mesh"
	// EditMesh means the user can edit mesh name and thumbnail who uploaded.
	EditMesh Authority = "Edit Mesh"
	// DeleteMesh means the user can delete mesh who uploaded.
	DeleteMesh Authority = "Delete Mesh"
	// ListParticle means the user can get the particle list.
	ListParticle Authority = "List Particle"
	// EditParticle means the user can edit particle name and thumbnail who saved.
	EditParticle Authority = "Edit Particle"
	// SaveParticle means the user can save new particle.
	SaveParticle Authority = "Save Particle"
	// DeleteParticle means the user can delete particle who saved.
	DeleteParticle Authority = "Delete Particle"
	// ListPrefab means the user can get prefab list.
	ListPrefab Authority = "List Prefab"
	// EditPrefab means the user can edit prefab name and thumbnail.
	EditPrefab Authority = "Edit Prefab"
	// SavePrefab means the user can save new prefab.
	SavePrefab Authority = "SavePrefab"
	// DeletePrefab means the user can delete prefab.
	DeletePrefab Authority = "Delete Prefab"
	// EditScene means the user can edit scene name and thumbnail who saved.
	EditScene Authority = "Edit Scene"
	// SaveScene means the user can save new scene.
	SaveScene Authority = "Save Scene"
	// PublishScene means the user can publish new scene to static content.
	PublishScene Authority = "Publish Scene"
	// DeleteScene means the user can delete scenes who saved.
	DeleteScene Authority = "Delete Scene"
	// ListScreenshot means the user can get the screenshot list.
	ListScreenshot Authority = "List Screenshot"
	// AddScreenshot means the user can save new screenshot.
	AddScreenshot Authority = "Add Screenshot"
	// EditScreenshot means the user can edit screenshot name and thumbnail who saved.
	EditScreenshot Authority = "Edit Screenshot"
	// DeleteScreenshot means the user can delete screenshot who saved.
	DeleteScreenshot Authority = "Delete Screenshot"
	// ListVideo means the user can get the video list who saved.
	ListVideo Authority = "List Video"
	// AddVideo means the user can record new video and upload.
	AddVideo Authority = "Add Video"
	// EditVideo means the user can edit video name and thumbnail who saved.
	EditVideo Authority = "Edit Video"
	// DeleteVideo means the user can delete video who uploaded.
	DeleteVideo Authority = "Delete Video"
)
