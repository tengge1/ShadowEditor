# シャドウエディター

English / [中文](README_zh.md) / [日本語](README_ja.md) &nbsp;&nbsp; |
&nbsp;&nbsp; <a href="https://github.com/tengge1/ShadowEditor/releases/download/v0.6.0/ShadowEditorServer-win32-x64.zip" title="Requires `Visual C++ Redistributable for Visual Studio 2015`">
Windows Server</a> &nbsp;&nbsp; |
&nbsp;&nbsp; <a href="https://github.com/tengge1/ShadowEditor/releases/download/v0.6.0/ShadowEditorServer-linux-x64.zip">
Ubuntu Server</a> &nbsp;&nbsp; | &nbsp;&nbsp; [Web Demo](https://tengge1.github.io/ShadowEditor-examples/)

注：サーバーはコンパイルされたバージョンで、mongodbが組み込まれています。`start.bat`または`start.sh`を実行して起動し、Google Chromeで`http://localhost:2020`にアクセスします。Windowsバージョンには`Visual C++ Redistributable for Visual Studio 2015`が必要です。

> 良いニュースです！vite4 + vue3 + ts5 + ant-design-vue7に基づくバージョンがまもなく登場します。[詳細はこちらをクリック](README_new.md)してご覧ください。

[![image](https://img.shields.io/github/stars/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/stargazers)
[![image](https://img.shields.io/github/forks/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/network/members)
[![image](https://img.shields.io/github/issues/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/issues)
![image](https://img.shields.io/github/languages/top/tengge1/ShadowEditor)
![image](https://img.shields.io/github/commit-activity/w/tengge1/ShadowEditor)
[![image](https://img.shields.io/github/license/tengge1/ShadowEditor)](https://github.com/tengge1/ShadowEditor/blob/master/LICENSE)
[![image](https://travis-ci.org/tengge1/ShadowEditor.svg?branch=master)](https://travis-ci.org/github/tengge1/ShadowEditor)

- 名前: シャドウエディター
- バージョン: v0.6.1 (近日公開)
- 説明: three.js、golang、mongodbに基づくクロスプラットフォームの3Dシーンエディター。
- ソース: [GitHub](https://github.com/tengge1/ShadowEditor) [Gitee](https://gitee.com/tengge1/ShadowEditor) |
  ドキュメント: [Gitee](https://gitee.com/tengge1/ShadowEditor/wikis/pages) |
  デモ: [GitHub](https://tengge1.github.io/ShadowEditor-examples/) [Gitee](http://tengge1.gitee.io/shadoweditor-examples/)
  |
  ビデオ: [Weibo](https://weibo.com/tv/v/IjIn9AyvX?fid=1034:4446986821107725) [Bilibili](https://www.bilibili.com/video/av78428475?from=search&seid=9203731141485399611)
  | アセット: [BaiduNetdisk(rfja)](https://pan.baidu.com/s/1BYLPyHJuc2r0bS9Te3SRjA)
- 技術スタック: html、css、javascript、rollup、react.js、webgl、three.js、golang、mongodb、nodejs、electron、
  プロトコルバッファ。
- 役立つ場合は、[寄付](https://gitee.com/tengge1/ShadowEditor)してサポートしてください。ありがとう！

<img src="https://gitee.com/tengge1/ShadowEditor/raw/master/images/scene20200503_en.jpg" />  
<img src="https://gitee.com/tengge1/ShadowEditor/raw/master/images/vr.jpg" />

## v0.6.1が近日公開

**`v0.6.1`から、ShadowEditorはコア機能と拡張APIのみを提供し、他の機能はVSCodeのように拡張機能で提供されます。`dev`ブランチで開発を行います。**

1. 一部のバージョンのgoフォント管理リストのエラーバグを修正。
2. モデルの履歴バージョンタブを非表示にします。
3. スプライトが選択されているとき、境界線は表示されなくなります。
4. 検索フィールドのドロップダウンスタイルのバグを修正。

## v0.6.0がリリースされました

- リリース日: 2021年7月24日
- 更新ログ:

1. リクエスト時に新しいmongo接続を作成するバグを修正。
2. ステータスバーでVRをチェックしてVRを有効にします。
3. シーントランスフォームを設定します。
4. オブジェクトをクリックしたときにウィンドウをポップアップする方法: https://gitee.com/tengge1/ShadowEditor/issues/I3APGI
5. `config.toml`で`https`を有効にできます。
6. モバイルブラウザのスクリプトにイベントを追加: `onTouchStart`、`onTouchEnd`、`onTouchMove`。
7. `three.js`をr130にアップグレード。
8. スクリプトにVRイベントを追加: `onVRConnected`、`onVRDisconnected`、`onVRSelectStart`、`onVRSelectEnd`。
9. VRオールインワンハンドルコントローラーのサポート、例: htc vive。
10. スクリプト削除のバグを修正。
11. `three.js`のアップグレードにより`Geometry`がシリアル化できないバグを修正。
12. 深度の競合問題を解決するために、マテリアル`polygonOffset`、`polygonOffsetFactor`、`polygonOffsetUnits`パラメータの視覚化設定を追加。
13. メッシュ内のコンポーネントが`visible`属性を保存できないバグを修正。
14. `Bin`タイプのモデルはサポートされなくなりました。
15. キューブテクスチャのバグを修正。
16. ソースコード内のすべての`prototype`をes6の`class`に書き換え。
17. ビジュアルモジュールを削除。
18. シーンをエクスポートする際にスカイボールテクスチャをコピーしないバグを修正。
19. 雨と雪のバグを修正。
20. 背景色と照明を変更し、背景と同じ色を追加しないようにして、見えにくくします。
21. パーティクルエミッターのバグを修正。
22. 布のバグを修正。
23. シャドウの動的設定のバグを修正。

## 機能リスト

- [x] 一般
  - [x] クロスプラットフォーム
    - [x] Windows、Linux、Mac
    - [x] デスクトップ、Web
  - [x] 多言語サポート
    - [x] English、中文、繁體中文、日本語、한국어、русский、Le français
  - [x] アセット管理
    - [x] シーン、メッシュ、テクスチャ、マテリアル、オーディオ、アニメーション、スクリーンショット、ビデオ、フォント
  - [x] 権限管理
    - [x] 組織、ユーザー
    - [x] 役割、権限
    - [x] 登録、ログイン、パスワード変更
  - [x] バージョン管理
    - [x] シーンの履歴とログ
    - [x] 元に戻す、やり直す、自動保存
  - [x] プレーヤー
    - [x] シーン内のアニメーションをリアルタイムで再生し、フルスクリーンおよび新しいウィンドウで再生可能
  - [x] 設定
    - [x] 表示、レンダラー、ヘルパー、フィルター、天気、コントロールモード、選択モード、追加モード、言語
- [x] 小シーン編集
  - [x] メッシュの追加
    - [x] 3ds、3mf、amf、assimp、awd、babylon、bvh、collada、ctm
    - [x] draco、fbx、gcode、gltf、glb、js、kmz、lmesh、md2、pmd、pmx
    - [x] nrrd、obj、pcd、pdb、ply、prwm、sea3d、stl、vrm、vrml、vtk、X
  - [x] 組み込みオブジェクト
    - [x] グループ
    - [x] 平面、立方体、円、円柱、球体、二十面体、トーラス、トーラスノット、ティーポット、旋盤
    - [x] スケーリングされないテキスト、3Dテキスト
    - [x] 線分、CatmullRom曲線、二次ベジェ曲線、三次ベジェ曲線、楕円曲線
    - [x] ポイントマーク
    - [x] 矢印ヘルパー、軸ヘルパー
    - [x] スプライト
  - [x] 組み込みライト
    - [x] 環境光、平行光、点光源、スポットライト、半球光、矩形光
    - [x] 点光源、半球光、矩形光ヘルパー
  - [x] 組み込みコンポーネント
    - [x] バックグラウンドミュージック、パーティクルエミッター
    - [x] 空、火、水、煙、布
    - [x] ベルリン地形、スカイスフィア
  - [x] マテリアル編集
    - [x] LineBasicMaterial、LineDashedMaterial、MeshBasicMaterial、MeshDepthMaterial、MeshNormalMaterial
    - [x] MeshLambertMaterial、MeshPhongMaterial、PointsMaterial、MeshStandardMaterial、MeshPhysicalMaterial
    - [x] SpriteMaterial、ShaderMaterial、RawShaderMaterial
  - [x] ポストプロセッシング
    - [x] アフターイメージ、ボケ、ドットスクリーン、FXAA、グリッチ
    - [x] ハーフトーン、ピクセル、RGBシフト、SAO
    - [x] SMAA、SSAA
    - [x] SSAO、TAA
  - [x] テキスト編集
    - [x] インテリジェンスを備えたJavaScript編集
    - [x] シェーダー編集
    - [x] jsonファイル編集
  - [x] メッシュエクスポート
    - [x] gltf、obj、ply、stl、Collada、DRACO
  - [x] シーンの公開
    - [x] シーンを静的リソースとして公開し、iframeに埋め込むことができます
  - [x] 例
    - [x] アルカノイド、カメラ、パーティクル、ピンポン、シェーダー
  - [x] 一般的なツール
    - [x] 選択、パン、回転、ズーム
    - [x] パースビュー、フロントビュー、サイドビュー、トップビュー、ワイヤーフレームモード
    - [x] スクリーンショット、録画
    - [x] ポイント描画、ライン描画、ポリゴン描画、スプレー
    - [x] 距離測定
  - [x] その他
    - [x] VR：cardboard、htc vive、chrome、firefox
    - [x] Bullet物理エンジン
- [x] UIコントロール
  - [x] キャンバス
  - [x] フォーム: ボタン、チェックボックス、フォーム、フォームコントロール、アイコンボタン、アイコンメニューボタン、イメージボタン、入力、ラベル、リンクボタン、
        ラジオ、検索フィールド、セレクト、テキストエリア、トグル
  - [x] アイコン
  - [x] イメージ: イメージ、イメージリスト、イメージセレクター、イメージアップローダー
  - [x] レイアウト: 絶対レイアウト、アコーディオンレイアウト、ボーダーレイアウト、HBoxレイアウト、テーブルレイアウト、VBoxレイアウト
  - [x] メニュー: コンテキストメニュー、メニューバー、メニューバーフィラー、メニューアイテム、メニューアイテムセパレーター、メニュータブ。
  - [x] パネル
  - [x] プログレス: ロードマスク
  - [x] プロパティ: ボタンプロパティ、ボタンプロパティ、チェックボックスプロパティ、カラープロパティ、ディスプレイプロパティ、整数プロパティ、
        数値プロパティ、プロパティグリッド、プロパティグループ、セレクトプロパティ、テキストプロパティ、テクスチャプロパティ
  - [x] SVG
  - [x] テーブル: データグリッド、テーブル、テーブルボディ、テーブルセル、テーブルヘッド、テーブル行
  - [x] タイムライン
  - [x] ツールバー: ツールバー、ツールバーフィラー、ツールバーセパレーター
  - [x] ツリー
  - [x] ウィンドウ: アラート、確認、メッセージ、写真、プロンプト、トースト、ビデオ、ウィンドウ

## 要件

1. MongoDB v3.6.8+
2. Chrome 81.0+または​​Firefox 75.0+

以下は、ソースからビルドする場合にのみ必要です。

1. Golang 1.14.2+
2. NodeJS 14.1+
3. gcc 9.3.0+（Windowsでは`tdm-gcc`、`MinGW-w64`または`MinGW`をインストールし、`gcc`がコマンドラインからアクセスできるようにします）
4. git 2.25.1+

**注:** バージョン番号は参考用です。

## ダウンロードとコンパイル

gitを使用してソースコードをダウンロードできます。

```bash
git clone https://github.com/tengge1/ShadowEditor.git
```

**中国**では、`github`は非常に遅いため、代わりに`gitee`を使用できます。

```bash
git clone https://gitee.com/tengge1/ShadowEditor.git
```

### WindowsおよびUbuntuでのビルド

**Webバージョン:**

1. `中国`にいる場合は、`npm run set-proxy`を実行してgolangおよびnodejsプロキシを設定します。
2. `npm install`を実行してnodejs依存関係をインストールします。
3. `npm run build`を実行してサーバーとWebをビルドします。
4. `build/config.toml`を編集し、mongodbのホストとポートを変更します。
5. `npm start`を実行してサーバーを起動します。`http://localhost:2020`にアクセスできます。
6. 設定ファイルで`https`を有効にした場合。`https://localhost:2020`にアクセスしてください。

**デスクトップバージョン:**

1. `MongoDB`をダウンロードし、`utils/mongodb`フォルダーに解凍します。
2. Webバージョンをビルドします。
3. `npm run build-desktop`を実行して、`build/desktop`フォルダーにデスクトップアプリをビルドします。

### Windowsサービスとしてインストール

1. `build`フォルダーで管理者として`PowerShell`または`cmd`を開きます。
2. `.\ShadowEditor install`を実行して、ShadowEditorをサービスとしてインストールします。
3. `.\ShadowEditor start`を実行して、ShadowEditorサービスを開始します。
4. `http://localhost:2020`にアクセスできます。
5. `Windowsサービスマネージャー`でこのサービスを管理することもできます。

### Ubuntuサービスとしてインストール

1. `./scripts/service_linux/shadoweditor.service`を編集し、正しいパスを設定します。
2. `sudo cp ./scripts/service_linux/shadoweditor.service /etc/systemd/system/`を実行します。
3. `sudo systemctl daemon-reload`を実行してサービスデーモンをリロードします。
4. `sudo systemctl start shadoweditor`を実行してサービスを開始します。
5. `sudo systemctl enable shadoweditor`を実行してサービスを自動起動に設定します。

## コマンドラインの使用

```
PS E:\github\ShadowEditor\build\> .\ShadowEditor
ShadowEditorは、three.js、golang、およびmongodbに基づく3Dシーンエディターです。
このアプリケーションは、データの保存にmongodbを使用します。

使用法:
  ShadowEditor [コマンド]

利用可能なコマンド:
  debug       Windowsでサービスをデバッグ
  help        任意のコマンドに関するヘルプ
  install     Windowsでサービスをインストール
  serve       サーバーを起動
  start       Windowsでサービスを開始
  stop        Windowsでサービスを停止
  version     バージョン番号を表示

フラグ:
      --config string   設定ファイル (デフォルト "./config.toml")
  -h, --help            ShadowEditorのヘルプ

詳細については、"ShadowEditor [コマンド] --help"を使用してください。
```

## 開発ガイド

1. `NodeJs`、`golang`、`MongoDB`、および`Visual Studio Code`をダウンロードしてインストールします。
2. 次のVSCode拡張機能をインストールすることをお勧めします。これらは役立つかもしれません。

```
ESLint、Go、Shader languages support for VS Code、TOML Language Support。
```

npmスクリプトの使用:

```
npm install:            nodejs依存関係をインストールします。
npm run build:          サーバーとWebクライアントをビルドします。
npm run build-server:   サーバーのみをビルドします。（開発用）
npm run build-web:      Webクライアントのみをビルドします。（開発用）
npm run build-desktop:  デスクトップバージョンをビルドします。
npm run dev:            ファイルが変更されたときにWebクライアントを自動的にビルドします。（開発用）
npm run copy:           Webフォルダーからビルドフォルダーにアセットをコピーします。
npm run start:          Webサーバーを起動します。
npm run set-proxy:      golangおよびnodejsプロキシを設定します。（中国のみ）
npm run unset-proxy:    golangおよびnodejsプロキシを解除します。
npm run install-dev:    golang開発ツールをインストールします。
npm run eslint:         jsファイルをチェックし、自動的にエラーを修正します。
npm run clean:          Webおよびデスクトップビルドを削除します。
npm run clear:          役に立たないnodejsパッケージを削除します。
```

## 貢献

<details>
  <summary>詳細を表示</summary>

ShadowEditorは、ユーザーと開発者の両方のためのプロジェクトです。このプロジェクトに貢献し、アイデアを試すことができます。年金はありませんが、多くの楽しみがあります。貢献するには、次の手順を実行します。

1. リポジトリをフォークします。
2. Feat_xxxブランチを作成します。
3. コードをコミットします。
4. プルリクエストを作成します。

**注:** 大きなバイナリを送信しないでください。そうしないと、`プルリクエスト`が拒否される可能性があります。必要に応じて、無視するファイルまたはディレクトリを`.gitignore`ファイルに追加できます。

</details>

## よくある質問

<details>
  <summary>詳細を表示</summary>

1. モデルのアップロードに失敗しました。

モデルアセットを`zip`ファイルに圧縮する必要があり、エントリファイルはフォルダーにネストできません。サーバーは解凍して`./build/public/Upload/Model`フォルダーに配置し、MongoDBの`_Mesh`コレクションにレコードを追加します。

2. 複数のモデルを組み合わせる方法は？

基本的なジオメトリは複数レベルのネストをサポートしています。`グループ`（ジオメトリメニュー内）を追加し、`階層`パネルで複数のモデルを`グループ`にドラッグできます。

3. 権限を有効にする方法は？

`config.toml`を編集し、`authority.enabled`を`true`に設定します。デフォルトの管理者ユーザー名は`admin`、パスワードは`123456`です。

4. ブラウザが`asm.jsはスクリプトデバッガーが接続されているため無効になっています。デバッガーの接続を解除してasm.jsを有効にしてください。`エラーを報告します。

**完全なエラー**: asm.jsはスクリプトデバッガーが接続されているため無効になっています。デバッガーの接続を解除してasm.jsを有効にしてください。 ammo.js (1,1) SCRIPT1028: SCRIPT1028: 予期しない識別子、文字列または数値 ShadowEditor.js (3948,8) SCRIPT5009: 'Shadow'が定義されていません。

**解決策**: Tencentブラウザは`Emscripten`でコンパイルされた`ammo.js`（WebAssembly）をサポートしていないため、代わりに`Chrome`または`Firebox`を使用することをお勧めします。

5. C#からgolangバージョンにアップグレードする方法は？

データ構造とWebクライアントは変更されていないため、`./ShadowEditor.Web/Upload/`フォルダーを`build/public/Upload/`にコピーするだけです。

6. デスクトップバージョンが開けません。

Windowsには`Visual C++ Redistributable for Visual Studio 2015`が必要です。インストールできます: https://www.microsoft.com/en-us/download/details.aspx?id=48145  
デスクトップバージョンが開けない場合は、`logs.txt`を確認できます。ポートが競合している場合は、`resources/app/config.toml`でMongoDBとWebサイトのポートを変更できます。

7. https証明書を作成する方法は？

`openssl`をインストールし、gitクライアントにはすでに1つ含まれています。`cmd`、`Powershell`または`shell`を開き、次のコマンドを実行します:

```sh
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

生成されたファイルの中で、`certificate.pem`は証明書、`privatekey.pem`はキーです。

</details>

## ライセンス

MITライセンス

## オープンソースプロジェクト

<details>
  <summary>詳細を表示</summary>

以下のオープンソースプロジェクトに感謝します。

https://github.com/golang/go  
https://github.com/BurntSushi/toml  
https://github.com/dgrijalva/jwt-go  
https://github.com/dimfeld/httptreemux  
https://github.com/inconshreveable/mousetrap  
https://github.com/json-iterator/go  
https://github.com/mozillazg/go-pinyin  
https://github.com/otiai10/copy  
https://github.com/sirupsen/logrus  
https://github.com/spf13/cobra  
https://github.com/spf13/viper  
https://github.com/urfave/negroni  
https://go.mongodb.org/mongo-driver

https://github.com/facebook/react  
https://github.com/mrdoob/three.js  
https://github.com/rollup/rollup  
https://github.com/babel/babel  
https://github.com/eslint/eslint  
https://github.com/rollup/rollup-plugin-babel  
https://github.com/rollup/rollup-plugin-commonjs  
https://github.com/rollup/rollup-plugin-json  
https://github.com/rollup/rollup-plugin-node-resolve  
https://github.com/egoist/rollup-plugin-postcss  
https://github.com/rollup/rollup-plugin-replace  
https://github.com/mjeanroy/rollup-plugin-strip-banner  
https://github.com/andyearnshaw/rollup-plugin-bundle-worker

https://github.com/tweenjs/tween.js  
https://github.com/JedWatson/classnames  
https://github.com/d3/d3-dispatch  
https://github.com/i18next/i18next  
https://github.com/js-cookie/js-cookie  
https://github.com/facebook/prop-types  
https://github.com/codemirror/CodeMirror  
https://github.com/jquery/esprima  
https://github.com/tschw/glslprep.js  
https://github.com/zaach/jsonlint  
https://github.com/acornjs/acorn  
https://github.com/kripken/ammo.js  
https://github.com/dataarts/dat.gui  
https://github.com/toji/gl-matrix  
https://github.com/squarefeet/ShaderParticleEngine  
https://github.com/mrdoob/stats.js  
https://github.com/mrdoob/texgen.js  
https://github.com/yomotsu/VolumetricFire  
https://github.com/jonbretman/amd-to-as6  
https://github.com/chandlerprall/ThreeCSG

</details>
