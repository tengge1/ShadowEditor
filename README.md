# Shadow Editor

Supported Languages: [中文](README_zh.md) / English / 日本語 / 한국어 / русский / Le français

> [Click Here](../../tree/v0.4.6-csharp/) to switch to `C#` branch.

* Name: Shadow Editor
* Version: v0.5.0 (under development)
* Description: 3D scene editor based on `three.js`、`golang` and `mongoDB`.
* Source Code: [GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | Document: [GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | Demo: [GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/) | Video: [Weibo](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611) | Resources: [Baidu Cloud](https://pan.baidu.com/s/1IxJVM6fFLoIAJG-GKHjVTA)
* Technology Stack: `html`, ` css`, `javascript`, `rollup`, `react.js`, `webgl`, `three.js`, `golang`, `mongoDB`.
* If it is helpful to you, please [donate](https://gitee.com/tengge1/ShadowEditor) to support the development, thank you.

## Screenshot

![image](images/scene20200301.jpg)

## v0.5.0 is Coming Soon

Compared with `asp.net`, `golang` has many advantages:

1. Compatible with both `Windows`, `Linux` and `Mac`.
2. Compiled language (similar to C language), supporting `goroutine`, which can take advantages of `CPU` multi-core and high performance.
3. Easy to learn. Huge standard libraries and third-party libraries, and high development efficiency.
4. Can be compiled into a single executable file, it is essential for users to install `golang` nor `NodeJs`.
5. No longer need `iis`, you can use it by double-clicking, and you can build both desktop and web version.
6. The returned data is enabled with `gzip` compression, the network data is reduced by more than 10 times, and the speed of displaying and loading scenes is greatly improved.
7. Development no longer requires the installation of a huge `Visual Studio`, no longer requires` Windows`, and a simple `Visual Studio Code` can be used to comfortably develop the front and back ends.

**Update Log:**

1. Fixed the bug that the `draco` model could not be loaded due to the upgrade of `three.js`.
2. Models in `.json` format are no longer supported.
3. Fix the bug that the bottom row of the category list window is blocked by the button.
4. Fix the bug that the texture resource cannot be loaded when the texture is attached.
5. Fix the bug that the audio resource cannot upload thumbnails.
6. Fixed the bug that the thumbnail cannot be replaced in the screenshot.
7. Fix the bug that the thumbnail cannot be replaced in the video.
8. Fixed the bug that the confirmation dialog could not be cancelled and closed.
9. Fixed the bug that the role is deleted and the list is not refreshed.

## v0.4.6 has Released

* Release Date: April 5, 2020
* Update Log:

1. Fixed the bug that the confirmation dialog of loading auto save scene could not be cancelled, the button of `Cancel` was changed to `Empty`.
2. Fix the error of saving the sample scene report "ID is invalid". Now the sample scene can be saved normally.
3. Fix the bug of adding "background music" component as soon as you open the page.
4. Fixed the bug that the music file was not exported when the background music component was released.
5. Fixed the bug that the video address is incorrect after the scene of `Video Sticker` is released.
6. Fix the bug of obtaining server configuration and unused server address.
7. Go language server. (Under development)
8. Fix the bug that calling `clock.getDelta` and `clock.getElapsedTime` multiple times in the script causes abnormal animation. Now these functions can be called multiple times in the scripts.

## Features

1. Based on three.js / WebGL 3D scene online editor, use `MongoDB` to save scenes, models, textures, materials, audio, animations, screenshots, video data, and support one-click database backup function.
2. Built-in objects: group, plane, cube, circle, cylinder, sphere, icosahedron, tire, knot, teapot, wine glass, unscaled text, 3D text, line segment, CatmullRom curve, quadratic Bezier curve, Cubic Bezier curve, elliptic curve, point label, sprite.
3. Built-in light sources: ambient light, parallel light, point light source, spotlight, hemispherical light, rectangular light, with point light source helper (halo effect), hemispherical light helper (sky ball), rectangular light helper (screen ).
4. Supports importing models and animations in many different 3D formats. Supports `3ds`,` 3mf`, `amf`,` assimp` (anim), `awd`,` babylon`, `binary`,` bvh` (anim), `collada`,` ctm`, `draco` , `Fbx` (anim),` gcode`, `gltf` (anim),` js` (anim), `json` (anim),` kmz`, `lmesh` (anim),` md2`, `mmd `(anim),` nrrd`, `obj`,` pcd`, `pdb`,` ply`, `prwm`,` sea3d` (anim), `stl`,` vrm`, `vrml`,` vtk `,` X` 31 kinds of 3D file formats, with `anim` means support animation. Multiple 3D files support both `json` and binary formats. The `mmd` file supports both` pmd` and `pmx` formats, and models and camera animations in the` vmd` format. It is also the only editor that supports `lmesh` (lolking website lol model).
5. Built-in materials: line material, dashed material, basic material, depth material, normal vector material, Lambert material, Feng's material, point cloud material, standard material, physical material, sprite material, shader material, original shader Material.
6. Support textures: color texture, transparent texture, bump texture, normal texture, displacement texture, mirror texture, environment texture, lighting texture, occlusion texture, self-illumination texture.
7. Support textures: pictures, cube textures, video textures.
8. Built-in components: background music, particle emitters, sky, flames, water, smoke, cloth, Berlin terrain components.
9. Visually modify the attributes of scenes, cameras and other objects, and provide various components to visually modify the panel.
10. Edit js scripts and shader programs online with smart prompts.
11. Comes with a player, real-time demo scene dynamic effects, supports full-screen and new window playback, can be directly embedded in the project `iframe`.
12. Support tween animation, skeleton animation, particle animation, mmd animation, lmesh animation (lolking website lol model).
13. Support scene, model, texture, material, audio, animation, screenshot, video management, support custom classification, fast search based on Chinese characters and Pinyin.
14. Supports 5 controllers: first-angle controller, flight controller, track controller, pointer lock controller, and trackball controller.
15. Support lattice effect, color shift effect, afterimage effect, background blur, fast approximate anti-aliasing (FXAA), glitch effect, halftone effect, full-screen anti-aliasing (SSAA), pixel effect, scalable ambient light Occlusion (SAO), multi-sample anti-aliasing (SMAA), screen space ambient occlusion (SSAO), temporal anti-aliasing (TAA).
16. Provide history and log functions, support undo and redo.
17. Support exporting `gltf`,` obj`, `ply`,` stl`, `Collada`,` DRACO` scenes and models.
18. Support `bullet` physics engine. Cubes, circles, cylinders, icosahedrons, wine glasses, planes, spheres, teapots, tires, knots and loaded models all support rigid body components. Support visual setting of collider shape (cube, sphere), mass and inertia.
19. It has tools for translation, rotation, scaling, drawing points, lines, and decals on the surface of objects, and real-time statistics of the number of objects, vertices, and triangles in the scene.
20. Support scene publishing function, which can publish scenes as static resources and deploy to any server.
21. Built-in languages ​​of the software: `Chinese`,` Traditional Chinese`, `English`,` 日本语 `,` 한국어 `,` русский`, `Le français`.
22. Support hue-rotate, saturation, brightness, Gaussian blur, contrast, grayscale, color invert, sepia filters.
23. Support version control, you can open the scene saved at any time.
24. Support screenshot tool, video recording tool.
25. Built-in authority management: organization management, user management, role management, authority management, system initialization, system reset, registration, login, and password modification.
26. Examples: Arkanoids, cameras, particles, table tennis, shaders.
27. Comes with font manager and converter tool, which can convert ttf font file to json file, which is convenient for creating 3D text.
28. Support setting the selected color and border thickness, mouse highlight color, shadow type, various helper display hidden, filter effect, weather effect.

## Development Requirements

**These requirements are only required for development and compilation, and the operating environment does not require any software other than MongoDB and browser.**

1. Windows, Linux, Mac, or any other that supports `golang` and` nodejs`.
2. Golang 1.14.2+
3. NodeJS 14.1+
4. gcc 9.3.0+ (you need to install `MinGW` on windows and add environment variables to ensure that `gcc` can be accessed through the command line).
5. git 2.25.1+
6. MongoDB v3.6.8 +
7. VSCode 1.44.2+
8. Chrome 81.0+ or ​​Firefox 75.0+

Note: Lower version may also be supported. Please install these development environments before compiling.

## Download and compile

1. Download the source code.

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

In China, `github` is extremely slow, you can use `gitee` instead.

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

If you need the `C#` version, you can checkout the `C#` branch, but it is no longer maintained.

```bash
git checkout -b csharp origin / v0.4.6-csharp
```

2. Download and install `VSCode` and `Go` extension.

It is recommended to install the following extensions, but it is not essential.

`Shader languages ​​support for VS Code`, `C/C++`, `ESLint`, `Go`, `TOML Language Support`.

3. Chinese users can set `golang` and `nodejs` proxy.

In China, since `golang.org` is inaccessible, `github.com` and `npmjs.com` are extremely slow, it is recommended to set golang and nodejs proxy.

Windows system execute

```bash
.\scripts\set_go_proxy.bat
.\scripts\set_npm_proxy.bat
```

Linux system execute

```bash
./scripts/set_go_proxy.sh
./scripts/set_npm_proxy.sh
```

4. Install the development tools for `golang`, and helpful for development, such as intelligent.

Windows system execute

```bash
.\scripts\install_develop.bat
```

Linux system execute

```bash
./scripts/install_develop.sh
```

5. Install the third-party dependencies.

Windows system execute

```bash
.\scripts\install.bat
```

Linux system execute

```bash
./scripts/install.sh
```

6. Compile the source.

Windows system execute

```bash
.\scripts\build.bat
```

Linux system execute

```bash
./scripts/build.sh
```

The distribution is in the `build` folder. When publishing,  just copy this folder.

7. Launch the program.

Windows system execute

```bash
.\scripts\run.bat
```

Linux system execute

```bash
./scripts/run.sh
```

Here is the output

```
2020/05/02 09:57:20 starting shadoweditor server on port: 2020
```

Then, you can access via browser: http://localhost:2020

## Q & A

1. Failed when upload models?

You need to compress the model map and other resources into a zip package, and the entry file cannot be nested in a folder. The server will decompress the uploaded zip package and put it in the `./public/Upload/Model` file, and add a piece of data in the MongoDB `_Mesh` collection.

2. How to combine multiple models together?

Basic geometry supports multiple levels of nesting. You can add a `group` (in the geometry menu), and then drag multiple models onto the `group` on the scene tree.

3. How to enable authority system?

Open `config.toml` and set `authority.enabled` to `true`. The default administrator username is `admin` and the password is `123456`.

4. The front-end report `asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js.` Error.

**Complete error**: asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js. ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier, string or number ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow' is not defined.

**Solution**: Tencent browser does not support `ammo.js` (WebAssembly) compiled with `Emscripten`, it is recommended to use `Chrome` or `Firebox` instead.

## Related Links

* Three.js official website: https://threejs.org/
* LOL model viewer: https://github.com/tengge1/lol-model-viewer
* Model download1: https://sketchfab.com/3d-models?features=downloadable
* Model download2: https://www.3dpunk.com/work/index.html?category=downloadable