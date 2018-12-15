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

<table>
    <tr valign="top">
        <td width="25%">平板<br><img src="images/examples/平板.png"></td>
        <td width="25%">正方体<br><img src="images/examples/正方体.png"></td>
        <td width="25%">圆<br><img src="images/examples/圆.png"></td>
        <td width="25%">圆柱体<br><img src="images/examples/圆柱体.png"></td>
    </tr>
    <tr valign="top">
        <td>球体<br><img src="images/examples/球体.png"></td>
        <td>二十面体<br><img src="images/examples/二十面体.png"></td>
        <td>轮胎<br><img src="images/examples/轮胎.png"></td>
        <td>纽结<br><img src="images/examples/纽结.png"></td>
    </tr>
    <tr valign="top">
        <td>茶壶<br><img src="images/examples/茶壶.png"></td>
        <td>酒杯<br><img src="images/examples/酒杯.png"></td>
        <td>精灵<br><img src="images/examples/精灵.png"></td>
        <td>文本<br><img src="images/examples/文本.png"></td>
    </tr>
    <tr valign="top">
        <td>环境光<br><img src="images/examples/环境光.png"></td>
        <td>平行光<br><img src="images/examples/平行光.png"></td>
        <td>点光源<br><img src="images/examples/点光源.png"></td>
        <td>聚光灯<br><img src="images/examples/聚光灯.png"></td>
    </tr>
    <tr valign="top">
        <td>半球光<br><img src="images/examples/半球光.png"></td>
        <td>矩形光<br><img src="images/examples/矩形光.png"></td>
        <td></td>
        <td></td>
    </tr>
    <tr valign="top">
        <td>基本材质<br><img src="images/examples/基本材质.png"></td>
        <td>冯氏材质<br><img src="images/examples/冯氏材质.png"></td>
        <td>兰伯特材质<br><img src="images/examples/兰伯特材质.png"></td>
        <td>标准材质<br><img src="images/examples/标准材质.png"></td>
    </tr>
    <tr valign="top">
        <td>物理材质<br><img src="images/examples/物理材质.png"></td>
        <td>法向量材质<br><img src="images/examples/法向量材质.png"></td>
        <td></td>
        <td></td>
    </tr>
    <tr valign="top">
        <td>火焰<br><img src="images/examples/火焰.png"></td>
        <td>水<br><img src="images/examples/水.png"></td>
        <td>烟<br><img src="images/examples/烟.png"></td>
        <td>布<br><img src="images/examples/布.png"></td>
    </tr>
    <tr valign="top">
        <td>天空<br><img src="images/examples/天空.png"></td>
        <td>粒子发射器<br><img src="images/examples/粒子发射器.png"></td>
        <td>柏林地形<br><img src="images/examples/柏林地形.png"></td>
        <td>着色器地形<br><img src="images/examples/着色器地形.png"></td>
    </tr>
    <tr valign="top">
        <td>画点<br><img src="images/examples/画点.png"></td>
        <td>画线<br><img src="images/examples/画线.png"></td>
        <td>贴花<br><img src="images/examples/贴花.png"></td>
        <td></td>
    </tr>
    <tr valign="top">
        <td>3ds模型<br><img src="images/examples/3ds模型.png"></td>
        <td>3mf模型<br><img src="images/examples/3mf模型.png"></td>
        <td>amf模型<br><img src="images/examples/amf模型.png"></td>
        <td>assimp模型(anim)<br><img src="images/examples/assimp模型.png"></td>
    </tr>
    <tr valign="top">
        <td>awd模型<br><img src="images/examples/awd模型.png"></td>
        <td>babylon模型<br><img src="images/examples/babylon模型.png"></td>
        <td>bvh模型(anim)<br><img src="images/examples/bvh模型.png"></td>
        <td>collada模型<br><img src="images/examples/collada模型.png"></td>
    </tr>
    <tr valign="top">
        <td>ctm模型<br><img src="images/examples/ctm模型.png"></td>
        <td>draco模型<br><img src="images/examples/draco模型.png"></td>
        <td>fbx模型(anim)<br><img src="images/examples/fbx模型.png"></td>
        <td>gcode模型<br><img src="images/examples/gcode模型.png"></td>
    </tr>
    <tr valign="top">
        <td>gltf模型(anim)<br><img src="images/examples/gltf模型.png"></td>
        <td>js模型(anim)<br><img src="images/examples/js模型.png"></td>
        <td>json模型(anim)<br><img src="images/examples/json模型.png"></td>
        <td>kmz模型<br><img src="images/examples/kmz模型.png"></td>
    </tr>
    <tr valign="top">
        <td>lmesh模型(anim)<br><img src="images/examples/lmesh模型.png"></td>
        <td>md2模型<br><img src="images/examples/md2模型.png"></td>
        <td>mmd模型(anim)<br><img src="images/examples/mmd模型.png"></td>
        <td>nrrd模型<br><img src="images/examples/nrrd模型.png"></td>
    </tr>
    <tr valign="top">
        <td>obj模型<br><img src="images/examples/obj模型.png"></td>
        <td>pcd模型<br><img src="images/examples/pcd模型.png"></td>
        <td>pdb模型<br><img src="images/examples/pdb模型.png"></td>
        <td>ply模型<br><img src="images/examples/ply模型.png"></td>
    </tr>
    <tr valign="top">
        <td>prwm模型<br><img src="images/examples/prwm模型.png"></td>
        <td>sea3d模型(anim)<br><img src="images/examples/sea3d模型.png"></td>
        <td>stl模型<br><img src="images/examples/stl模型.png"></td>
        <td>vrm模型<br><img src="images/examples/vrm模型.png"></td>
    </tr>
    <tr valign="top">
        <td>vrml模型<br><img src="images/examples/vrml模型.png"></td>
        <td>vtk模型<br><img src="images/examples/vtk模型.png"></td>
        <td>x模型<br><img src="images/examples/x模型.png"></td>
        <td></td>
    </tr>
    <tr valign="top">
        <td>立体贴图<br><img src="images/examples/立体贴图.png"></td>
        <td>雾效<br><img src="images/examples/雾效.png"></td>
        <td>视频贴图<br><img src="images/examples/视频贴图.png"></td>
        <td></td>
    </tr>
</table>

说明：

1. 带`anim`标注的是支持动画的模型。
2. lmesh模型来自`http://www.lolking.net/models`，其他模型来自`three.js`官网示例。

## 相关链接

* Three.js官网：https://threejs.org/
* LOL模型查看器：https://github.com/tengge1/lol-model-viewer