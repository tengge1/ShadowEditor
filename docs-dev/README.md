# Shadow Editor

## 简介

* 名称：Shadow Editor
* 版本：v0.0.8(开发中)
* 说明：基于`three.js`的场景编辑器。
* 源码：https://github.com/tengge1/ShadowEditor
* 示例：https://github.com/tengge1/ShadowEditor-examples
* 文档：https://tengge1.github.io/ShadowEditor/docs/release/index.html
* 截图：https://github.com/tengge1/ShadowEditor/blob/master/images/README.md
* 资源：https://pan.baidu.com/s/1yk7luPAdRB9sAH2-Byghww
* 提取码: qdds

## 主要功能

1. 3D场景在线编辑。
2. 内置多种几何体、光源，场景支持雾效、影子、反光、背景图片等。
3. 支持导入多种不同格式的3D模型。
4. 服务端使用`MongoDB`保存模型和场景数据。
5. 可视化修改场景、相机、几何体、材质、纹理、音频播放器、粒子发射器等属性。
6. js脚本、着色器脚本在线编辑，带智能提示。
7. 自带播放器，实时演示场景动态效果。
8. 支持补间动画、骨骼动画、粒子动画，支持mmd动画，支持lmesh动画。

## 使用方法

**该项目仅支持Windows系统，电脑上需要安装.Net Framework 4.5。**

1. 安装`NodeJs`，转到`ShadowEditor.Web`目录，执行以下命令。

```bash
npm install
npm run build
```

2. 下载`MongoDB`，安装并启动MongoDB服务。MongoDB服务的默认端口为27017。

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

## 项目截图

![image](image/scene20181007.png)

## 开发日志

**v0.0.7**

* 发布日期：2018年10月14日
* 更新日志：

1. 场景、模型、纹理、音频、mmd资源编辑功能，可上传预览图。
2. 材质纹理属性编辑功能。
3. 播放器重新架构。
4. 粒子发射器、天空、火焰、烟保存、载入、播放优化。
5. 刚体组件不再默认添加，改为从组件菜单中手动添加。

**v0.0.6**

* 发布日期：2018年9月30日
* 更新日志：

1. 提供补间动画支持。可以在时间轴上可视化修改补间动画，并在播放器中播放。
2. 新增上传mmd模型（pmd和pmx格式）和mmd动画，可以在播放器中播放。
3. 新增上传lmesh模型，可在播放器中播放。
4. 基本几何体、光源、地形封装，便于进一步开发。

**v0.0.5**

* 发布日期：2018年9月16日
* 更新日志：

1. 布局修改：右侧改为两栏，左边栏提供场景层次图和js脚本管理功能，右边栏是属性、设置和历史面板。
在编辑场景下方新增动画编辑（未完成），并把日志查看移动到这里。
2. 属性面板组件化改造，新增基本信息、相机、几何体、光源、材质、粒子发射器、物理配置、场景、影子、
位移、音频监听器、背景音乐等多个组件。
3. 背景音乐支持保存载入，提供音频管理。
4. 修复编辑着色器程序功能，实时查看着色器效果。
5. 新增茶壶参数编辑组件。
6. 各种几何体都可以开启反射。

**v0.0.4**

* 发布日期：2018年9月2日
* 更新日志：

1. 脚本编辑优化，脚本不再跟物体绑定，可以跟场景一起保存载入，提供javascript、vertexShader、fragmentShader、programInfo示例脚本。

2. 背景支持纯色、背景图片、立体贴图三种不同类型，可以保存载入。

3. 新增网格、相机、点光源、平行光、聚光灯、半球光、矩形光、帮助器、骨骼9种帮助器的显示隐藏设置。

4. 新增日志面板。

5. 平板新增镜面特效。

**v0.0.3**

* 发布日期：2018年8月15日
* 更新日志：

1. 使用`asp.net`开发`web`服务端，使用`MongoDB`保存模型和场景数据。
2. 15种格式3D模型的上传，并可以保存到场景。
3. 场景的创建、保存、载入。
4. 组、12种内置几何体、5种光源可以保存场景并载入。
5. 85种three.js对象的序列化和反序列化。

**v0.0.2**

* 发布时间：2018年6月9日
* 更新日志：

1. 使用`rollup`重构`three.js`自带编辑器的代码。

**v0.0.1**

* 发布时间：2017年6月21日  
* 更新日志：

1. 主要完成three.js自带编辑器的翻译。

## 相关链接

* Three.js官网：https://threejs.org/
* Three.js源码：https://github.com/mrdoob/three.js/
* LOL模型：http://www.lolking.net/models