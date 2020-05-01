# Shadow Editor

Supported Languages: [中文](README_zh.md) / English / 日本語 / 한국어 / русский / Le français

> [Click here] (../../tree/v0.4.6-csharp/) to switch to the `C#` branch.

* Name: Shadow Editor
* Version: v0.5.0 (under development)
* Introduction: Scene editor based on `three.js`.
* Source code: [GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | Document: [GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | Example: [GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http: //tengge1.gitee.io/shadoweditor-examples/) | Video: [Weibo](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611) | Resources: [Baidu Cloud](https://pan.baidu.com/s/1IxJVM6fFLoIAJG-GKHjVTA)
* Technology stack: `html`,` css`, `javascript`,` rollup`, `react.js`,` webgl`, `three.js`,` golang`.
* If it is helpful to you, please [donate](https://gitee.com/tengge1/ShadowEditor) to support the project development, thank you.

## v0.5.0 will be coming soon

The Go language server has been developed and is being tested, and is expected to be released on May 1.

Compared with `asp.net`,` go language server` has many advantages:

1. Compatible with the three major operating systems of `Windows`,` Linux` and `Mac`.
2. Compiled language (similar to C language), supporting `goroutine`, which can give full play to the advantages of` CPU` multi-core and high performance.
3. Simple and easy to learn, abundant standard libraries and third-party libraries, and high development efficiency.
4. Can be compiled into a single executable file, users do not need to install `go language development environment`, nor do they need to install` NodeJs`.
5. You no longer need `iis`, you can use it by double-clicking, and you can achieve the unification of` desktop version` and `Web version`.
6. The returned data is enabled with `gzip` compression, the network data is reduced by more than 10 times, and the speed of displaying and loading scenes is greatly improved.
7. Development no longer requires the installation of a huge `Visual Studio`, no longer requires` Windows`, and a simple `Visual Studio Code` can be used to comfortably develop the front and back ends.

** Update log: **

1. Fixed the bug that the `draco` model could not be loaded due to the upgrade of` three.js`.
2. Models in `.json` format are no longer supported.
3. Fix the bug that the bottom row of the category list window is blocked by the button.
4. Fix the bug that the texture resource cannot be loaded when the texture is attached.
5. Fix the bug that the audio resource cannot upload thumbnails.
6. Fixed the bug that the thumbnail cannot be replaced in the screenshot.
7. Fix the bug that the thumbnail cannot be replaced in the video.
8. Fixed the bug that the confirmation dialog could not be cancelled and closed.
9. Fixed the bug that the role is deleted and the list is not refreshed.

## v0.4.6Update [Update Log](docs-dev/update/UpdateLog.md)

* Release date: April 5, 2020
* Update log:

1. Fixed the bug that the confirmation dialog of loading auto save scene could not be cancelled, the button of `Cancel` was changed to `Empty`
2. Fix the error of saving the sample scene report "ID is invalid". Now the sample scene can be saved normally.
3. Fix the bug of adding "background music" component as soon as you open the page.
4. Fixed the bug that the music file was not exported when the background music component was released.
5. Fixed the bug that the video address is incorrect after the scene of `Video Sticker` is released.
6. Fix the bug of obtaining server configuration and unused server address.
7. Go language server. (In development)
8. Fix the bug that calling `clock.getDelta` and` clock.getElapsedTime` multiple times in the script causes abnormal animation. Now these two functions can be called multiple times in the script.

## Project screenshot

![image](images/scene20200301.jpg)

## The main function

1. Based on three.js / WebGL 3D scene online editor, use `MongoDB` to save scenes, models, textures, materials, audio, animations, screenshots, video data, and support one-click database backup function.
2. Built-in objects: group, plane, cube, circle, cylinder, sphere, icosahedron, tire, knot, teapot, wine glass, unscaled text, 3D text, line segment, CatmullRom curve, quadratic Bezier curve, Cubic Bezier curve, elliptic curve, point label, sprite.
3. Built-in light source: ambient light, parallel light, point light source, spotlight, hemispherical light, rectangular light, comes with point light source helper (halo effect), hemispherical light helper (sky ball), rectangular light helper (screen ).
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
18. Support `bullet` physics engine. Cubes, circles, cylinders, icosahedrons, wine glasses, planes, spheres, teapots, tires, knots, and loaded models all support rigid body components. Support visual setting of collider shape (cube, sphere), mass and inertia.
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

## user's guidance

**This project only supports Windows system, .Net Framework 4.7.2 and newer version need to be installed on the computer.**

**Compatible with Firefox and Google Chrome, the latest version of Google Chrome is recommended.**

1. Install `NodeJs`, in the outermost directory (the one with` README.md` file), execute the following command.

```bash
npm install
npm run build
```

2. Download `MongoDB`, install and start the MongoDB service. The default port of the MongoDB service is 27017.

MongoDB download address: https://www.mongodb.com/download-center/community

You can download the zip version, and then execute the following command to install the service in the bin folder of MongoDB, pay attention to modify the path.

```bash
mongod --dbpath = D:\mongodb\db --logpath=D:\mongodb\log\mongoDB.log --install --serviceName MongoDB
net start MongoDB
```

3. Edit the file `ShadowEditor.Web / Web.config` and change` 27017` to the port of the MongoDB service on your computer.

```xml
<add key = "mongo_connection" value = "mongodb: //127.0.0.1:27017" />
```

4. Use `Visual Studio 2017` to open the project and generate` ShadowEditor.Web` project.

5. Deploy `ShadowEditor.Web` on iis to access it in the browser.

Note: To publish the website deployment, you need to add a layer of folders outside the Web directory to store resources that cannot be disclosed, such as logs and database backups.

6. To compile the document, please install gitbook.

```bash
npm install -g gitbook-cli
```

Then switch to the `docs-dev` directory and install the gitbook plugin.

```bash
gitbook install
```

Then switch to the superior directory and execute the following command to generate the document.

```bash
npm run docs
```

## common problem

1. Why are upload failures when uploading models?

You need to compress the model map and other resources into a zip package, and the entry file cannot be nested in a folder. The server will decompress the uploaded zip package and put it in the `~/Upload/Model` file, and add a piece of data in the MongoDB `_Mesh` table.

2. How to combine multiple models together?

Basic geometry supports multiple levels of nesting. You can add a `group` (in the geometry menu), and then drag multiple models onto the `group` on the scene tree.

3. How to open the permission system?

Open the `ShadowEditor.Web/Web.config` file and set `EnableAuthority` to `true`. The default administrator username is `admin` and the password is `123456`.

4. The front-end report `asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js. `Error.

**Complete error**: asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js. ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier, string or number ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow' is not defined.
**Solution**: Tencent browser does not support `ammo.js` (WebAssembly) compiled with` Emscripten`, it is recommended to change to Google Chrome

5. The frontend report `404.0-Not Found The resource you are looking for has been deleted, renamed or temporarily unavailable.` Error.

Possible reason 1: **iis does not open asp.net support.**

Solution:  

1. Open the control panel, programs and functions, enable or disable Windows functions.
2. Check the `.NET Framework`.
3. Check Internet Information Services, World Wide Web services, application development functions, the following `.NET Extensibility`,` ASP.NET`, `ISAPI extension`,` ISAPI filter`, `application initialization`, and confirm .

Possible reason 2: **The server is not compiled.**

Solution:
Use `Visual Studio 2017` to open the project, right click on the `ShadowEditor.Web` project in the Solution Manager and select Rebuild.

6. Upload model report `access to the path "C:\inetpub\wwwroot\Upload\Model\20200208192356\temp" was denied.` Error.

Cause: The `Upload` folder does not have write permission.

Solution:  

Right-click on the `Upload` folder and click Properties. Security tab, click Advanced, add. Select the subject, fill in Everyone, basic permissions, and select `Full Control`.

7. No response after publishing the scene.

a. Check if the pop-up window is blocked on the right side of the address bar of Google Chrome.
b. Open the developer tools and see if the `Console` or `Network` tab reports an error.
c. The released scene is in the `ShadowEditor.Web\temp` directory, and see if there are any.

8. Upgrading the .net framework to 4.7.2 reports an error: Could not find the file `E:\github\ShadowEditor\ShadowEditor.Web\bin\roslyn\csc.exe`

Solution: Clean up the solution and regenerate the solution.

## Related Links

* Three.js official website: https://threejs.org/
* LOL model viewer: https://github.com/tengge1/lol-model-viewer
* Model download 1: https://sketchfab.com/3d-models?features=downloadable
* Model download 2: https://www.3dpunk.com/work/index.html?category=downloadable
