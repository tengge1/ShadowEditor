# ShadowEditor.ScriptEditor

脚本编辑器，支持`javascript`、`vertexShader`、`fragmentShader`、`json`，支持代码智能提示。

## 使用方法

```javascript
var container = document.getElementById('container');
var editor = new Shadow.ScriptEditor(container);

editor.setValue(`function HelloWorld() {\r\n  alert('Hello, world!'); \r\n}\r\n\r\nHelloWorld();`, 'javascript');

console.log(editor.getValue());
```

## API参考

```javascript
new Shadow.ScriptEditor(container); // 创建脚本编辑器

editor.setValue(
    source = '', 
    mode = 'javascript', 
    cursorPosition = { line: 0, ch: 0 }, 
    scrollInfo = { left: 0, top: 0 }
    ) // 设置代码

editor.getValue() // 获取代码

editor.clear(); // 清空代码

```