# Shadow Editor

* 名称：Shadow Editor
* 版本：v0.1.1（开发中）
* 简介：基于`three.js`的场景编辑器。

<table>
    <tr>
        <td>源码</td>
        <td><a href="https://github.com/tengge1/ShadowEditor">GitHub</a></td>
        <td><a href="https://gitee.com/tengge1/ShadowEditor">码云</a></td>
        <td>文档</td>
        <td><a href="https://tengge1.github.io/ShadowEditor/">GitHub</a></td>
        <td><a href="https://tengge1.gitee.io/shadoweditor/">码云</a></td>
    </tr>
    <tr>
        <td>演示</td>
        <td><a href="https://tengge1.github.io/ShadowEditor-examples/">GitHub</a></td>
        <td><a href="https://tengge1.gitee.io/shadoweditor/">码云</a></td>
        <td></td>
        <td><a href="UserGuide.md">安装指南</a></td>
        <td><a href="UpdateLog.md">更新日志</a></td>
    </tr>
</table>

## v0.1.0 更新

* 发布日期：2018年12月15日
* 更新日志：

1. 重新梳理模型导入功能。目前支持`3ds`、`3mf`、`amf`、`assimp`(anim)、`awd`、`babylon`、`bvh`(anim)、`collada`、`ctm`、`draco`、`fbx`(anim)、`gcode`、`gltf`(anim)、`js`(anim)、`json`(anim)、`kmz`、`lmesh`(anim)、`md2`、`mmd`(anim)、`nrrd`、`obj`、`pcd`、`pdb`、`ply`、`prwm`、`sea3d`(anim)、`stl`、`vrm`、`vrml`、`vtk`、`x` 31种3D文件格式，带`anim`的表示支持动画。多种3D文件同时支持`json`和二进制格式。`mmd`文件同时支持`pmd`和`pmx`格式，支持`vmd`格式的模型和相机动画。它也是唯一支持`lmesh`(lolking网站lol模型)的编辑器。
2. 播放器新增`第一视角控制器`、`飞行控制器`、`轨道控制器`、`指针锁定控制器`、`轨迹球控制器`5种控制器，在相机面板设置。
3. 场景面板，编辑场景分类，根据类别、名称、全拼、拼音首字母实时过滤。
4. 模型面板，编辑模型分类，根据类别、名称、全拼、拼音首字母实时过滤。
5. 贴图面板，编辑贴图分类，根据类别、名称、全拼、拼音首字母实时过滤。
6. 材质面板，编辑材质分类，根据类别、名称、全拼、拼音首字母实时过滤。
7. 音频面板，编辑音频分类，根据类别、名称、全拼、拼音首字母实时过滤。
8. 材质组件，新增保存材质和从材质面板选择材质功能。
9. 纹理、透明纹理、凹凸纹理、法线纹理、置换纹理、粗糙纹理、金属纹理、环境纹理、光照纹理、遮挡纹理、发光纹理从贴图面板选择贴图功能。
10. 删除上个版本场景窗口、模型窗口、贴图窗口、音频窗口。

## 主要功能

1. 3D场景在线编辑。
2. 内置多种几何体、光源，支持雾效、阴影、反光、背景图等。
3. 支持多种不同格式的3D模型。
4. 服务端使用`MongoDB`保存模型和场景数据。
5. 可视化修改场景、相机、几何体、材质、纹理和各种组件属性。
6. js脚本、着色器在线编辑，带智能提示。
7. 自带播放器，实时演示场景动态效果。
8. 支持补间动画、骨骼动画、粒子动画、mmd动画、lmesh动画等。

## 项目截图

大海龟来袭。

![image](images/scene20181215.png)

说明：

1. 带`anim`标注的是支持动画的模型。
2. lmesh模型来自`http://www.lolking.net/models`，其他模型来自`three.js`官网示例。

## 相关链接

* Three.js官网：https://threejs.org/
* LOL模型查看器：https://github.com/tengge1/lol-model-viewer