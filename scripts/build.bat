:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.
::
:: For more information, please visit: https://github.com/tengge1/ShadowEditor
:: You can also visit: https://gitee.com/tengge1/ShadowEditor
::
:: Build both the server and the web client.

@echo off

:: Save current dir.
echo "save current work directory"
pushd

:: The ROOT_DIR is the parent directory of the `.bat` file.
for %%I in ("%~dp0.") do for %%J in ("%%~dpI.") do set ROOT_DIR=%%~dpnxJ
:: The SERVER_DIR is the golang server dir.
set SERVER_DIR=%ROOT_DIR%\server
:: The WEB_DIR is the web dir.
set WEB_DIR=%ROOT_DIR%\web
set BUILD_DIR=%ROOT_DIR%\build

:: Print the dir information.
echo "root dir:" %ROOT_DIR%
echo "server dir:" %SERVER_DIR%
echo "web dir:" %WEB_DIR%

:: Create build dir if it does not exist.
if not exist %BUILD_DIR% (
  cd %ROOT_DIR%
  echo "enter" %ROOT_DIR%
  mkdir %BUILD_DIR%
)

:: Build the golang server.
echo "enter" %SERVER_DIR%
cd %SERVER_DIR%
echo "build server..."
go env -w GO111MODULE=on
go build -o ../build/ShadowEditor.exe
echo "copy config.toml to the build directory"
copy .\config.toml ..\build

:: Copy files to the build folder.
echo 'enter' %WEB_DIR%
cd %WEB_DIR%
echo "copy files..."
xcopy /e /q /y %WEB_DIR%\assets %BUILD_DIR%\public\assets\
xcopy /e /q /y %WEB_DIR%\locales %BUILD_DIR%\public\locales\
copy favicon.ico ..\build\public\favicon.ico
copy index.html ..\build\public\index.html
copy manifest.json ..\build\public\manifest.json
copy sw.js ..\build\public\sw.js
copy view.html ..\build\public\view.html

:: Build the nodejs web client.
echo "build web client..."
call npm run build

:: Restore current dir.
echo "restore current work directory"
popd