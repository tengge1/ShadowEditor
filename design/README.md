# Shadow Editor新版架构

## ShaderUI.js

* 功能：编辑器UI。
* 依赖项：无
* API：提供。

## ShadowRequire.js

* 功能：动态加载和管理第三方类库。
* 依赖项：无。
* API：提供。

## ShaderCore.js

* 功能：引擎核心文件，基本几何体、光源、加载器的封装，序列化和反序列化，提供方便好用的函数供播放器和编辑器使用，提供插件机制。
* 依赖项：ShadowRequire.js。
* API：提供。

## ShaderPlayer.js

* 功能：提供播放器功能，加载场景并运行场景中的脚本和动画，可独立使用。
* 依赖项：ShadowRequire.js、ShadowCore.js。
* API：提供。

## ShaderEditor.js

* 功能：提供场景、动画、材质、脚本的编辑，提供插件机制。
* 依赖项：ShaderUI.js、ShadowRequire.js、ShadowCore.js、ShadowPlayer.js。
* API：提供。

## ShadowPlugin.js

* 功能：为几何体、编辑器、渲染器提供各种插件模板和帮助函数。
* 依赖项：ShadowRequire.js、ShaderCore.js。
* API：提供。