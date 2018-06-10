# 文件菜单

## 新建

新建一个场景，会清空原来的场景、缓存和历史记录。

## 导入

导入各种格式的Mesh，支持`amf`、`awd`、`babylon`、`babylonmeshdata`、`ctm`、`dae`、
`fbx`、`glb`、`gltf`、`js`、`json`、`3geo`、`3mat`、`3obj`、`3scn`、`kmz`、`md2`、
`obj`、`playcanvas`、`ply`、`stl`、`vtk`、`wrl`等格式。

## 导出几何体

导出选中对象的几何体信息，生成`geometry.json`文件，例如：

```json
{
	"metadata": {
		"version": 4.5,
		"type": "BufferGeometry",
		"generator": "BufferGeometry.toJSON"
	},
	"uuid": "DB5341A1-CC12-4C28-B505-E980FAA64BD8",
	"type": "BoxBufferGeometry",
	"width": 1,
	"height": 1,
	"depth": 1
}
```

## 导出对象

导出选中对象的几何体、材质等所有信息，生成`model.json`文件，例如：

```json
{
	"metadata": {
		"version": 4.5,
		"type": "Object",
		"generator": "Object3D.toJSON"
	},
	"geometries": [
		{
			"uuid": "DB5341A1-CC12-4C28-B505-E980FAA64BD8",
			"type": "BoxBufferGeometry",
			"width": 1,
			"height": 1,
			"depth": 1
		}],
	"materials": [
		{
			"uuid": "A9EA086F-ECF2-481B-8147-5F4EAA488801",
			"type": "MeshStandardMaterial",
			"color": 16777215,
			"roughness": 0.5,
			"metalness": 0.5,
			"emissive": 0,
			"depthFunc": 3,
			"depthTest": true,
			"depthWrite": true
		}],
	"object": {
		"uuid": "50E30A0A-B21D-4020-9EE1-87C46BCEC9DF",
		"type": "Mesh",
		"name": "box",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		"geometry": "DB5341A1-CC12-4C28-B505-E980FAA64BD8",
		"material": "A9EA086F-ECF2-481B-8147-5F4EAA488801"
	}
}
```

## 导出场景

导出整个场景的信息，生成`scene.json`文件，例如：

```json
{
	"metadata": {
		"version": 4.5,
		"type": "Object",
		"generator": "Object3D.toJSON"
	},
	"geometries": [
		{
			"uuid": "DB5341A1-CC12-4C28-B505-E980FAA64BD8",
			"type": "BoxBufferGeometry",
			"width": 1,
			"height": 1,
			"depth": 1
		}],
	"materials": [
		{
			"uuid": "A9EA086F-ECF2-481B-8147-5F4EAA488801",
			"type": "MeshStandardMaterial",
			"color": 16777215,
			"roughness": 0.5,
			"metalness": 0.5,
			"emissive": 0,
			"depthFunc": 3,
			"depthTest": true,
			"depthWrite": true
		}],
	"object": {
		"uuid": "31517222-A9A7-4EAF-B5F6-60751C0BABA3",
		"type": "Scene",
		"name": "Scene",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		"children": [
			{
				"uuid": "50E30A0A-B21D-4020-9EE1-87C46BCEC9DF",
				"type": "Mesh",
				"name": "box",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"geometry": "DB5341A1-CC12-4C28-B505-E980FAA64BD8",
				"material": "A9EA086F-ECF2-481B-8147-5F4EAA488801"
			},
			{
				"uuid": "C133F737-E619-4B00-8819-93E87F186D29",
				"type": "DirectionalLight",
				"name": "DirectionalLight 1",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,5,10,7.5,1],
				"color": 16777215,
				"intensity": 1,
				"shadow": {
					"camera": {
						"uuid": "0BA739D4-23CD-48D1-9A1C-57AC7E74A11F",
						"type": "OrthographicCamera",
						"zoom": 1,
						"left": -5,
						"right": 5,
						"top": 5,
						"bottom": -5,
						"near": 0.5,
						"far": 500
					}
				}
			}],
		"background": 11184810
	}
}
```

## 导出OBJ

导出`obj`格式的文件。

## 导出STL

导出`stl`格式的文件。

## 发布

生成一个`download.zip`的压缩包，里面包含一个名为`app.json`的文件，包含场景中所有信息。