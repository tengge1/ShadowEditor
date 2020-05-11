:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.

@echo off

:: Download and install the third-party dependencies both for golang and nodejs.
:: You should install `golang` and `nodejs` first. In windows, you also need to
:: install `tdm-gcc`, `MinGW-w64` or `MinGW` to build cgo packages written in `C++`.

:: Save current dir.
echo save current work directory
pushd

:: The ROOT_DIR is the parent directory of the `.bat` file.
for %%I in ("%~dp0.") do for %%J in ("%%~dpI.") do set ROOT_DIR=%%~dpnxJ
:: The SERVER_DIR is the golang server dir.
set SERVER_DIR=%ROOT_DIR%\server
:: The WEB_DIR is the web dir.
set WEB_DIR=%ROOT_DIR%\web
:: The BUILD_DIR is the final build result.
set BUILD_DIR=%ROOT_DIR%\build

:: Print the dir information.
echo root dir: %ROOT_DIR%
echo server dir: %SERVER_DIR%
echo web dir: %WEB_DIR%
echo build dir: %BUILD_DIR%

:: install the golang dependencies.
echo enter %SERVER_DIR%
cd %SERVER_DIR%
call go env -w GO111MODULE=on
echo go install

:: call go install won't show details
go install

:: install the nodejs dependencies.
echo enter %WEB_DIR%
cd %WEB_DIR%
echo npm install
call npm install

:: Build both the server and the web client.
:: Create build dir if it does not exist.
if not exist %BUILD_DIR% (
  cd %ROOT_DIR%
  echo enter %ROOT_DIR%
  mkdir %BUILD_DIR%
)

:: Build the golang server.
echo enter %SERVER_DIR%
cd %SERVER_DIR%
echo build server...
call go env -w GO111MODULE=on
call go build -o ../build/ShadowEditor.exe
echo copy config.toml to the build directory
copy .\config.toml ..\build

:: Copy files to the build folder.
echo enter %WEB_DIR%
cd %WEB_DIR%
echo copy files...
xcopy /e /q /y %WEB_DIR%\assets %BUILD_DIR%\public\assets\
xcopy /e /q /y %WEB_DIR%\locales %BUILD_DIR%\public\locales\
copy favicon.ico ..\build\public\favicon.ico
copy index.html ..\build\public\index.html
copy manifest.json ..\build\public\manifest.json
copy sw.js ..\build\public\sw.js
copy view.html ..\build\public\view.html

:: Build the nodejs web client.
echo build web client...
call npm run build

:: Restore current dir.
echo "restore current work directory"
popd

:: Pause to let user see the execution result.
echo build successfully
pause