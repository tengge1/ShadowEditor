# UserData字段格式

每个Object3D对象都有UserData字段，格式如下：

```javascript
{
    FirstPinYin: "littlesttokyo", // 全拼首字母
    ID: "5bf6b913c8b49a3064937da1", // MongoDB _id字段
    Name: "LittlestTokyo", // 模型名称
    Server: true, // 表示从服务端下载的对象
    Thumbnail: "", // 模型缩略图
    TotalPinYin: "littlesttokyo", // 全拼
    Type: "glb", // 模型类型
    Url: "/Upload/Model/20181122221131/LittlestTokyo.glb", // 模型下载地址
    animNames: ["Take 001"], // 模型所有动画名称
    obj: obj, // 下载器onLoad中的原始对象
    root: scene, // 动画AnimationMixer根节点
    scripts: [{
        id: null, // MongoDB _id
        name: "LittlestTokyo动画", // 脚本名称
        source: "", // 脚本源码
        type: "javascript", // 脚本类型
        uuid: uuid, // three.js产生的唯一标志
    }, ...]
}
```
