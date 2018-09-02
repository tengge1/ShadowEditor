# Shadow Editor

* 名称：Shadow Editor
* 版本：v0.0.4
* 说明：基于`three.js`的场景编辑器。
* 源码：https://github.com/tengge1/ShadowEditor
* 示例：https://github.com/tengge1/ShadowEditor-examples
* 文档：https://tengge1.github.io/ShadowEditor/docs/release/index.html

## 主要功能

1. 3D场景在线编辑，支持保存载入。
2. 12种内置几何体、6种光源，支持雾效、阴影。
3. 支持15种不同格式的3D模型管理，并可以保存到场景。
4. 服务端使用`MongoDB`保存模型和场景数据。
5. 支持场景层次图（Hierachy），物体、几何体、材质编辑。
6. js脚本在线编辑，支持智能提示。
7. 自带播放器，实时演示场景动态效果。

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

![image](images/scene20180826.png)

更多截图请参见示例：https://github.com/tengge1/ShadowEditor-examples

## 开发日志

**v0.0.4**

* 发布日期：2018年9月2日
* 更新日志：

1. 脚本编辑优化，脚本不再跟物体绑定，可以跟场景一起保存载入，提供[`javascript`](ShadowEditor.Web/src/editor/script/code/JavaScriptStarter.js)、[`vertexShader`](ShadowEditor.Web/src/editor/script/code/VertexShaderStarter.js)、[`fragmentShader`](ShadowEditor.Web/src/editor/script/code/FragmentShaderStarter.js)、
[`programInfo`](ShadowEditor.Web/src/editor/script/code/JsonStarter.js)示例脚本。

说明：自定义脚本中，默认有`scene`、`camera`、`renderer`三个全局变量，全局和事件中`this`都指代`scene`，可以使用函数
`scene.getObjectByName`获取场景对象，例如：

```javascript
var box = this.getObjectByName('正方体1');

// 程序运行过程中，每帧都要执行
function update(clock, deltaTime) {
	box.rotation.x += 0.01;
}
```

自定义脚本种支持`init`、`start`、`update`、`stop`、`onClick`、`onDblClick`、`onKeyDown`、`onKeyUp`、`onMouseDown`、`onMouseMove`、
`onMouseUp`、`onMouseWheel`、`onResize` 13种事件。

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
