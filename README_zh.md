# Shadow Editor

[English](README.md) / 中文

* 名称：Shadow Editor
* 版本：v0.5.2（即将发布）
* 简介：基于Three.js、Go语言和MongoDB的跨平台的3D场景编辑器。
* 源码：[GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | 文档：[GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | 示例：[GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/) | 视频：[微博](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611) | 资源：[百度网盘](https://pan.baidu.com/s/1IxJVM6fFLoIAJG-GKHjVTA)
* 技术栈：html、css、javascript、rollup、react.js、webgl、three.js、golang、MongoDB。
* 如果对您有帮助，请[【捐赠】](https://gitee.com/tengge1/ShadowEditor)支持项目发展。谢谢！

![image](images/scene20200301.jpg)

## v0.5.2即将发布

1. MongoDB用户名和密码设置。

## v0.5.1更新

* 发布日期：2020年5月17日
* 更新日志：

1. 修复烟组件播放报错的bug。
2. 修复播放时渲染器尺寸错误。（导致烟组件播放时变小）
3. 修复由于three.js升级，导致水组件报错的bug。
4. 修复Ubuntu上资源类型过滤器，列出了所有类型的bug。
5. 修复列出字体、上传字体和创建3D文字的bug。
6. 修复备份mongodb的bug。
7. 更新Windows构建指南。[详情](#在windows上构建)
8. 安装为Windows服务。[详情](#安装为windows服务)
9. 当端口冲突或`config.toml`丢失时，程序不会再闪退。
10. 安装为Ubuntu服务。[详情](#安装为ubuntu服务)
11. 修复开启权限时，资源数量显示错误。
12. 修复保存系统设置错误。
13. 修复导出所有示例的bug。
14. 修复点标注选中高亮区域错误bug。

## 功能特点

1. 跨平台：支持`Windows`、`Linux`和`Mac`；支持桌面版和Web版。
2. 支持多种3D格式：`3ds`, `3mf`, `amf`, `assimp`(anim), `awd`, `babylon`, `binary`, `bvh`(anim), `collada`, `ctm`, `draco` , `fbx`(anim), `gcode`, `gltf`(`gltf`和`glb`, anim), `js`(anim), `kmz`, `lmesh`(anim), `md2`, `mmd`(`pmd`和`pmx`, anim), `nrrd`, `obj`, `pcd`, `pdb`, `ply`, `prwm`, `sea3d`(anim), `stl`, `vrm`, `vrml`, `vtk`, `X`. (anim)表示支持动画。
3. 内置物体：组；平面、正方体、圆、圆柱体、球体、二十面体、圆环面、圆环结、茶壶、车床；不缩放文字、三维文字；线段、CatmullRom曲线、二次贝塞尔曲线、三次贝塞尔曲线、椭圆曲线；点标注；箭头帮助器、轴帮助器；精灵。
4. 内置光源：环境光、平行光、点光源、聚光灯、半球光、矩形光。
5. 内置组件：背景音乐、粒子发射器、天空、火焰、水、烟、布、柏林地形、天空球。
6. 支持材质：线条材质、虚线材质、基本材质、深度材质、法向量材质、兰伯特材质、冯氏材质、点云材质、标准材质、物理材质、精灵材质、着色器材质、原始着色器材质。
7. 编辑`javascript`、`着色器程序`和`json`，具有智能提示。
8. 实时播放器可以播放场景中的动画。
9. 导出`gltf`、`obj`、`ply`、`stl`、`Collada`、`DRACO`模型。
10. 将场景发布成静态资源，可以嵌入`iframe`中。
11. 支持语言：`English`、`中文`、`繁體中文`、`日本語`、`한국어`、`русский`、`Le français`。
12. 场景版本管理：支持历史记录和日志、撤销和重做，自动保存。
13. 权限管理：组织机构、用户、角色、权限、注册、登录、修改密码。
14. 资源管理：场景、模型、贴图、材质、音频、动画、截图、录制视频、字体。

## 需求

1. MongoDB v3.6.8+
2. Chrome 81.0+ 或者 ​​Firefox 75.0+

下面的软件仅在从源码编译时才需要。

1. Golang 1.14.2+
2. NodeJS 14.1+
3. gcc 9.3.0+ （Windows上需要安装`tdm-gcc`、`MinGW-w64`或`MinGW`。请保证`gcc`可以通过命令行访问）
4. git 2.25.1+
5. make 4.2.1+ (仅在Linux上需要)

**注意** 版本号仅供参考。

## 下载和编译

你可以使用git下载源码。

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

在国内，由于`github`比较慢，可以使用gitee。

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

如果你需要C#版本，可以切换到`v0.4.6-csharp`分支，但是该版本不再维护。
[点击此处](../../tree/v0.4.6-csharp/)查看安装指南。

```bash
git checkout -b csharp origin/v0.4.6-csharp
```
### 在Ubuntu上构建

1. 如果你在国内， 执行`make proxy`设置go语言和nodejs代理。
2. 执行`make`构建服务端和Web端。
3. 编辑`build/config.toml`，修改数据库host和port设置。
4. 执行`make run`启动服务端。现在你可以访问：`http://localhost:2020`。

### 在Windows上构建

1. 如果你在国内，双击`scripts`文件夹中的`set_proxy.bat`。
2. 双击`scripts`文件夹中的`build.bat`。
3. 编辑`build`文件夹中的`config.toml`，修改数据库host和port配置。
4. 双击`build`文件夹中的`ShadowEditor.exe`。现在你可以访问：`http://localhost:2020`。

### 安装为Ubuntu服务

1. 编辑`./scripts/service_linux/shadoweditor.service`，设置正确的路径。
2. 执行`make service`安装`shadoweditor`服务。
3. 执行`sudo systemctl start shadoweditor`启动服务。
4. 执行`sudo systemctl enable shadoweditor`设置开机自启动。

### 安装为Windows服务

1. 以管理员身份运行`scripts/service_win`文件夹中的`install.bat`。
2. 编辑`scripts/service_win`文件夹中的`service.reg`，设置`AppDirectory`为`build`文件夹的绝对路径。
3. 双击`scripts/service_win`文件夹中的`service.reg`。
4. 打开`Windows服务管理器`，启动`ShadowEditor`服务。

## 常见问题

1. 上传模型失败。

需要把模型贴图等资源压缩成一个zip包，而且入口文件不能嵌套文件夹。服务端会解压上传的zip包到`./build/public/Upload/Model`文件夹，并在MongoDB `_Mesh`表里添加一条记录。

2. 如何将多个模型组合在一起？

基本几何体都支持多层嵌套。可以添加一个`组`（在几何体菜单中），然后在场景树状图上，将多个模型拖动到`组`上。

3. 如何开启权限系统？

编辑`config.toml`文件，将`authority.enabled`设置为`true`。默认管理员用户名是`admin`，密码是`123456`。

4. 前端报`asm.js 已被禁用，因为脚本调试程序已连接。请断开调试程序的连接，以启用 asm.js。`的错误。

**完整错误**：asm.js 已被禁用，因为脚本调试程序已连接。请断开调试程序的连接，以启用 asm.js。 ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier, string or number ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow' is not defined。  
**解决方法**：腾讯浏览器不支持使用`Emscripten`编译的`ammo.js`（WebAssembly），建议换成谷歌浏览器或火狐浏览器。

5. 怎么从C#版本升级到golang版本？

数据结构和客户端都没变，只需要把文件夹`./ShadowEditor.Web/Upload/`复制到`build/public/Upload/`即可。

## 相关链接

* Three.js： https://threejs.org/
* Go语言： https://golang.org/
* Go语言（国内）： https://golang.google.cn/
* MongoDB： https://www.mongodb.com/
* LOL模型查看器： https://github.com/tengge1/lol-model-viewer
* 模型下载1： https://sketchfab.com/3d-models?features=downloadable
* 模型下载2： https://www.3dpunk.com/work/index.html?category=downloadable