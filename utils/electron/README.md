# Shadow Editor Desktop

Use Electron to create a desktop app.

## Create on Windows

1. Install `Electron`.

```bash
npm install --save-dev electron electron-packager
```

In China, as it is really slow and may fail at last, you can set a proxy as follows. Create or edit
file `C:\Users\{Username}\.npmrc`, and write:

```conf
registry=https://registry.npm.taobao.org/
disturl=https://npm.taobao.org/mirrors/node
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
```

2. Download MongoDB and unzip in the `mongo` folder.

Download mongodb zip package from `https://www.mongodb.com/try/download/community`.

Unzip mongodb-win32-x86_64-2012plus-4.2.7.zip in the `mongo` folder.

You can run `mongo/start.bat` and test if mongodb works well.

3. Build ShadowEditor.

Read [README.md](../../README.md) in the root folder to build on Windows.

5. Run the following in this folder to copy `build` folder.

```
xcopy /e /q /y ..\..\build .\build
```