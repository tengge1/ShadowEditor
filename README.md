# Shadow Editor

English / [中文](README_zh.md)

> [Click](../../tree/v0.4.6-csharp/) to switch to `C#` branch, which is no longer maintained.

* Name: Shadow Editor
* Version: v0.5.0 (coming soon)
* Description: 3D scene editor based on three.js, golang and mongodb.
* Source: [GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | Document: [GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | Demo: [GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/) | Video: [Weibo](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611) | Assets: [BaiduNetdisk](https://pan.baidu.com/s/1IxJVM6fFLoIAJG-GKHjVTA)
* Technology Stack: html, css, javascript, rollup, react.js, webgl, three.js, golang, mongodb.
* If helpful to you, please [DOnate](https://gitee.com/tengge1/ShadowEditor) to support us. thank you!

![image](images/scene20200503_en.jpg)

## v0.5.0 is Coming

* Release Date: May 5, 2020
* Update Logs:

1. Rewrite the server using golang.
2. Fix a bug that `draco` models cannot be loaded due to the upgrade of `three.js`.
2. Models in `.json` format are no longer supported.
3. Fix a bug that the bottom row of the category list window is blocked by the button.
4. Fix a bug that the texture cannot be loaded when the texture is attached to a geometry.
5. Fix a bug that thumbnails cannot be set for audio, screenshot and video resources.
6. Fix a bug that confirmation dialog cannot be closed with cancel and close button.
9. Fix a bug that the role list will not refresh after deleting a role.

Compared with `asp.net`, `golang` has many advantages:

1. Support both `Windows`, `Linux` and `Mac`.
2. Similar to C language. support `goroutine`, which take great advantages of multi-core, and have high performance.
3. Easy to learn. Huge standard libraries and third-party libraries, and high development efficiency.
4. Can compiled into a single file, and when publish, no need to install `golang` nor `nodejs`.
5. No `iis` required, and can build both desktop and web version.
6. Network data is compressed with `gzip`, and the speed of displaying and scene loading is really fast.
7. No `Visual Studio` required. You can develop with `Visual Studio Code` for both the server and web.

## Features

1. Based on three.js 3D scene online editor, use `MongoDB` to save scenes, models, textures, materials, audio, animations, screenshots, video data.
2. Built-in objects: group, plane, cube, circle, cylinder, sphere, icosahedron, tire, knot, teapot, wine glass, unscaled text, 3D text, line segment, CatmullRom curve, quadratic Bezier curve, Cubic Bezier curve, elliptic curve, point label, sprite.
3. Built-in light: ambient light, parallel light, point light source, spotlight, hemispherical light, rectangular light, with point light source helper (halo effect), hemispherical light helper (sky ball), rectangular light helper (screen).
4. Supports importing models and animations in many different 3D formats. Supports `3ds`, `3mf`, `amf`, `assimp`(anim), `awd`, `babylon`, `binary`, `bvh`(anim), `collada`, `ctm`, `draco` , `fbx`(anim), `gcode`, `gltf`(anim), `js`(anim), `kmz`, `lmesh`(anim), `md2`, `mmd`(anim), `nrrd`, `obj`, `pcd`, `pdb`, `ply`, `prwm`, `sea3d`(anim), `stl`, `vrm`, `vrml`, `vtk`, `X` 3D file formats, with `anim` means support animations. Many 3D files support both `json` and binary formats. The `mmd` file supports both `pmd` and `pmx` formats, and models and camera animations in the `vmd` format.
5. Built-in materials: line material, dashed material, basic material, depth material, normal vector material, Lambert material, phong material, point cloud material, standard material, physical material, sprite material, shader material, original shader material.
6. Support textures: color texture, transparent texture, bump texture, normal texture, displacement texture, mirror texture, environment texture, lighting texture, occlusion texture, self-illumination texture.
7. Support textures: images, cube textures, video textures.
8. Built-in components: background music, particle emitters, sky, fire, water, smoke, cloth, berlin terrain components.
9. Visually modify the attributes of scenes, cameras and other objects, and provide various components to visually modify the panel.
10. Edit js scripts and shader programs online with intelligence.
11. Player can show scene animations, supports full-screen and new window, can be directly embedded in `iframe`.
12. Support tween animation, skeleton animation, particle animation, mmd animation, lmesh animation (lol model).
13. Support scene, model, texture, material, audio, animation, screenshot, video management, support custom classification, fast search based on Chinese characters and Pinyin.
14. Supports 5 controllers: first-angle controller, flight controller, track controller, pointer lock controller, and trackball controller.
15. Support lattice effect, color shift effect, afterimage effect, background blur, fast approximate anti-aliasing (FXAA), glitch effect, halftone effect, full-screen anti-aliasing (SSAA), pixel effect, scalable ambient light Occlusion (SAO), multi-sample anti-aliasing (SMAA), screen space ambient occlusion (SSAO), temporal anti-aliasing (TAA).
16. Provide history and log, support undo and redo.
17. Support exporting `gltf`, `obj`, `ply`, `stl`, `Collada`, `DRACO` scenes and models.
18. Support `bullet` physics engine. Cubes, circles, cylinders, icosahedrons, wine glasses, planes, spheres, teapots, tires, knots and loaded models all support rigid body components. Support visual setting of collider shape (cube, sphere), mass and inertia.
19. It has tools for translation, rotation, scaling, drawing points, lines, and decals on the surface of objects, and real-time statistics of the number of objects, vertices, and triangles in the scene.
20. Support scene publishing, which can publish scenes as static resources and deploy to any server.
21. Support languages: `English`, `Chinese`, `Traditional Chinese`, `日本语`, `한국어`, `русский`, `Le français`.
22. Support hue-rotate, saturation, brightness, Gaussian blur, contrast, grayscale, color invert, sepia filters.
23. Support version management, you can open history scenes.
24. Support screenshot and video recording.
25. Authority management: organization management, user management, role management, authority management, system initialization, system reset, registration, login, and password modification.
26. Examples: Arkanoids, cameras, particles, table tennis, shaders.
27. Font manager and convert tool, which can convert `ttf` to `json`, which is convenient for creating 3D text.
28. Support setting the selected color and border thickness, mouse highlight color, shadow type, various helper display hidden, filter effect, weather effect.

## Development Requirements

**These requirements are only required for development, and the production environment does not require any software other than MongoDB and browser.**

1. Windows, Linux, Mac, or any that support `golang` and `nodejs`.
2. Golang 1.14.2+
3. NodeJS 14.1+
4. gcc 9.3.0+ (You need to install `MinGW` on windows and add to `PATH` to ensure that `gcc` can be accessed through the command line).
5. git 2.25.1+
6. MongoDB v3.6.8 +
7. VSCode 1.44.2+
8. Chrome 81.0+ or ​​Firefox 75.0+

**Note:** Low version may work. Please install these development environments before compiling.

## Download and Compile

You can use git to download the source code.

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

In **China**, `github` is really slow, you can use `gitee` instead.

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

If you need a csharp version, you can checkout the `v0.4.6-csharp` branch which is no longer maintained. 
[Click](../../tree/v0.4.6-csharp/) to see the install guide.

```bash
git checkout -b csharp origin/v0.4.6-csharp
```

### Build on Ubuntu

You can use `make` to build this application on ubuntu. If you have no `make`, 
run `sudo apt install make` first.

1. If you are in `China`, run `make proxy` to set golang and nodejs proxy.
2. Run `make` in the root folder to build all this application.
3. Open `build/config.toml`, and set the database host and port.
4. Run `make run` to launch the server. You can now visit: `http://localhost:2020`.

### Build on Windows

1. If you are in `China`, run `.\scripts\set_go_proxy.bat` and `.\scripts\set_npm_proxy.bat`
to set golang and nodejs proxy.
2. Run `.\scripts\install_develop.bat` to install golang development tools;
3. Run `.\scripts\install.bat` to install golang and nodejs dependencies.
4. Run `.\scripts\build.bat` to build both server and web client.
5. Run `.\scripts\run.bat` to launch the server. You can now visit: `http://localhost:2020`.

## License

MIT License

## Questions & Answers

1. Failed when upload models.

You need to compress the model assets into a `zip` file, and the entry file cannot be nested in a folder. The server will decompress and put it in the `./public/Upload/Model` file, and add a record in the MongoDB `_Mesh` collection.

2. How to combine multiple models together?

Basic geometry supports multiple levels of nesting. You can add a `group` (in the geometry menu), and then drag multiple models onto the `group` in the `Hierachy` Panel.

3. How to enable authority?

Open `config.toml` and set `authority.enabled` to `true`. The default administrator username is `admin` and the password is `123456`.

4. The brower report `asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js.` Error.

**Complete error**: asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js. ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier, string or number ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow' is not defined.

**Solution**: Tencent browser does not support `ammo.js` (WebAssembly) compiled with `Emscripten`, it is recommended to use `Chrome` or `Firebox` instead.

## Related Links

* Three.js: https://threejs.org/
* LOL model viewer: https://github.com/tengge1/lol-model-viewer
* Model download1: https://sketchfab.com/3d-models?features=downloadable
* Model download2: https://www.3dpunk.com/work/index.html?category=downloadable