# Package Manager包管理器

Package Manager包管理器，提供包的管理和动态加载功能，避免开始加载资源过多，导致载入缓慢。

## 依赖项

无。

## 使用方法

**示例一**

```javascript
var pm = new PM.Manager();

pm.setPath('./packages');

pm.add('moduleA', [
    'ModuleA.js'
]);

pm.load('moduleA').then(() => {
    alert(moduleNameA);
    FunctionA();
});
```

**示例二**

```javascript
var pm = new PM.Manager();

pm.addFromFile('./packages/my-packages.json').then(() => {
    pm.loadAll().then(() => {
        alert(moduleNameA);
        alert(moduleNameB);
        FunctionA();
        FunctionB();
    });
});
```

**示例三**

```javascript
var pm = new PM.Manager();

pm.setPath('./packages');

pm.require([
    'MyCss.css',
    'ModuleA.js',
    'ModuleB.js'
]).then(() => {
    alert(moduleNameA);
    alert(moduleNameB);
    FunctionA();
    FunctionB();
});
```

## API参考

```javascript
var pm = new PM.Manager(path = 'packages'); // 创建包管理器：path为资源目录

pm.getPath(); // 获取资源目录

pm.setPath(path); // 设置资源目录

pm.add((name, assets = [])); // 添加一个包，name为包名，assets为资源列表，assets=[url1, url2, ...]

pm.addFromFile(path); // 从文件添加包，文件格式见资源文件格式

pm.remove(name); // 移除一个包

pm.get(name); // 获取一个包

pm.load(names); // 加载一个或一些包

pm.loadAll(); // 加载所有包

pm.require(assets); // 加载资源列表，assets为资源或资源列表，assets=[url1, url2, ...]

```

## 资源文件格式

```json
{
    "name": "My Packages",
    "version": "0.0.1",
    "packages": [
        {
            "name": "ModuleA",
            "assets": [
                "MyCss.css",
                "ModuleA.js"
            ]
        },
        {
            "name": "ModuleB",
            "assets": [
                "ModuleB.js"
            ]
        }
    ]
}
```