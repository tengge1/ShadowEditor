:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.

@echo off

:: Download and install the third-party development dependencies. These are only
:: needed when you want to develop the golang server.
::
:: First, you should install `VSCode`. You can download from: https://code.visualstudio.com/
:: Second, open `VSCode`, install the `Go` extension.
:: Last, run this file to download and install the third-party development dependencies.
::
:: You are ready to go, and can experience the power of golang now.

go env -w GO111MODULE=on

go get -u golang.org/x/tools/cmd/guru
go get -u golang.org/x/tools/cmd/gorename
go get -u golang.org/x/tools/cmd/goimports
go get -u golang.org/x/lint/golint
go get -u golang.org/x/tools/cmd/godoc
go get -u -v golang.org/x/tools/gopls

go get -u -v github.com/uudashr/gopkgs/v2/cmd/gopkgs
go get -u -v github.com/acroca/go-symbols
go get -u -v github.com/cweill/gotests/...
go get -u -v github.com/fatih/gomodifytags
go get -u -v github.com/josharian/impl
go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct
go get -u -v github.com/haya14busa/goplay/cmd/goplay
go get -u -v github.com/godoctor/godoctor
go get -u -v github.com/go-delve/delve/cmd/dlv
go get -u -v github.com/zmb3/gogetdoc
go get -u -v github.com/rogpeppe/godef
go get -u -v github.com/ramya-rao-a/go-outline
go get -u -v github.com/sqs/goreturns
go get -u -v github.com/tylerb/gotype-live
go get -u -v github.com/sourcegraph/go-langserver
go get -u -v github.com/stamblerre/gocode


:: Download and install the third-party dependencies both for golang and nodejs.
:: You should install `golang` and `nodejs` first. In windows, you also need to
:: install `MinGW` to build cgo packages written in `C++`.

:: Save current dir.
echo "save current work directory"
pushd

:: The ROOT_DIR is the parent directory of the `.bat` file.
for %%I in ("%~dp0.") do for %%J in ("%%~dpI.") do set ROOT_DIR=%%~dpnxJ
:: The SERVER_DIR is the golang server dir.
set SERVER_DIR=%ROOT_DIR%\server
:: The WEB_DIR is the web dir.
set WEB_DIR=%ROOT_DIR%\web

:: Print the dir information.
echo "root dir:" %ROOT_DIR%
echo "server dir:" %SERVER_DIR%
echo "web dir:" %WEB_DIR%

:: install the golang dependencies.
echo "enter" %SERVER_DIR%
cd %SERVER_DIR%
go env -w GO111MODULE=on
echo "run `go install`"
go install

:: install the nodejs dependencies.
echo "enter" %WEB_DIR%
cd %WEB_DIR%
echo "run `npm install`"
call npm install

:: Restore current dir.
echo "restore current work directory"
popd

:: Build both the server and the web client.

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