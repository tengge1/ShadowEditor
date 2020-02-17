# Shadow Editor

Supported Languages: 中文 / [繁體中文](README-tw.md) / [English](README-en.md) / 日本語 / 한국어 / русский / Le français

* 名称：Shadow Editor
* 版本：v0.4.3(开发中)
* 简介：基于`three.js`的场景编辑器。
* 源码：[GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | 文档：[GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | 示例：[GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/) | 视频：[微博](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611) | 资源：[百度云](https://pan.baidu.com/s/1IxJVM6fFLoIAJG-GKHjVTA)
* 技术栈：`html`、`css`、`javascript`、`rollup`、`react.js`、`webgl`、`three.js`、`asp.net`。
* 如果对您有帮助，请[【捐赠】](https://gitee.com/tengge1/ShadowEditor)支持项目发展，谢谢。

## v0.4.3即将更新

1. 新增`新建小区和室内`功能，默认自动添加一个地面。
2. 常见问题新增`404 Not Found`和`访问被拒绝`的解决方法。
3. 帮助菜单新增`下载模型`功能，可以快速访问`sketchfab`和`3dpunk`下载模型。
4. 贴图面板新增`上传天空球`功能。
5. 组件菜单添加`天空球`组件。
6. 修复`未保存材质的模型`和`多材质模型`发布场景报错的bug。
7. 性能监视器、网格、视角帮助器、物理引擎、扔小球设置由`状态栏`移动到`视图`菜单中。
8. 状态栏新增鼠标坐标显示。
9. `视图`菜单新增`动态显示隐藏资源面板、侧边栏、工具栏、时间轴面板、状态栏`功能，并保存在本地存储中。
10. 控制台不再显示`DevTools failed to load SourceMap: Could not load content for gunzip.min.js.map`的警告信息。
11. 修复错误的`cookie`导致服务端报错bug。
12. 修复新版谷歌浏览器无法正常注销bug。

## v0.4.2更新【[更新日志](docs-dev/update/UpdateLog.md)】

* 发布日期：2020年2月8日
* 更新日志：

1. 保存场景，如果设置`不保存子组件`，则不保存模型内部组件。这可以加快场景保存和载入速度，减小场景大小。
2. 保存场景，如果设置`不保存材质`，则不保存模型内部材质。这用于修改了模型内部组件名称和结构，没修改材质的情况。
3. 修复场景中存在`点标注`或`不缩放文字`时，发布场景报错bug。
4. 通用工具栏新增`第一视角`功能。使用`WSAD`或方向键控制前后左右移动，鼠标控制视线方向。
5. 将状态栏`添加模式`选择，移动到绘制工具栏中。
6. 物体菜单新增`添加正交相机和透视相机`功能。
7. 物体菜单新增`添加箭头帮助器和坐标轴帮助器`功能。
8. 新增自由控制器。

## 项目截图

![image](images/scene20190825.png)

## 主要功能

1. 基于three.js/WebGL的3D场景在线编辑器，使用`MongoDB`保存场景、模型、贴图、材质、音频、动画、截图、视频数据，支持一键备份数据库功能。
2. 内置物体：组、平面、正方体、圆、圆柱体、球体、二十面体、轮胎、纽结、茶壶、酒杯、不缩放文字、三维文字、线段、CatmullRom曲线、二次贝塞尔曲线、三次贝塞尔曲线、椭圆曲线、点标注、精灵。
3. 内置光源：环境光、平行光、点光源、聚光灯、半球光、矩形光，自带点光源帮助器（光晕效果）、半球光帮助器（天空球）、矩形光帮助器（荧幕）。
4. 支持多种不同3D格式模型和动画导入。支持`3ds`、`3mf`、`amf`、`assimp`(anim)、`awd`、`babylon`、`binary`、`bvh`(anim)、`collada`、`ctm`、`draco`、`fbx`(anim)、`gcode`、`gltf`(anim)、`js`(anim)、`json`(anim)、`kmz`、`lmesh`(anim)、`md2`、`mmd`(anim)、`nrrd`、`obj`、`pcd`、`pdb`、`ply`、`prwm`、`sea3d`(anim)、`stl`、`vrm`、`vrml`、`vtk`、`x` 31种3D文件格式，带`anim`的表示支持动画。多种3D文件同时支持`json`和二进制格式。`mmd`文件同时支持`pmd`和`pmx`格式，支持`vmd`格式的模型和相机动画。它也是唯一支持`lmesh`(lolking网站lol模型)的编辑器。
5. 内置材质：线条材质、虚线材质、基本材质、深度材质、法向量材质、兰伯特材质、冯氏材质、点云材质、标准材质、物理材质、精灵材质、着色器材质、原始着色器材质。
6. 支持纹理：颜色纹理、透明纹理、凹凸纹理、法线纹理、位移纹理、镜面纹理、环境纹理、光照纹理、遮挡纹理、自发光纹理。
7. 支持贴图：图片、立方体贴图、视频贴图。
8. 内置组件：背景音乐、粒子发射器、天空、火焰、水、烟、布、柏林地形组件。
9. 可视化修改场景、相机等物体属性，提供各种组件可视化修改面板。
10. 在线编辑js脚本、着色器程序，带智能提示。
11. 自带播放器，实时演示场景动态效果，支持全屏和新窗口播放，可以直接嵌入项目`iframe`中。
12. 支持补间动画、骨骼动画、粒子动画、mmd动画、lmesh动画（lolking网站lol模型）。
13. 支持场景、模型、贴图、材质、音频、动画、截图、视频管理，支持自定义分类，根据汉字和拼音快速搜索。
14. 支持第一视角控制器、飞行控制器、轨道控制器、指针锁定控制器、轨迹球控制器5种控制器。
15. 支持点阵化特效、颜色偏移特效、残影特效、背景虚化、快速近似抗锯齿(FXAA)、毛刺特效、半色调特效、全屏抗锯齿(SSAA)、像素特效、可扩展环境光遮挡(SAO)、多重采样抗锯齿(SMAA)、屏幕空间环境光遮蔽(SSAO)、时间抗锯齿(TAA)。
16. 提供历史记录和日志功能，支持撤销、重做。
17. 支持导出`gltf`、`obj`、`ply`、`stl`、`Collada`、`DRACO`场景和模型。
18. 支持`bullet`物理引擎。正方体、圆形、圆柱体、二十面体、酒杯、平面、球体、茶壶、轮胎、纽结和加载的模型都支持刚体组件。支持可视化设置碰撞体形状（正方体、球体）、质量和惯性。
19. 具有平移、旋转、缩放、在物体表面绘制点、线、贴花的工具，实时统计场景种物体、顶点、三角形数量。
20. 支持场景发布功能，可以将场景发布成静态资源，部署到任何一台服务器上。
21. 软件内置语言：`中文`、`繁體中文`、`English`、`日本語`、`한국어`、`русский`、`Le français`。
22. 支持色调旋转(hue-rotate)、饱和度、亮度、高斯模糊(blur)、对比度、灰度、颜色反转(invert)、复古(sepia)滤镜。
23. 支持版本控制，可以打开任何时间保存的场景。
24. 支持截图工具，视频录制工具。
25. 内置权限管理：组织机构管理、用户管理、角色管理、权限管理、系统初始化、系统重置、注册、登录、修改密码。
26. 示例：打砖块、相机、粒子、乒乓球、着色器。
27. 自带字体管理器、转换器工具，可以将ttf字体文件转换为json文件，便于创建三维文字。
28. 支持设置选中颜色和边框粗细、鼠标高亮颜色，阴影类型，各种帮助器显示隐藏，滤镜效果，天气效果。

## 使用指南

**该项目仅支持Windows系统，电脑上需要安装.Net Framework 4.5。**

**兼容火狐和谷歌浏览器，推荐使用最新版谷歌浏览器。**

1. 安装`NodeJs`，在最外层目录（有`README.md`文件的那个文件），执行以下命令。

```bash
npm install
npm run build
```

2. 下载`MongoDB`，安装并启动MongoDB服务。MongoDB服务的默认端口为27017。

MongoDB下载地址:https://www.mongodb.com/download-center/community

可以下载zip版本，然后在MongoDB的bin文件夹执行以下命令安装服务，注意修改路径。

```bash
mongod --dbpath=D:\mongodb\db --logpath=D:\mongodb\log\mongoDB.log --install --serviceName MongoDB
net start MongoDB
```

3. 编辑文件`ShadowEditor.Web/Web.config`，将`27017`修改为你电脑上MongoDB服务的端口。

```xml
<add key="mongo_connection" value="mongodb://127.0.0.1:27017" />
```

4. 使用`Visual Studio 2017`打开项目，生成`ShadowEditor.Web`项目。

5. 将`ShadowEditor.Web`部署在iis上即可在浏览器中访问。

注意：发布网站部署，Web目录外面需要多加一层文件夹，用于存放日志、数据库备份等不能公开的资源。

6. 编译文档，请安装gitbook。

```bash
npm install -g gitbook-cli
```

然后切换到`docs-dev`目录，安装gitbook插件。

```bash
gitbook install
```

然后切换到上级目录，执行以下命令生成文档。

```bash
npm run docs
```

## 常见问题

1. 上传模型时为什么都是上传失败？

需要把模型贴图等资源压缩成一个zip包，而且入口文件不能嵌套文件夹。服务端会解压上传的zip包放到`~/Upload/Model`文件下，并在MongoDB `_Mesh`表里添加一条数据。

2. 如何将多个模型组合在一起？

基本几何体都支持多层嵌套。可以添加一个`组`（在几何体菜单中），然后在场景树状图上，将多个模型拖动到`组`上。

3. 如何开启权限系统？

打开`ShadowEditor.Web/Web.config`文件，将`EnableAuthority`设置为`true`。默认管理员用户名是`admin`，密码是`123456`。

4. 前端报`asm.js 已被禁用，因为脚本调试程序已连接。请断开调试程序的连接，以启用 asm.js。`的错误。

**完整错误**：asm.js 已被禁用，因为脚本调试程序已连接。请断开调试程序的连接，以启用 asm.js。 ammo.js (1,1) SCRIPT1028: SCRIPT1028: Expected identifier, string or number ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow' is not defined。  
**解决方法**：腾讯浏览器不支持使用`Emscripten`编译的`ammo.js`（WebAssembly），建议换成谷歌浏览器。  

5. 前端报`404.0 - Not Found您要找的资源已被删除、已更名或暂时不可用。`的错误。

可能原因1：**iis没有开启asp.net支持。**

解决方法：  
1、打开控制面板、程序和功能、启用或关闭Windows功能。  
2、把`.NET Framework`勾选上。  
3、把Internet Information Services、万维网服务、应用程序开发功能，下面的`.NET Extensibility`、`ASP.NET`、`ISAPI扩展`、`ISAPI筛选器`、`应用程序初始化`勾选上，确定。  

可能原因2：**服务端没有编译。**

解决方法：
使用`Visual Studio 2017`打开项目，在解决方案管理器`ShadowEditor.Web`项目上右键，选择重新生成。

6. 上传模型报`对路径“C:\inetpub\wwwroot\Upload\Model\20200208192356\temp”的访问被拒绝。`的错误。

原因：`Upload`文件夹没有写入权限。  
解决方法：  
右键`Upload`文件夹，点击属性。安全选项卡，点高级，添加。选择主体，填写Everyone，基本权限，选择`完全控制`就好了。

## 相关链接

* Three.js官网：https://threejs.org/
* LOL模型查看器：https://github.com/tengge1/lol-model-viewer
* 模型下载1：https://sketchfab.com/3d-models?features=downloadable
* 模型下载2：https://www.3dpunk.com/work/index.html?category=downloadable