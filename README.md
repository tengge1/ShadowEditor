# Shadow Editor

Supported Languages: English / [中文](README_zh.md) / 日本語 / 한국어 / русский / Le français

> [Click](../../tree/v0.4.6-csharp/) to switch to `C#` branch, which is no longer maintained.

* Name: Shadow Editor
* Version: v0.5.0 (coming soon)
* Description: 3D scene editor based on `three.js`、`golang` and `mongoDB`.
* Source Code: [GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | Document: [GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | Demo: [GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/) | Video: [Weibo](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611) | Assets: [BaiduCloud](https://pan.baidu.com/s/1IxJVM6fFLoIAJG-GKHjVTA)
* Technology Stack: `html`, `css`, `javascript`, `rollup`, `react.js`, `webgl`, `three.js`, `golang`, `mongoDB`.
* If helpful to you, please [DOnate](https://gitee.com/tengge1/ShadowEditor) to support us. thank you!

## Screenshot

![image](images/scene20200301.jpg)

## v0.5.0 is Coming

Compared with `asp.net`, `golang` has many advantages:

1. Support both `Windows`, `Linux` and `Mac`.
2. Similar to C language. support `goroutine`, which take great advantages of multi-core, and have high performance.
3. Easy to learn. Huge standard libraries and third-party libraries, and high development efficiency.
4. Can compiled to a single executable file, it is not necessary to install `golang` nor `NodeJs`.
5. No `iis` required, and can build both desktop and web version.
6. Data is compressed with `gzip`, and the speed of displaying and scene loading is extremely fast.
7. No `Visual Studio` required. You can develop with `Visual Studio Code` both for the front and back ends.

**Update Logs:**

1. Fixed that the `draco` model cannot be loaded due to the upgrade of `three.js`.
2. Models in `.json` format are no longer supported.
3. Fix that the bottom row of the category list window is blocked by the button.
4. Fix that the texture cannot be loaded when the texture is attached.
5. Fix that the audio cannot set thumbnails.
6. Fix that the thumbnail cannot be set in the screenshot.
7. Fix that the thumbnail cannot be set in the video.
8. Fix that the confirmation dialog cannot be cancelled and closed.
9. Fix that the role list is not refreshed after deleted.

## v0.4.6 has Released

* Release Date: April 5, 2020
* Update Logs:

1. Fixed that the confirmation dialog of loading auto save scene cannot be cancelled, the button `Cancel` is changed to `Empty`.
2. Fix that saving the sample scene report "ID is invalid". Now the sample scenes can be saved.
3. Adding "Background Music" component now works.
4. Fixed that the music file was not exported when the background music component was released.
5. Fixed that the video address is incorrect.
6. Fix that obtaining server configuration and unused server address.
7. Golang server. (Under development)
8. Fix that calling `clock.getDelta` and `clock.getElapsedTime` multiple times in the scripts may cause abnormal animation. Now these functions can be called multiple times in the scripts.

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

1. Clone the source code.

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

In **China**, `github` is terribly slow, you can use `gitee` instead.

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

If you need a `C#` version, you can checkout the `C#` branch. But it is no longer maintained.

```bash
git checkout -b csharp origin/v0.4.6-csharp
```

2. Download and install `VSCode` and `Go` extension.

It is recommended to install the following extensions, but they are not essential.

`Shader languages ​​support for VS Code`, `C/C++`, `ESLint`, `Go`, `TOML Language Support`.

3. **Chinese** users can set `golang` and `nodejs` proxy.

In China, since `golang.org` is inaccessible, `github.com` and `npmjs.com` are rather slow, it is recommended to set golang and nodejs proxy.

Windows:

```bash
.\scripts\set_go_proxy.bat
.\scripts\set_npm_proxy.bat
```

Linux:

```bash
./scripts/set_go_proxy.sh
./scripts/set_npm_proxy.sh
```

4. Install the development tools for `golang`, and they are helpful for development, such as intelligence.

Windows:

```bash
.\scripts\install_develop.bat
```

Linux:

```bash
./scripts/install_develop.sh
```

5. Install the third-party dependencies.

Windows:

```bash
.\scripts\install.bat
```

Linux:

```bash
./scripts/install.sh
```

6. Compile the source.

Windows:

```bash
.\scripts\build.bat
```

Linux:

```bash
./scripts/build.sh
```

The distribution is in the `build` folder. When publish,  just copy this folder.

7. Launch the program.

Windows:

```bash
.\scripts\run.bat
```

*You can also double-click build/ShadowEditor.exe in the explorer*

Linux:

```bash
./scripts/run.sh
```

Here is the output:

```
2020/05/02 09:57:20 starting shadoweditor server on port: 2020
```

Now, you can visit in browser: http://localhost:2020

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

## License

MIT License

## Related Links

* Three.js: https://threejs.org/
* LOL model viewer: https://github.com/tengge1/lol-model-viewer
* Model download1: https://sketchfab.com/3d-models?features=downloadable
* Model download2: https://www.3dpunk.com/work/index.html?category=downloadable