# API文档

* [PackageManager](package_manager/README.md)
* [UI](shadow_ui/README.md)

## ShadowEditor.PackageManager

* 功能：Shadow Editor包管理器，提供包的管理和动态加载功能，避免开始加载资源过多，导致运行缓慢。
* 依赖项：无。
* API：提供。

## ShadowEditor.UI

* 功能：编辑器UI。
* 依赖项：无
* API：提供。

## ShadowEditor.Core

* 功能：引擎核心文件，基本几何体、光源、加载器的封装，序列化和反序列化，提供方便好用的函数供播放器和编辑器使用，提供插件机制。
* 依赖项：PackageManager
* API：提供。

## ShadowEditor.Player

* 功能：提供播放器功能，加载场景并运行场景中的脚本和动画，可独立使用。
* 依赖项：Core
* API：提供。

## ShadowEditor.CodeEditor

* 功能：支持javascript、glsl、json的代码编辑器，带智能提示。
* 依赖项：PackageManager
* API：提供。

## ShadowEditor.Plugins

* 功能：几何体、编辑器、渲染器插件集合。
* 依赖项：Core
* API：提供。

## ShaderEditor

* 功能：提供场景、动画、材质、脚本的编辑，提供插件机制。
* 依赖项：UI、Core、Player、CodeEditor、Plugins
* API：提供。

## ShadowEditor.Server

* 功能：服务端，提供存储服务。
* 依赖项：无。
* API：提供。

## ShadowEditor.Web

* 功能：Web客户端，可在浏览器查看。
* ShaderEditor、Server