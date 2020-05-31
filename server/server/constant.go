// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

const (
	// CategoryCollectionName is the collection name that we store categories in mongo.
	CategoryCollectionName string = "_Category"
	// SceneCollectionName is the collection name that we store scenes in mongo.
	SceneCollectionName string = "_Scene"
	// MeshCollectionName is the collection name that we store meshes in mongo.
	MeshCollectionName string = "_Mesh"
	// MapCollectionName is the collection name that we store textures in mongo.
	MapCollectionName string = "_Map"
	// MaterialCollectionName is the collection name that we store materials in mongo.
	MaterialCollectionName string = "_Material"
	// AudioCollectionName is the collection name that we store audios in mongo.
	AudioCollectionName string = "_Audio"
	// AnimationCollectionName is the collection name that we store animations in mongo.
	AnimationCollectionName string = "_Animation"
	// ParticleCollectionName is the collection name that we store particles in mongo.
	ParticleCollectionName string = "_Particle"
	// PrefabCollectionName is the collection name that we store prefabs in mongo.
	PrefabCollectionName string = "_Prefab"
	// CharacterCollectionName is the collection name that we store characters in mongo.
	CharacterCollectionName string = "_Character"
	// ScreenshotCollectionName is the collection name that we store screenshots in mongo.
	ScreenshotCollectionName string = "_Screenshot"
	// VideoCollectionName is the collection name that we store videos in mongo.
	VideoCollectionName string = "_Video"
	// FileCollectionName is the collection name that we store files in mongo.
	FileCollectionName string = "_File"
	// ConfigCollectionName is the collection name that we store system configs in mongo.
	ConfigCollectionName string = "_Config"
	// RoleCollectionName is the collection name that we store roles in mongo.
	RoleCollectionName string = "_Role"
	// UserCollectionName is the collection name that we store users in mongo.
	UserCollectionName string = "_User"
	// OperatingAuthorityCollectionName is the collection name that we store roles' authorities in mongo.
	OperatingAuthorityCollectionName string = "_OperatingAuthority"
	// DepartmentCollectionName is the collection name that we store departments in mongo.
	DepartmentCollectionName string = "_Department"
	// PluginCollectionName is the collection name that we store plugins in mongo.
	PluginCollectionName string = "_Plugin"
	// TypefaceCollectionName is the collection name that we store typefaces in mongo.
	TypefaceCollectionName string = "_Typeface"
	// HistorySuffix is the suffix we add to a scene collection to store history data.
	HistorySuffix string = "_history"
	// VersionField is the field we add to scene history records, and it is the scene version number.
	VersionField string = "_version"
)

// GetAllAuthorities returns all authority ids and names.
func GetAllAuthorities() []AuthorityModel {
	result := []AuthorityModel{}
	for _, auth := range authorityMaps {
		result = append(result, AuthorityModel{
			ID:   string(auth.id),
			Name: auth.name,
		})
	}
	return result
}

// AuthorityModel is authority model that store authority id and name.
type AuthorityModel struct {
	// ID is authority ID.
	ID string
	// Name is authority name.
	Name string
}

var authorityMaps = []authorityMap{
	{Administrator, "Administrator"},
	{ListAnimation, "List Animation"},
	{AddAnimation, "Add Animation"},
	{EditAnimation, "Edit Animation"},
	{DeleteAnimation, "Delete Animation"},
	{ListAudio, "List Audio"},
	{AddAudio, "Add Audio"},
	{EditAudio, "Edit Audio"},
	{DeleteAudio, "Delete Audio"},
	{SaveCategory, "Save Category"},
	{DeleteCategory, "Delete Category"},
	{ListCharacter, "List Character"},
	{EditCharacter, "Edit Character"},
	{SaveCharacter, "Save Character"},
	{DeleteCharacter, "Delete Character"},
	{ListTexture, "List Map"},
	{AddTexture, "Add Map"},
	{EditTexture, "Edit Map"},
	{DeleteTexture, "Delete Map"},
	{ListMaterial, "List Material"},
	{EditMaterial, "Edit Material"},
	{SaveMaterial, "Save Material"},
	{DeleteMaterial, "Delete Material"},
	{ListMesh, "List Mesh"},
	{AddMesh, "Add Mesh"},
	{EditMesh, "Edit Mesh"},
	{DeleteMesh, "Delete Mesh"},
	{ListParticle, "List Particle"},
	{EditParticle, "Edit Particle"},
	{SaveParticle, "Save Particle"},
	{DeleteParticle, "Delete Particle"},
	{ListPrefab, "List Prefab"},
	{EditPrefab, "Edit Prefab"},
	{SavePrefab, "Save Prefab"},
	{DeletePrefab, "Delete Prefab"},
	{EditScene, "Edit Scene"},
	{SaveScene, "Save Scene"},
	{PublishScene, "Publish Scene"},
	{DeleteScene, "Delete Scene"},
	{ListScreenshot, "List Screenshot"},
	{AddScreenshot, "Add Screenshot"},
	{EditScreenshot, "Edit Screenshot"},
	{DeleteScreenshot, "Delete Screenshot"},
	{ListVideo, "List Video"},
	{AddVideo, "Add Video"},
	{EditVideo, "Edit Video"},
	{DeleteVideo, "Delete Video"},
}

// authorityMap maps authority id to name.
type authorityMap struct {
	id   Authority
	name string
}

// Authority means the authority to query web api.
type Authority string

const (
	// None means the api required no authority.
	None Authority = "NONE"
	// Initialize means that can initialize the system. Everyone has Initialize
	// authority when the system is not initialized.
	Initialize Authority = "INITIALIZE"
	// Administrator means the user has all the authorities but Initialize.
	Administrator Authority = "ADMINISTRATOR"
	// Login means the user who has to log in.
	Login Authority = "LOGIN"
	// ListAnimation means the user can get the animation list.
	ListAnimation Authority = "LIST_ANIMATION"
	// AddAnimation means the user can upload animation.
	AddAnimation Authority = "ADD_ANIMATION"
	// EditAnimation means the user can edit the animation name and thumbnail who uploaded.
	EditAnimation Authority = "EDIT_ANIMATION"
	// DeleteAnimation means the user can delete the animation who uploaded.
	DeleteAnimation Authority = "DELETE_ANIMATION"
	// ListAudio means the user can get the audio list.
	ListAudio Authority = "LIST_AUDIO"
	// AddAudio means the user can upload audio.
	AddAudio Authority = "ADD_AUDIO"
	// EditAudio means the user can edit audio name and thumbnail who uploaded.
	EditAudio Authority = "EDIT_AUDIO"
	// DeleteAudio means the user can delete audio who uploaded.
	DeleteAudio Authority = "DELETE_AUDIO"
	// SaveCategory means the user can add new category.
	SaveCategory Authority = "SAVE_CATEGORY"
	// DeleteCategory means the user can delete the category who created.
	DeleteCategory Authority = "DELETE_CATEGORY"
	// ListCharacter means the user can get the character list.
	ListCharacter Authority = "LIST_CHARACTER"
	// EditCharacter means the user can edit character name and thumbnail who uploaded.
	EditCharacter Authority = "EDIT_CHARACTER"
	// SaveCharacter means the user can save new character who created.
	SaveCharacter Authority = "SAVE_CHARACTER"
	// DeleteCharacter means the user can delete character who created.
	DeleteCharacter Authority = "DELETE_CHARACTER"
	// ListTexture means the user can get the texture list.
	ListTexture Authority = "LIST_MAP"
	// AddTexture means the user can add new texture.
	AddTexture Authority = "ADD_MAP"
	// EditTexture means the user can edit texture name and thumbnail who uploaded.
	EditTexture Authority = "EDIT_MAP"
	// DeleteTexture means the user can delete the texture who uploaded.
	DeleteTexture Authority = "DELETE_MAP"
	// ListMaterial means the user can get the material list.
	ListMaterial Authority = "LIST_MATERIAL"
	// EditMaterial means the user can edit material name and thumbnail who saved.
	EditMaterial Authority = "EDIT_MATERIAL"
	// SaveMaterial means the user can save a new material.
	SaveMaterial Authority = "SAVE_MATERIAL"
	// DeleteMaterial means the user can delete the material who saved.
	DeleteMaterial Authority = "DELETE_MATERIAL"
	// ListMesh means the user can get the mesh list.
	ListMesh Authority = "LIST_MESH"
	// AddMesh means the user can upload new mesh.
	AddMesh Authority = "ADD_MESH"
	// EditMesh means the user can edit mesh name and thumbnail who uploaded.
	EditMesh Authority = "EDIT_MESH"
	// DeleteMesh means the user can delete mesh who uploaded.
	DeleteMesh Authority = "DELETE_MESH"
	// ListParticle means the user can get the particle list.
	ListParticle Authority = "LIST_PARTICLE"
	// EditParticle means the user can edit particle name and thumbnail who saved.
	EditParticle Authority = "EDIT_PARTICLE"
	// SaveParticle means the user can save new particle.
	SaveParticle Authority = "SAVE_PARTICLE"
	// DeleteParticle means the user can delete particle who saved.
	DeleteParticle Authority = "DELETE_PARTICLE"
	// ListPrefab means the user can get prefab list.
	ListPrefab Authority = "LIST_PREFAB"
	// EditPrefab means the user can edit prefab name and thumbnail.
	EditPrefab Authority = "EDIT_PREFAB"
	// SavePrefab means the user can save new prefab.
	SavePrefab Authority = "SAVE_PREFAB"
	// DeletePrefab means the user can delete prefab.
	DeletePrefab Authority = "DELETE_PREFAB"
	// EditScene means the user can edit scene name and thumbnail who saved.
	EditScene Authority = "EDIT_SCENE"
	// SaveScene means the user can save new scene.
	SaveScene Authority = "SAVE_SCENE"
	// PublishScene means the user can publish new scene to static content.
	PublishScene Authority = "PUBLISH_SCENE"
	// DeleteScene means the user can delete scenes who saved.
	DeleteScene Authority = "DELETE_SCENE"
	// ListScreenshot means the user can get the screenshot list.
	ListScreenshot Authority = "LIST_SCREENSHOT"
	// AddScreenshot means the user can save new screenshot.
	AddScreenshot Authority = "ADD_SCREENSHOT"
	// EditScreenshot means the user can edit screenshot name and thumbnail who saved.
	EditScreenshot Authority = "EDIT_SCREENSHOT"
	// DeleteScreenshot means the user can delete screenshot who saved.
	DeleteScreenshot Authority = "DELETE_SCREENSHOT"
	// ListVideo means the user can get the video list who saved.
	ListVideo Authority = "LIST_VIDEO"
	// AddVideo means the user can record new video and upload.
	AddVideo Authority = "ADD_VIDEO"
	// EditVideo means the user can edit video name and thumbnail who saved.
	EditVideo Authority = "EDIT_VIDEO"
	// DeleteVideo means the user can delete video who uploaded.
	DeleteVideo Authority = "DELETE_VIDEO"
)
