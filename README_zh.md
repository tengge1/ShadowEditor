# Shadow Editor

[English](README.md) / 中文 / [日本語](README_ja.md) &nbsp;&nbsp; |
&nbsp;&nbsp; <a href="https://gitee.com/tengge1/ShadowEditor/attach_files/781833/download/ShadowEditorServer-win32-x64.zip" title="需要Visual C++ Redistributable for Visual Studio 2015支持">
Windows 服务端</a> &nbsp;&nbsp; |
&nbsp;&nbsp; <a href="https://gitee.com/tengge1/ShadowEditor/attach_files/781831/download/ShadowEditorServer-linux-x64.zip">
Linux 服务端</a> &nbsp;&nbsp; | &nbsp;&nbsp; [Web 演示](http://tengge1.gitee.io/shadoweditor-examples/)

说明：服务端为编译版本，内置 mongodb，执行`start.bat`或`start.sh`启动，在谷歌浏览器中访问`http://localhost:2020`
。Windows 版需要`Visual C++ Redistributable for Visual Studio 2015`支持。

> 好消息！基于 vite4 + vue3 + ts5 + ant-design-vue7 的版本即将到来，[点击此处](README_new.md) 查看详情。

<a href='https://gitee.com/tengge1/ShadowEditor/stargazers'><img src='https://gitee.com/tengge1/ShadowEditor/badge/star.svg?theme=dark' alt='star'></img></a>
<a href='https://gitee.com/tengge1/ShadowEditor/members'><img src='https://gitee.com/tengge1/ShadowEditor/badge/fork.svg?theme=dark' alt='fork'></img></a>
![image](https://img.shields.io/github/languages/top/tengge1/ShadowEditor)
![image](https://img.shields.io/github/commit-activity/w/tengge1/ShadowEditor)
[![image](https://img.shields.io/github/license/tengge1/ShadowEditor)](https://gitee.com/tengge1/ShadowEditor/blob/master/LICENSE)
[![image](https://travis-ci.org/tengge1/ShadowEditor.svg?branch=master)](https://travis-ci.org/github/tengge1/ShadowEditor)

- 名称：Shadow Editor
- 版本：v0.6.1 (开发中)
- 简介：基于 Three.js、Go 语言和 MongoDB 的跨平台的 3D 场景编辑器。
- 源码：[GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) |
  文档：[Gitee](https://gitee.com/tengge1/ShadowEditor/wikis/pages) |
  示例：[GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/)
  |
  视频：[微博](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611)
  | 资源：[百度网盘 rfja](https://pan.baidu.com/s/1BYLPyHJuc2r0bS9Te3SRjA)
- 技术栈：html、css、javascript、rollup、react.js、webgl、three.js、golang、mongodb、nodejs、electron、protocol buffers。
- 如果对您有帮助，请[【捐赠】](https://gitee.com/tengge1/ShadowEditor)支持项目发展。谢谢！

![image](images/scene20200301.jpg)

![image](images/vr.jpg)

## v0.6.1 即将更新

**从`v0.6.1`开始，ShadowEditor 仅提供核心功能和扩展 API，其他功能将在扩展中实现，类似 VSCode。 扩展化改造将在`dev`分支进行。**

1. 修复某些版本 go 字体管理列表报错 bug。
2. 隐藏模型历史版本选项卡。
3. 精灵选中时，不再显示边框。
4. 修复搜索区域下拉框样式 bug。

## v0.6.0 已经发布

- 发布日期：2021 年 7 月 24 日
- 更新日志：

1. 修复请求时创建新 mongo 连接的 bug。
2. 状态栏勾选虚拟现实，启用 VR 功能。
3. 设置场景位移。
4. 点击物体时，怎么弹出窗口：https://gitee.com/tengge1/ShadowEditor/issues/I3APGI
5. 你可以在`config.toml`中启用`https`。
6. 在脚本中新增手机浏览器事件：`onTouchStart`、`onTouchEnd`、`onTouchMove`。
7. 升级`three.js`到最新版 r130。
8. 在脚本中添加 VR 事件：`onVRConnected`、`onVRDisconnected`、`onVRSelectStart`、`onVRSelectEnd`。
9. VR 一体机手柄控制器支持，例如：htc vive。
10. 修复删除脚本 bug。
11. 修复由于`three.js`升级，导致`Geometry`无法序列化的 bug。
12. 增加材质`polygonOffset`、`polygonOffsetFactor`、`polygonOffsetUnits`参数可视化设置，解决深度冲突问题。
13. 修复模型内部组件无法保存可视性 bug。
14. 不再支持`bin`类型模型。
15. 修复立体贴图 bug。
16. 将代码中所有的`prototype`改写为 es6 `class`。
17. 移除可视化模块。
18. 修复导出场景时没有复制天空球贴图的 bug。
19. 修复下雨和下雪 bug。
20. 修改背景颜色和光照，以免添加的平面和背景相同颜色，看不清。
21. 修复粒子发射器 bug。
22. 修复布 bug。
23. 修复动态设置影子 bug。

## 功能清单

- [x] 通用功能
  - [x] 跨平台
    - [x] Windows、Linux、Mac
    - [x] 桌面版、Web 版
  - [x] 多语言支持
    - [x] English、中文、繁體中文、日本語、한국어、русский、Le français
  - [x] 资源管理
    - [x] 场景、模型、贴图、材质、音频、动画、截图、录制视频、字体
  - [x] 权限管理
    - [x] 组织机构、用户
    - [x] 角色、权限
    - [x] 注册、登录、修改密码
  - [x] 版本控制
    - [x] 场景历史记录、操作日志
    - [x] 撤销、重做、自动保存
  - [x] 播放器
    - [x] 实时播放场景中的动画，支持全屏播放和新窗口播放
  - [x] 设置
    - [x] 显示、渲染器、帮助器、滤镜、天气、控制器模式、选择模式、添加模式、语言设置
- [x] 小场景编辑
  - [x] 添加模型
    - [x] 3ds, 3mf, amf, assimp, awd, babylon, bvh, collada, ctm
    - [x] draco, fbx, gcode, gltf, glb, js, kmz, lmesh, md2, pmd, pmx
    - [x] nrrd, obj, pcd, pdb, ply, prwm, sea3d, stl, vrm, vrml, vtk, X
  - [x] 内置物体
    - [x] 组
    - [x] 平面、正方体、圆、圆柱体、球体、二十面体、圆环面、圆环结、茶壶、车床
    - [x] 不缩放文字、三维文字
    - [x] 线段、CatmullRom 曲线、二次贝塞尔曲线、三次贝塞尔曲线、椭圆曲线
    - [x] 点标注
    - [x] 箭头帮助器、轴帮助器
    - [x] 精灵
  - [x] 内置光源
    - [x] 环境光、平行光、点光源、聚光灯、半球光、矩形光
    - [x] 点光源、半球光、矩形光帮助器
  - [x] 内置组件
    - [x] 背景音乐、粒子发射器
    - [x] 天空、火焰、水、烟、布
    - [x] 柏林地形、天空球
  - [x] 材质编辑
    - [x] 线条材质、虚线材质、基本材质、深度材质、法向量材质
    - [x] 兰伯特材质、冯氏材质、点云材质、标准材质、物理材质
    - [x] 精灵材质、着色器材质、原始着色器材质
  - [x] 后期处理
    - [x] 残影、背景虚化、点阵化、快速近似抗锯齿（FXAA）、毛刺
    - [x] 半色调、像素、颜色偏移、可扩展环境光遮蔽（SAO）
    - [x] 多重采样抗锯齿（SMAA）、全屏抗锯齿（SSAA）
    - [x] 屏幕空间环境光遮蔽（SSAO）、时间抗锯齿（TAA）
  - [x] 文本编辑
    - [x] js 脚本编辑，带智能提示
    - [x] 着色器编辑
    - [x] json 文件编辑
  - [x] 模型导出
    - [x] gltf、obj、ply、stl、Collada、DRACO
  - [x] 场景发布
    - [x] 将场景发布成静态资源，可以嵌入 iframe 中
  - [x] 示例
    - [x] 打砖块、相机、例子、乒乓球、着色器
  - [x] 常用工具
    - [x] 选择、平移、旋转、缩放
    - [x] 透视图、正视图、侧视图、顶视图、线框模式
    - [x] 截图、录制视频
    - [x] 点、线、面绘制、贴花
    - [x] 距离测量
  - [x] 其他功能
    - [x] VR：cardboard, htc vive, chrome, firefox
    - [x] Bullet 物理引擎
- [x] UI 组件
  - [x] 画布
  - [x] 表单: Button, CheckBox, Form, FormControls, IconButton, IconMenuButton, ImageButton, Input, Label, LinkButton,
        Radio, SearchField, Select, TextArea, Toggle
  - [x] 图标
  - [x] 图片: Image, ImageList, ImageSelector, ImageUploader
  - [x] 布局: AbsoluteLayout, AccordionLayout, BorderLayout, HBoxLayout, TableLayout, VBoxLayout
  - [x] 菜单: ContextMenu, MenuBar, MenuBarFiller, MenuItem, MenuItemSeparator, MenuTab.
  - [x] 面板
  - [x] 进度条: LoadMask
  - [x] 属性框: ButtonProperty, ButtonsProperty, CheckBoxProperty, ColorProperty, DisplayProperty, IntegerProperty,
        NumberProperty, PropertyGrid, PropertyGroup, SelectProperty, TextProperty, TextureProperty
  - [x] SVG
  - [x] 表格: DataGrid, Table, TableBody, TableCell, TableHead, TableRow
  - [x] 时间轴
  - [x] 工具栏: Toolbar, ToolbarFiller, ToolbarSeparator
  - [x] 树
  - [x] 窗口: Alert, Confirm, Message, Photo, Prompt, Toast, Video, Window

## 需求

1. MongoDB v3.6.8+
2. Chrome 81.0+ 或者 ​​Firefox 75.0+

下面的软件仅在从源码编译时才需要。

1. Golang 1.14.2+
2. NodeJS 14.1+
3. gcc 9.3.0+ （Windows 上需要安装`tdm-gcc`、`MinGW-w64`或`MinGW`。请保证`gcc`可以通过命令行访问）
4. git 2.25.1+

**注意** 版本号仅供参考。

## 下载和编译

你可以使用 git 下载源码。

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

在国内，由于`github`比较慢，可以使用 gitee。

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

### 在 Windows 和 Ubuntu 上构建

**Web 版：**

1. 如果你在国内， 执行`npm run set-proxy`设置 go 语言和 nodejs 代理。
2. 执行`npm install`安装 nodejs 依赖。
3. 执行`npm run build`构建服务端和 Web 端。
4. 编辑`build/config.toml`，修改 MongoDB 的 host 和 port 设置。
5. 执行`npm start`启动服务端。现在你可以访问：`http://localhost:2020`。
6. 如果在配置文件中启用了`https`，请访问：`https://localhost:2020`。

**桌面版：**

1. 下载`MongoDB`，解压到`utils/mongodb`文件夹中。
2. 构建 Web 版。
3. 执行`npm run build-desktop`可以在文件夹`build/desktop`中创建一个桌面版应用。

### 安装为 Windows 服务

1. 以管理员身份在`build`文件夹中打开`PowerShell`或`cmd`。
2. 运行`.\ShadowEditor install`，将 ShadowEditor 安装为服务。
3. 运行`.\ShadowEditor start`，启动 ShadowEditor 服务。
4. 现在你可以访问：`http://localhost:2020`。
5. 你也可以在`Windows服务管理器`中管理这个服务。

### 安装为 Ubuntu 服务

1. 编辑`./scripts/service_linux/shadoweditor.service`，设置正确的路径。
2. 执行`sudo cp ./scripts/service_linux/shadoweditor.service /etc/systemd/system/`。
3. 执行`sudo systemctl daemon-reload`重新加载服务守护程序。
4. 执行`sudo systemctl start shadoweditor`启动服务。
5. 执行`sudo systemctl enable shadoweditor`设置开机自启动。

## 命令行使用

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

## 开发指南

1. 下载并安装 `NodeJs`, `golang`, `MongoDB` 和 `Visual Studio Code`.
2. 推荐安装以下 VSCode 扩展， 它们对开发很有用。

```
ESLint, Go, Shader languages support for VS Code, TOML Language Support.
```

npm 脚本使用：

```
npm install:            安装nodejs依赖。
npm run build:          构建服务端和web客户端。
npm run build-server:   只构建服务端。(用于开发)
npm run build-web:      只构建web客户端。(用于开发)
npm run build-desktop:  构建桌面版。
npm run dev:            文件改变后自动构建web客户端。(用于开发)
npm run copy:           将资源从web文件夹拷贝到build文件夹。
npm run start:          启动web服务端。
npm run set-proxy:      设置golang和nodejs代理。(仅在国内使用)
npm run unset-proxy:    取消设置golang和nodejs代理。
npm run install-dev:    安装golang开发工具。
npm run eslint:         检查js文件，自动修复错误。
npm run clean:          删除构建的web版和桌面版。
npm run clear:          删除没用的nodejs包。
```

## 参与贡献

<details>
  <summary>展开查看详情</summary>

ShadowEditor 是一个为用户和开发者而生的项目。在这个项目上，你可以提交代码，尝试你的想法。没有报酬，但是有很多乐趣。提交代码，你需要：

1. Fork 本仓库。
2. 新建 Feat_xxx 分支。
3. 提交代码。
4. 新建 Pull Request。

**注意：** 不要提交大的二进制文件，否则可能会被拒绝。如果需要，你可以把想忽略的文件或目录添加到`.gitignore`文件中。

</details>

## 常见问题

<details>
  <summary>展开查看详情</summary>

1. 上传模型失败。

需要把模型贴图等资源压缩成一个 zip 包，而且入口文件不能嵌套文件夹。服务端会解压上传的 zip 包到`./build/public/Upload/Model`文件夹，并在 MongoDB `_Mesh`表里添加一条记录。

2. 如何将多个模型组合在一起？

基本几何体都支持多层嵌套。可以添加一个`组`（在几何体菜单中），然后在场景树状图上，将多个模型拖动到`组`上。

3. 如何开启权限系统？

编辑`config.toml`文件，将`authority.enabled`设置为`true`。默认管理员用户名是`admin`，密码是`123456`。

4. 前端报`asm.js 已被禁用，因为脚本调试程序已连接。请断开调试程序的连接，以启用 asm.js。`的错误。

**完整错误**：asm.js 已被禁用，因为脚本调试程序已连接。请断开调试程序的连接，以启用 asm.js。 ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier,
string or number ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow' is not defined。  
**解决方法**：腾讯浏览器不支持使用`Emscripten`编译的`ammo.js`（WebAssembly），建议换成谷歌浏览器或火狐浏览器。

5. 怎么从 C#版本升级到 golang 版本？

数据结构和客户端都没变，只需要把文件夹`./ShadowEditor.Web/Upload/`复制到`build/public/Upload/`即可。

6. 桌面版打不开。

说明：Windows 需要`Visual C++ Redistributable for Visual Studio 2015`
。你可以从这安装：https://www.microsoft.com/en-us/download/details.aspx?id=48145  
说明：如果桌面版打不开，可以查看`logs.txt`；如果端口冲突，可以修改`resources/app/config.toml`中的 MongoDB 和网站端口。

7. 如何创建一个 https 证书？

安装`openssl`，git 客户端已经自带一个。打开`cmd`、`Powershell`或`shell`，运行以下命令：

```sh
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

在生成的文件中，`certificate.pem`是证书，`privatekey.pem`是密钥。

</details>

## 开源项目

<details>
  <summary>展开查看详情</summary>

感谢以下开源项目。

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
