# Shadow Editor

Supported Languages: 中文 / [繁體中文](README-tw.md) / [English](README-en.md) / 日本語 / 한국어 / русский / Le français

* 名称：Shadow Editor
* 版本：v0.3.8（开发中）
* 简介：基于`three.js`的场景编辑器。
* 源码：[GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) | 文档：[GitHub](https://tengge1.github.io/ShadowEditor/) [Gitee](https://tengge1.gitee.io/shadoweditor/) | 示例：[GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/)
* 开发计划：小场景搭建、地形编辑、模型批量添加渲染、地表植被附属物编辑、物理引擎、数据可视化、光线追踪引擎。
* 如果对您有帮助，请[【捐赠】](https://gitee.com/tengge1/ShadowEditor)支持项目发展，谢谢。

## v0.3.8即将更新

1. 新增快捷键`Ctrl+Z`撤销、`Ctrl+Y`重做、`Ctrl+C`复制、`Delete`删除。
2. 修复模型复制多个后，保存场景后载入场景，只显示第一个的bug。
3. 修复非管理员角色无法注销的bug。
4. 动画资源管理测试，没有bug。
5. 音频资源管理测试，没有bug。

## v0.3.7更新

* 发布日期：2019年11月17日
* 更新日志：

1. 还原以前删除的`C#`版`THREE.js`项目。
2. 禁用`Session`，避免第一次打开网页时`会话状态已创建一个会话 ID，但由于响应已被应用程序刷新而无法保存它。`的报错。
3. 修复一些由于无权限报错，导致页面变空白的bug。
4. 选中效果优化，默认选中颜色修改。
5. 新增选择模式设置：`选择整体`、`选择部分`。
6. 删除整理贴图、整理模型、整理缩略图功能。
7. 点击场景中的物体，场景树状图上展开该节点和它的所有父节点，并将该节点滚动到可视范围内。
8. 修复点击场景中的物体，场景中的物体不高亮bug。
9. 工具栏改为横向，并进行分类：`通用工具`、`绘制工具`、`编辑工具`、`地形工具`、`标注工具`、`测量工具`。（待开发完善）
10. 新增添加模型模式：`添加到中心`、`点击场景添加`。点击场景如果碰撞不到物体，则添加到`y=0`的平面上。
11. 状态栏上的选中边框颜色和粗细设置移动到`显示`选项菜单中。
12. 新增`BufferGeometry组件`，查看BufferGeometry的顶点数量、法线数量、UV坐标数量、索引数量。提供计算顶点法线功能。
13. 新增`多材质组件`，对于有多个材质的`Mesh`，可以使用多材质组件选择一个材质进行编辑。
14. 修复正投影视图上选中效果边缘不正确bug。
15. 状态栏增加物理引擎设置，添加的基本几何体默认开启物理引擎。
16. 截图和录制视频工具由状态栏移动到通用工具栏。
17. 修复新窗口播放报错`Ammo.btSoftBodyRigidBodyCollisionConfiguration is not a constructor`。
18. 优化角色管理和用户管理列表显示和搜索功能。
19. 不具有资源列表权限，将不显示对应的资源面板。
20. 修复一个严重bug：非管理员角色登录，所有接口都是无权限。

## 项目截图

![image](images/scene20190825.png)

## 主要功能

1. 基于three.js/WebGL的3D场景在线编辑器，服务端使用`MongoDB`保存动画、音频、类别、角色、贴图、材质、网格模型、粒子、预设体、场景数据。
2. 内置几何体：平面、正方体、圆、圆柱体、球体、二十面体、轮胎、纽结、茶壶、酒杯、精灵、文本；线段、CatmullRom曲线、二次贝塞尔曲线、三次贝塞尔曲线、椭圆曲线。
3. 内置光源：环境光、平行光、点光源、聚光灯、半球光、矩形光。
4. 支持多种不同3D格式模型和动画导入。支持`3ds`、`3mf`、`amf`、`assimp`(anim)、`awd`、`babylon`、`binary`、`bvh`(anim)、`collada`、`ctm`、`draco`、`fbx`(anim)、`gcode`、`gltf`(anim)、`js`(anim)、`json`(anim)、`kmz`、`lmesh`(anim)、`md2`、`mmd`(anim)、`nrrd`、`obj`、`pcd`、`pdb`、`ply`、`prwm`、`sea3d`(anim)、`stl`、`vrm`、`vrml`、`vtk`、`x` 31种3D文件格式，带`anim`的表示支持动画。多种3D文件同时支持`json`和二进制格式。`mmd`文件同时支持`pmd`和`pmx`格式，支持`vmd`格式的模型和相机动画。它也是唯一支持`lmesh`(lolking网站lol模型)的编辑器。
5. 内置材质：线条材质、虚线材质、基本材质、深度材质、法向量材质、兰伯特材质、冯氏材质、点云材质、标准材质、物理材质、精灵材质、着色器材质、原始着色器材质。
6. 支持纹理：颜色纹理、透明纹理、凹凸纹理、法线纹理、位移纹理、镜面纹理、环境纹理、光照纹理、遮挡纹理、自发光纹理。
7. 支持贴图：图片、立方体贴图、视频贴图。
8. 内置组件：背景音乐、粒子发射器、天空、火焰、水、烟、布组件。
9. 可视化修改场景、相机等物体属性，提供40多种不同修改面板。
10. 在线编辑js脚本、着色器程序，带智能提示。
11. 自带播放器，实时演示场景动态效果，支持全屏和新窗口播放，可以直接嵌入项目`iframe`中。
12. 支持补间动画、骨骼动画、粒子动画、mmd动画、lmesh动画（lolking网站lol模型）。
13. 支持场景、模型、贴图、材质、音频、动画、粒子、预设体、截图、视频管理，支持自定义分类，根据汉字和拼音快速搜索。其中，粒子、预设体暂未实现相应功能。
14. 支持第一视角控制器、飞行控制器、轨道控制器、指针锁定控制器、轨迹球控制器5种控制器。
15. 支持点阵化特效、颜色偏移特效、残影特效、背景虚化、快速近似抗锯齿(FXAA)、毛刺特效、半色调特效、全屏抗锯齿(SSAA)、像素特效、可扩展环境光遮挡(SAO)、多重采样抗锯齿(SMAA)、屏幕空间环境光遮蔽(SSAO)、时间抗锯齿(TAA)。
16. 提供历史记录和日志功能，支持撤销、重做。
17. 支持导出`gltf`、`obj`、`ply`、`stl`、`Collada`、`DRACO`模型。
18. 支持`bullet`物理引擎。正方体、圆形、圆柱体、二十面体、酒杯、平面、球体、茶壶、轮胎、纽结和加载的模型都支持刚体组件。支持可视化设置碰撞体形状（正方体、球体）、质量和惯性。
19. 具有平移、旋转、缩放、在物体表面绘制点、线、贴花的工具，实时统计场景种物体、顶点、三角形数量。
20. 支持场景发布功能，可以将场景发布成静态资源，部署到任何一台服务器上。
21. 软件内置语言：`中文`、`繁體中文`、`English`、`日本語`、`한국어`、`русский`、`Le français`。
22. 支持色调旋转(hue-rotate)、饱和度、亮度、高斯模糊(blur)、对比度、灰度、颜色反转(invert)、复古(sepia)滤镜。
23. 支持版本控制。
24. 支持截图工具，视频录制工具。
25. 内置权限管理：组织机构管理、用户管理、角色管理、权限管理、系统初始化、系统重置、注册、登录、修改密码。

## 使用指南

**该项目仅支持Windows系统，电脑上需要安装.Net Framework 4.5。**

**兼容火狐和谷歌浏览器，推荐使用最新版谷歌浏览器。**

1. 安装`NodeJs`，在最外层目录，执行以下命令。

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

6. 为了保存各种类型文件能正常下载，会在iis上添加以下两个MIME类型，正式部署请注意安全。

| 文件扩展名 | MIME类型 | 说明 |
| --------- | -------- | ---- |
| .* | application/octet-stream | 各种格式后缀文件 |
| . | application/octet-stream | 无后缀文件 |

7. 编译文档，请安装gitbook。

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

## 相关链接

* Three.js官网：https://threejs.org/
* LOL模型查看器：https://github.com/tengge1/lol-model-viewer
* 模型下载1：https://sketchfab.com/3d-models?features=downloadable
* 模型下载2：https://www.3dpunk.com/work/index.html?category=downloadable