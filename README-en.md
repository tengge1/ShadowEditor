# Shadow Editor

Language: [中文](README.md) / [繁體中文](README-tw.md) / English

* Name: Shadow Editor
* Version: v0.3.0 (new version, under development)
* Introduction: Scene editor based on `three.js`.

> Description: Merge the `dev` branch into `master`. Later, use the `master` branch to develop the `react.js` version of `ShadowEditor` and use the `v0.2.6_old` branch to maintain the old version.

## v0.3.0 will be updated soon

1. Save the scene, record the names of the parts modified inside the model, and load the scene to restore. (The material information of each part inside the model is no longer recorded)

## v0.2.6Update

* Release date: July 28, 2019
* Update log:

1. Fix playing MMD animation, missing ammo.js bug.
2. Complete the weights of BasicComponent, CameraComponent, FireComponent, LightComponent, LMeshComponent, MMDComponent, ParticleEmitterComponent, ReflectorComponent, SceneComponent, ShadowComponent, SmokeComponent, TransformComponent, BoxGeometryComponent, CircleGeometryComponent, CylinderGeometryComponent, IcosahedronGeometryComponent, LatheGeometryComponent, PlaneGeometryComponent, SphereGeometryComponent, TeapotGeometryComponent, TorusGeometryComponent, TorusKnotGeometryComponent, Structure. (dev branch)

## Project screenshot

![image](images/scene20190803.png)

<table>
    <tr>
        <td>Source</td>
        <td><a href="https://github.com/tengge1/ShadowEditor">GitHub</a></td>
        <td><a href="https://gitee.com/tengge1/ShadowEditor">Code Cloud</a></td>
        <td>Document</td>
        <td><a href="https://tengge1.github.io/ShadowEditor/">GitHub</a></td>
        <td><a href="https://tengge1.gitee.io/shadoweditor/">Code Cloud</a></td>
    </tr>
    <tr>
        <td>Demo</td>
        <td><a href="https://tengge1.github.io/ShadowEditor-examples/">GitHub</a></td>
        <td><a href="http://tengge1.gitee.io/shadoweditor-examples/">Code Cloud</a></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

## The main function

> Description: Some features of the new version may not be completed yet.

1. Based on the three-dimensional scene online editor of three.js/WebGL, the server uses `MongoDB` to save animation, audio, category, character, texture, material, mesh model, particle, preset body, scene data.
2. Built-in geometry: plane, cube, circle, cylinder, sphere, icosahedron, tire, knot, teapot, wine glass, elf, text; line segment, CatmullRom curve, quadratic Bezier curve, cubic Bezier curve , elliptic curve.
3. Built-in light source: ambient light, parallel light, point light source, spotlight, hemispherical light, rectangular light.
4. Support a variety of different 3D format models and animation imports. Support `3ds`, `3mf`, `amf`, `assimp`(anim), `awd`, `babylon`, `binary`, `bvh`(anim), `collada`, `ctm`, `draco` , `fbx`(anim), `gcode`, `gltf`(anim), `js`(anim), `json`(anim), `kmz`, `lmesh`(anim), `md2`, `mmd `(anim), `nrrd`, `obj`, `pcd`, `pdb`, `ply`, `prwm`, `sea3d`(anim), `stl`, `vrm`, `vrml`, `vtk `, `x` 31 kinds of 3D file format, with the support of `anim` to support animation. A variety of 3D files support both `json` and binary formats. The `mmd` file supports both `pmd` and `pmx` formats, supporting models and camera animations in the `vmd` format. It is also the only editor that supports `lmesh` (lolking website lol model).
5. Built-in materials: line material, dashed material, basic material, depth material, normal vector material, Lambert material, Fung material, point cloud material, standard material, physical material, sprite material, shader material, raw shader Material.
6. Support textures: color texture, transparent texture, bump texture, normal texture, displacement texture, mirror texture, environment texture, lighting texture, occlusion texture, self-illumination texture.
7. Support texture: picture, cube texture, video texture.
8. Built-in components: background music, particle emitters, sky, flame, water, smoke, cloth components.
9. Visually modify the properties of objects such as scenes and cameras, and provide more than 40 different modification panels.
10. Edit js scripts, shader programs online, with smart tips.
11. Bring your own player, real-time demo scene dynamic effects, support full screen and new window playback, you can directly embed in project `iframe`.
12. Support tween animation, skeletal animation, particle animation, mmd animation, lmesh animation (lolking website lol model).
13. Support scenes, models, textures, materials, audio, animation, particles, presets, character resource management, support custom classification, and quickly search according to Chinese characters and pinyin. Among them, the particle, preset body, and role resource management have not yet achieved the corresponding functions.
14. Supports five kinds of controllers: first view controller, flight controller, track controller, pointer lock controller and trackball controller.
15. Supports dot matrix effects, color shift effects, afterimage effects, background blur, fast approximation anti-aliasing (FXAA), glitch effects, halftone effects, full-screen anti-aliasing (SSAA), pixel effects, scalable ambient light Occlusion (SAO), Multi-Sampling Anti-Aliasing (SMAA), Screen Space Ambient Occlusion (SSAO), Time Anti-Aliasing (TAA).
16. Provide history and log functions to support undo and redo.
17. Support for exporting `gltf`, `obj`, `ply`, `stl` models.
18. Support for the `bullet` physics engine. Rigid body components are supported by cubes, circles, cylinders, icosahedrons, wine glasses, planes, spheres, teapots, tires, knots, and loaded models. Support visualization to set the shape of the collision body (square, sphere), mass and inertia.
19. With pan, rotate, zoom, draw points, lines, decals on the surface of the object, real-time statistics of the number of objects, vertices, triangles.
20. Support scene one-key export function.
21. Chinese and English bilingual support.
22. Supports hue-rotate, saturation, brightness, blur, contrast, grayscale, invert, and sepia filters.
23. Support for version control.

## user's guidance

**This project only supports Windows system, you need to install .Net Framework 4.5 on your computer. **

**Recommended to use the latest version of Google Chrome, is not guaranteed to be compatible with other browsers. **

1. Install `NodeJs`. In the outermost directory, execute the following command.

```bash
Npm install
Npm run build
```

2. Download `MongoDB` to install and start the MongoDB service. The default port for the MongoDB service is 27017.

MongoDB download address: https://www.mongodb.com/download-center/community

You can download the zip version, then execute the following command to install the service in the bin folder of MongoDB, pay attention to modify the path.

```bash
Mongod --dbpath=D:\mongodb\db --logpath=D:\mongodb\log\mongoDB.log --install --serviceName MongoDB
Net start MongoDB
```

3. Edit the file `ShadowEditor.Web/Web.config` and change `27017` to the port of the MongoDB service on your computer.

```xml
<add key="mongo_connection" value="mongodb://127.0.0.1:27017" />
```

4. Open the project with `Visual Studio 2017` and generate the `ShadowEditor.Web` project.

5. Deploy `ShadowEditor.Web` on iis to access it in the browser.

6. In order to save various types of files for normal download, the following two MIME types will be added to the iis. Please pay attention to the security deployment.

| File Extension | MIME Type | Description |
| --------- | -------- | ---- |
| .* | application/octet-stream | Various Format Suffix Files |
| . | application/octet-stream | No suffix files |

7. Compile the documentation, please install gitbook.

```bash
Npm install -g gitbook-cli
```

Then switch to the `docs-dev` directory and install the gitbook plugin.

```bash
Gitbook install
```

Then switch to the parent directory and execute the following command to generate the document.

```bash
Npm run build-docs
```

## common problem

1. Why is the upload failed when uploading the model?

Resources such as model maps need to be compressed into a zip package, and the import file cannot be nested in folders. The server will extract the uploaded zip package into the `~/Upload/Model` file and add a piece of data to the MongoDB `_Mesh` table.

2. How to combine multiple models together?

Basic geometry supports multiple levels of nesting. You can add a `group` (in the geometry menu) and drag multiple models onto the 'group' on the scene tree.

## Related Links

* Three.js official website: https://threejs.org/
* LOL Model Viewer: https://github.com/tengge1/lol-model-viewer
* Model download 1: https://sketchfab.com/3d-models?features=downloadable
* Model Download 2: https://www.3dpunk.com/work/index.html?category=downloadable