# Shadow Editor

English / [中文](README_zh.md) &nbsp;&nbsp; |
&nbsp;&nbsp; <a href="https://github.com/tengge1/ShadowEditor/releases/download/v0.6.0/ShadowEditorServer-win32-x64.zip" title="Requires `Visual C++ Redistributable for Visual Studio 2015`">
Windows Server</a> &nbsp;&nbsp; |
&nbsp;&nbsp; <a href="https://github.com/tengge1/ShadowEditor/releases/download/v0.6.0/ShadowEditorServer-linux-x64.zip">
Ubuntu Server</a> &nbsp;&nbsp; | &nbsp;&nbsp; [Web Demo](https://tengge1.github.io/ShadowEditor-examples/)

Note: The server is a compiled version with built-in mongodb, execute `start.bat` or `start.sh` to start, and
visit `http://localhost:2020` in Google Chrome. Windows version
requires `Visual C++ Redistributable for Visual Studio 2015`.

[![image](https://img.shields.io/github/stars/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/stargazers)
[![image](https://img.shields.io/github/forks/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/network/members)
[![image](https://img.shields.io/github/issues/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/issues)
![image](https://img.shields.io/github/languages/top/tengge1/ShadowEditor)
![image](https://img.shields.io/github/commit-activity/w/tengge1/ShadowEditor)
[![image](https://img.shields.io/github/license/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/blob/master/LICENSE)
[![image](https://travis-ci.org/tengge1/ShadowEditor.svg?branch=master)](https://travis-ci.org/github/tengge1/ShadowEditor)

* Name: Shadow Editor
* Version: v0.6.0 (July 24, 2021)
* Description: Cross-platform 3D scene editor based on three.js, golang and mongodb.
* Source: [GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) |
  Document: [Gitee](https://gitee.com/tengge1/ShadowEditor/wikis/pages) |
  Demo: [GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/)
  |
  Video: [Weibo](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611)
  | Assets: [BaiduNetdisk(rfja)](https://pan.baidu.com/s/1BYLPyHJuc2r0bS9Te3SRjA)
* Technology Stack: html, css, javascript, rollup, react.js, webgl, three.js, golang, mongodb, nodejs, electron,
  protocol buffers.
* If helpful to you, please [DOnate](https://gitee.com/tengge1/ShadowEditor) to support us. thank you!

<img src="https://gitee.com/tengge1/ShadowEditor/raw/master/images/scene20200503_en.jpg" />  
<img src="https://gitee.com/tengge1/ShadowEditor/raw/master/images/vr.jpg" />  

## v0.6.1 is Coming Soon

**Starting from `v0.6.1`, ShadowEditor only provides core features and extended APIs, and other features will be
provided in the extensions, just like VSCode. We will develop in the `dev` branch.**

1. Fix the bug that some versions of go typeface management list report errors.
2. Hide the model history version tab.
3. When the sprite is selected, the border is no longer displayed.

## v0.6.0 has Released

* Release Date: July 24, 2021
* Update Logs:

1. Fix the bug that creates a new mongo connection when request.
2. Check VR in the status bar to enable VR.
3. Set scene transform.
4. How to popup a window when click an object: https://gitee.com/tengge1/ShadowEditor/issues/I3APGI
5. You can enable `https` in the `config.toml`.
6. Add event in the mobile browser to the script: `onTouchStart`, `onTouchEnd`, `onTouchMove`.
7. Upgrade `three.js` to r130.
8. Add VR event to the script: `onVRConnected`, `onVRDisconnected`, `onVRSelectStart`, `onVRSelectEnd`.
9. VR all-in-one handle controller supports, for example: htc vive.
10. Fix the bug of deleting script.
11. Fix a bug that `Geometry` can not be serialized due to the upgrade of `three.js`.
12. Add material `polygonOffset`, `polygonOffsetFactor`, `polygonOffsetUnits` parameter visualization settings to solve
    the problem of depth conflict.
13. Fix a bug that component in mesh cannot save the `visible` attribute.
14. `Bin` type model is no longer supported.
15. Fix cube texture bug.
16. Rewrite all the `prototype` to es6 `class` in the source code.
17. Remove the visual module.
18. Fix a bug that not copy the skyball texture when export a scene.
19. Fix rain and snow bug.
20. Modify the background color and lighting, so as not to add the same color as the background and make it difficult to
    see clearly.
21. Fix particle emitter bug.
22. Fix cloth bug.
23. Fix the bug of dynamic setting shadow.

## Feature List

- [x] General
    - [x] Cross-platform
        - [x] Windows, Linux, Mac
        - [x] Desktop, Web
    - [x] Multi-language support
        - [x] English、中文、繁體中文、日本語、한국어、русский、Le français
    - [x] Assets management
        - [x] scene, mesh, texture, material, audio, animation, screenshot, video, typeface
    - [x] Authority management
        - [x] organization, user
        - [x] role, authority
        - [x] registration, login, password modification
    - [x] Version management
        - [x] Scene history and logs
        - [x] undo, redo, auto saving
    - [x] Player
        - [x] play animations in the scene in real time, and can play full screen and in new window
    - [x] Settings
        - [x] Display, renderer, helpers, filter, weather, control mode, select mode, add mode, language
- [x] Small scene editing
    - [x] Add mesh
        - [x] 3ds, 3mf, amf, assimp, awd, babylon, bvh, collada, ctm
        - [x] draco, fbx, gcode, gltf, glb, js, kmz, lmesh, md2, pmd, pmx
        - [x] nrrd, obj, pcd, pdb, ply, prwm, sea3d, stl, vrm, vrml, vtk, X
    - [x] Built-in objects
        - [x] group
        - [x] plane, cube, circle, cylinder, sphere, icosahedron, torus, torus knot, teapot, lathe
        - [x] unscaled text, 3D text
        - [x] line segments, CatmullRom curve, quadratic Bezier curve, cubic Bezier curve, ellipse curve
        - [x] point marks
        - [x] arrow helper, axes helper
        - [x] sprite
    - [x] Built-in lights
        - [x] ambient light, directional light, point light, spotlight, hemispherical light, rect area light
        - [x] point light, hemispherical light, rect area light helper
    - [x] Built-in components
        - [x] background music, particle emitter
        - [x] sky, fire, water, smoke, cloth
        - [x] berlin terrain, sky sphere
    - [x] Materials editing
        - [x] LineBasicMaterial, LineDashedMaterial, MeshBasicMaterial, MeshDepthMaterial, MeshNormalMaterial
        - [x] MeshLambertMaterial, MeshPhongMaterial, PointsMaterial, MeshStandardMaterial, MeshPhysicalMaterial
        - [x] SpriteMaterial, ShaderMaterial, RawShaderMaterial
    - [x] Post-processing
        - [x] After-image, bokeh, dot screen, FXAA, glitch
        - [x] halftone, pixel, RGB shift, SAO
        - [x] SMAA, SSAA
        - [x] SSAO, TAA
    - [x] Text editing
        - [x] javascript editing with intelligence
        - [x] shader editing
        - [x] json file editing
    - [x] Mesh export
        - [x] gltf、obj、ply、stl、Collada、DRACO
    - [x] Scene publishment
        - [x] Publish scene as static resources, and can be embedded in iframe
    - [x] Examples
        - [x] Arkanoid, camera, particle, ping pong, shader
    - [x] General tools
        - [x] Select, pan, rotate, zoom
        - [x] Perspective view, front view, side view, top view, wireframe mode
        - [x] Screenshot, record
        - [x] Draw point, draw line, draw polygon, spray
        - [x] Measure distance
    - [x] Others
        - [x] VR：cardboard, htc vive, chrome, firefox
        - [x] Bullet physics engine
- [x] UI Controls
    - [x] Canvas
    - [x] Form: Button, CheckBox, Form, FormControls, IconButton, IconMenuButton, ImageButton, Input, Label, LinkButton,
      Radio, SearchField, Select, TextArea, Toggle
    - [x] Icon
    - [x] Image: Image, ImageList, ImageSelector, ImageUploader
    - [x] Layout: AbsoluteLayout, AccordionLayout, BorderLayout, HBoxLayout, TableLayout, VBoxLayout
    - [x] Menu: ContextMenu, MenuBar, MenuBarFiller, MenuItem, MenuItemSeparator, MenuTab.
    - [x] Panel
    - [x] Progress: LoadMask
    - [x] Property: ButtonProperty, ButtonsProperty, CheckBoxProperty, ColorProperty, DisplayProperty, IntegerProperty,
      NumberProperty, PropertyGrid, PropertyGroup, SelectProperty, TextProperty, TextureProperty
    - [x] SVG
    - [x] Table: DataGrid, Table, TableBody, TableCell, TableHead, TableRow
    - [x] Timeline
    - [x] Toolbar: Toolbar, ToolbarFiller, ToolbarSeparator
    - [x] Tree
    - [x] Window: Alert, Confirm, Message, Photo, Prompt, Toast, Video, Window

## Requirements

1. MongoDB v3.6.8+
2. Chrome 81.0+ or ​​Firefox 75.0+

The following is only required when you want to build from source.

1. Golang 1.14.2+
2. NodeJS 14.1+
3. gcc 9.3.0+ (`tdm-gcc`, `MinGW-w64` or `MinGW` on Windows, and make sure `gcc` can be accessed through the command
   line)
4. git 2.25.1+

**Note:** The version number is for reference only.

## Download and Compile

You can use git to download the source code.

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

In **China**, `github` is really slow, you can use `gitee` instead.

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

### Build on both Windows and Ubuntu

**Web Version:**

1. If you are in `China`, run `npm run set-proxy` to set golang and nodejs proxy.
2. Run `npm install` to install nodejs dependencies.
3. Run `npm run build` to build the server and web.
4. Edit `build/config.toml`, and modify the mongodb host and port.
5. Run `npm start` to launch the server. You can now visit: `http://localhost:2020`.
6. If you enable `https` in the config file. Please visit: `https://localhost:2020`.

**Desktop Version:**

1. Download `MongoDB` and unzip it in the `utils/mongodb` folder.
2. Build web version.
3. Run `npm run build-desktop` to build a desktop app in the folder `build/desktop`.

### Install as Windows Service

1. Open `PowerShell` or `cmd` in the `build` folder as administrator.
2. Run `.\ShadowEditor install` to install ShadowEditor as a service.
3. Run `.\ShadowEditor start` to start ShadowEditor service.
4. Now you can visit: `http://localhost:2020`.
5. You can also manage this service in the `Windows Services Manager`.

### Install as Ubuntu Service

1. Edit `./scripts/service_linux/shadoweditor.service`, set the right path.
2. Run `sudo cp ./scripts/service_linux/shadoweditor.service /etc/systemd/system/`.
3. Run `sudo systemctl daemon-reload` to reload the service daemon.
4. Run `sudo systemctl start shadoweditor` to start service.
5. Run `sudo systemctl enable shadoweditor` to auto start service.

## Command Line Usage

```
PS E:\github\ShadowEditor\build\> .\ShadowEditor
ShadowEditor is a 3D scene editor based on three.js, golang and mongodb.
This application uses mongodb to store data.

Usage:
  ShadowEditor [command]

Available Commands:
  debug       Debug service on Windows  
  help        Help about any command    
  install     Install service on Windows
  serve       Start server
  start       Start service on Windows
  stop        Stop service on Windows
  version     Print the version number

Flags:
      --config string   config file (default "./config.toml")
  -h, --help            help for ShadowEditor

Use "ShadowEditor [command] --help" for more information about a command.
```

## Development Guide

1. Download and install `NodeJs`, `golang`, `MongoDB` and `Visual Studio Code`.
2. It is recommended to install the following VSCode extensions which may be helpful.

```
ESLint, Go, Shader languages support for VS Code, TOML Language Support.
```

npm scripts usage:

```
npm install:            install nodejs dependencies.
npm run build:          build the server and web client.
npm run build-server:   build only the server. (For development)
npm run build-web:      build only the web client. (For development)
npm run build-desktop:  build the desktoop version.
npm run dev:            build the web client automatically when files changes.(For development)
npm run copy:           Copy assets from web folder to build folder.
npm run start:          start the web server.
npm run set-proxy:      set golang and nodejs proxy. (In China only)
npm run unset-proxy:    unset golang and nodejs proxy.
npm run install-dev:    install golang development tools.
npm run eslint:         check js files and fix errors automatically.
npm run clean:          delete the web and desktop builds.
npm run clear:          delete useless nodejs packages.
```

## Contributing

<details>
  <summary>Expand to view details</summary>

ShadowEditor is a project for both users and developers. You can contribute and try you idea on this project. No
pension, but a lot of fun. To contribute, you should:

1. Fork the repository.
2. Create Feat_xxx branch.
3. Commit your code.
4. Create Pull Request.

**Note:** DO NOT submit large binaries, or the `Pull Request` may be rejected. If required, you can add the files or
directories to be ignored to the `.gitignore` file.

</details>

## Frequently Asked Questions

<details>
  <summary>Expand to view details</summary>

1. Failed when upload models.

You need to compress the model assets into a `zip` file, and the entry file cannot be nested in a folder. The server
will decompress and put it in the `./build/public/Upload/Model` folder, and add a record in the MongoDB `_Mesh`
collection.

2. How to combine multiple models together?

Basic geometry supports multiple levels of nesting. You can add a `group` (in the geometry menu), and then drag multiple
models onto the `group` in the `Hierachy` Panel.

3. How to enable authority?

Edit `config.toml` and set `authority.enabled` to `true`. The default administrator username is `admin` and the password
is `123456`.

4. The brower
   report `asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to enable asm.js.`
   Error.

**Complete error**: asm.js has been disabled because the script debugger is connected. Please disconnect the debugger to
enable asm.js. ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier, string or number ShadowEditor.js (3948,8)
SCRIPT5009: 'Shadow' is not defined.

**Solution**: Tencent browser does not support `ammo.js` (WebAssembly) compiled with `Emscripten`, it is recommended to
use `Chrome` or `Firebox` instead.

5. How can I upgrade from C# to golang version?

The data structure and web client is not changed, just copy `./ShadowEditor.Web/Upload/` folder to
`build/public/Upload/`.

6. The desktop version cannot be opened.

Windows requires `Visual C++ Redistributable for Visual Studio 2015`. You can install
from: https://www.microsoft.com/en-us/download/details.aspx?id=48145  
If the desktop version cannot be opened, you can view `logs.txt`; if the port conflicts, you can modify the MongoDB and
website ports in `resources/app/config.toml`.

7. How can I create a https certificate?

Install `openssl`, and git client already contains one; Open `cmd`, `Powershell` or `shell`, and run the following
commands:

```sh
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

Among the generated files, `certificate.pem` is the certificate, and `privatekey.pem` is the key.

</details>

## License

MIT License

## Open Source Projects

<details>
  <summary>Expand to view details</summary>

Thanks to the following open source projects.

https://github.com/golang/go  
https://github.com/BurntSushi/toml  
https://github.com/dgrijalva/jwt-go  
https://github.com/dimfeld/httptreemux  
https://github.com/inconshreveable/mousetrap  
https://github.com/json-iterator/go  
https://github.com/mozillazg/go-pinyin  
https://github.com/otiai10/copy  
https://github.com/sirupsen/logrus  
https://github.com/spf13/cobra  
https://github.com/spf13/viper  
https://github.com/urfave/negroni  
https://go.mongodb.org/mongo-driver

https://github.com/facebook/react  
https://github.com/mrdoob/three.js  
https://github.com/rollup/rollup  
https://github.com/babel/babel  
https://github.com/eslint/eslint  
https://github.com/rollup/rollup-plugin-babel  
https://github.com/rollup/rollup-plugin-commonjs  
https://github.com/rollup/rollup-plugin-json  
https://github.com/rollup/rollup-plugin-node-resolve  
https://github.com/egoist/rollup-plugin-postcss  
https://github.com/rollup/rollup-plugin-replace  
https://github.com/mjeanroy/rollup-plugin-strip-banner  
https://github.com/andyearnshaw/rollup-plugin-bundle-worker

https://github.com/tweenjs/tween.js  
https://github.com/JedWatson/classnames  
https://github.com/d3/d3-dispatch  
https://github.com/i18next/i18next  
https://github.com/js-cookie/js-cookie  
https://github.com/facebook/prop-types  
https://github.com/codemirror/CodeMirror  
https://github.com/jquery/esprima  
https://github.com/tschw/glslprep.js  
https://github.com/zaach/jsonlint  
https://github.com/acornjs/acorn  
https://github.com/kripken/ammo.js  
https://github.com/dataarts/dat.gui  
https://github.com/toji/gl-matrix  
https://github.com/squarefeet/ShaderParticleEngine  
https://github.com/mrdoob/stats.js  
https://github.com/mrdoob/texgen.js  
https://github.com/yomotsu/VolumetricFire  
https://github.com/jonbretman/amd-to-as6  
https://github.com/chandlerprall/ThreeCSG
</details>