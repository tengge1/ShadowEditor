# Shadow Editor包管理器

* 功能：Shadow Editor包管理器，提供包的管理和动态加载功能，避免开始加载资源过多，导致运行缓慢。
* 依赖项：无。

## 使用方法

**示例一**

```javascript
var pm = new Shadow.PackageManager();
pm.setPath('../../ShadowEditor.Web/assets');
pm.add('three', [
    'js/three.js'
]);
pm.load('three').then(() => {
    var scene = new THREE.Scene();
    alert(scene);
});
```

**示例二**

```javascript
var pm = new Shadow.PackageManager();
pm.setPath('../../ShadowEditor.Web/assets');
pm.addFromFile('../../ShadowEditor.Web/assets/packages.json').then(() => {
    pm.load('three').then(() => {
        var scene = new THREE.Scene();
        alert(scene);
    });
});
```

## API参考

```javascript
var pm = new PackageManager(path = 'packages'); // 创建包管理器：path为资源目录

pm.getPath(); // 获取资源目录

pm.setPath(path); // 设置资源目录

pm.add((name, assets = [])); // 添加一个包，name为包名，assets为资源列表，assets=[url1, url2, ...]

pm.addFromFile(path); // 从文件添加包，文件格式见packages.json文件格式一部分。

pm.remove(name); // 移除一个包

pm.get(name); // 获取一个包

pm.load(names); // 加载一个或一些包

pm.loadAll(); // 加载所有包

pm.loadAssets(assets); // 加载资源列表，assets为资源列表，assets=[url1, url2, ...]

```

## `packages.json`文件格式

```json
{
    "name": "ShadowEditor.Packages",
    "version": "0.0.1",
    "packages": [
        {
            "name": "three",
            "assets": [
                "js/three.js"
            ]
        }
    ]
}
```