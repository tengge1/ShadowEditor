# ShadowEditor.SVG

ShadowEditor.SVG将SVG标签封装为类，可以像ExtJs那样通过javascript动态生成svg。

**ShadowEditor.SVG不保证兼容除最新版`Chrome`以外的其他浏览器。**

使用方法：

```javascript
var dom = Shadow.SVG.create({
    xtype: 'svg',
    parent: document.body,
    attr: {
        width: 400,
        height: 400,
        viewBox: '0 0 100 100'
    },
    children: [{
        xtype: 'circle',
        attr: {
            cx: 50,
            cy: 50,
            r: 30,
            stroke: '#555',
            'stroke-width': 2,
            fill: '#f00'
        },
        listeners: {
            click: () => {
                alert('You clicked!');
            }
        }
    }]
});

dom.render();
```

更多示例请参照test文件夹中的示例，部分数据来自`MDN`、`w3school`和`runoob`中的示例。

## 依赖项

无。

## 类库

|       类名         |       xtype       |        说明          |       类名         |      xtype         |        说明           |
|-------------------|-------------------|----------------------|--------------------|--------------------|-----------------------|
|   SVG             |    无              |   框架核心。         |    SvgControl       |   无              |   所有svg控件基类。     |
|   Animate         |    animate         |                     |    AnimateMotion    |   animatemotion   |                       |
|   AnimateTransform|    animatetransform|                     |    Discard          |   discard         |                       |
|   MPath           |    mpath           |                     |    Set              |   set             |                       |
|   Defs            |    defs            |                     |    Marker           |   marker          |  箭头                 |
|   Mask            |    mask            |                     |    Pattern          |   pattern         |                       |
|   SvgDom          |    svg             |   svg文档。          |    Desc             |   desc            |                      |
|   MetaData        |    metadata        |                     |    Title            |    title           |                      |
|   feBlend         |    feblend         |  混合滤镜            |    feColorMatrix    |    fecolormatrix   |                      |
| feComponentTransfer | fecomponenttransfer |                  |    feComposite      |    fecomposite     |                      |
| feConvolveMatrix  |  feconvolvematrix |                      |   feDiffuseLighting |  fediffuselighting |                      |
| feDisplacementMap | fedisplacementmap  |                     |    feDropShadow     |    fedropshadow    |                      |
|   feFlood         |    feflood         |                     |    feFuncA          |    fefunca         |                      |
|   feFuncB         |    fefuncb         |                     |    feFuncG          |    fefuncg         |                      |
|   feFuncR         |    fefuncr         |                     |    feGaussianBlur   |    fegaussianblur  |   高斯滤镜            |
|   feImage         |    feimage         |                     |    feMerge          |    femerge         |                      |
|   feMergeNode     |    femergenode     |                     |    feMorphology     |    femorphology    |                      |
|   feOffset        |    feoffset        |  偏移滤镜            |  feSpecularLighting | fespecularlighting |                      |
|   feTile          |    fetile          |                     |    feTurbulence     |     feturbulence   |                      |
|   Font            |    font            |                     |    LinearGradient   |    lineargradient  |  线性渐变             |
|   RadialGradient  |    radialgradient  |   径向渐变           |    Stop             |   stop             |                      |
|   feDistantLight  |    fedistantlight  |                     |    fePointLight     |   fepointlight     |                      |
|   feSpotLight     |    fespotlight     |                     |    Anchor           |   a                |    锚点               |
|   Circle          |    circle          |    圆               |    Ellipse          |   ellipse          |    椭圆               |
|   ForeignObject   |    foreignobject   |                     |    Group            |   g                |   组                 |
|   Image           |    image           |    图片             |    Line             |   line             |    线                 |
|   Path            |    path            |                     |    Polygon          |   polygon          |    多边形             |
|   Polyline        |    polyline        |    折线              |    Rect             |   rect             |    矩形              |
|   Switch          |    switch          |                     |    Symbol           |   symbol           |                      |
|   Text            |    text            |   文本              |    TextPath         |   textpath         |     文本路径          |
|   TSpan           |    tspan           |                     |    Use              |   use              |     引用             |
|   ClipPath        |    clippath        |   裁剪              |    ColorProfile     |   colorprofile     |                      |
|   Filter          |    filter          |   滤镜              |    Script           |   script           |    脚本              |
|   Style           |    style           |   样式              |    View             |   view             |                      |

## 原理

* ShadowEditor.SVG借助[xtype.js](https://github.com/tengge1/xtype.js)将javascript转换为dom。
* `xtype.js`通过js创建dom，并将属性、数据、样式和事件赋值给dom。
* `xtype.js`并未实现任何属性或事件，仅提供xtype和控件实例管理。

**ShadowEditor.SVG.js已经内置xtype.js，无需再次引入。**

## 核心函数

`SVG`：通过xtype创建dom。
`SvgControl`：所有svg控件基类，子类需要实现`render`函数。

请阅读[xtype.js](https://github.com/tengge1/xtype.js)文档来了解这两个函数用法。

## 示例

自定义控件示例：

```javascript
function CustomControl(options = {}) {
    Shadow.SvgControl.call(this, options);
}

CustomControl.prototype = Object.create(Shadow.SvgControl.prototype);
CustomControl.prototype.constructor = CustomControl;

CustomControl.prototype.render = function () {
    this.renderDom(this.createElement('circle'));
};

var dom = Shadow.SVG.create({
    xtype: 'svg',
    parent: document.body,
    attr: {
        width: 800,
        height: 600,
    },
    children: [
        new CustomControl({
            attr: {
                cx: 80,
                cy: 80,
                r: 50,
                stroke: '#555',
                'stroke-width': 2,
                fill: '#f00'
            },
            listeners: {
                click: () => {
                    alert('You clicked!');
                }
            }
        })
    ]
});

dom.render();
```

## 注意事项

* ShadowEditor.SVG采用[ECMAScript6](http://es6.ruanyifeng.com/)的一些语法，不兼容不支持[ECMAScript6](http://es6.ruanyifeng.com/)的浏览器，推荐使用最新版谷歌浏览器开发使用。

## 相关链接

xtype.js: https://github.com/tengge1/xtype.js