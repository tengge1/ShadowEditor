:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.
::
:: For more information, please visit: https://github.com/tengge1/ShadowEditor
:: You can also visit: https://gitee.com/tengge1/ShadowEditor
::
:: Download and install the third-party dependencies both for golang and nodejs.
:: You should install `golang` and `nodejs` first. In windows, you also need to
:: install `MinGW` to build cgo packages written in `C++`.

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
npm install

:: Restore current dir.
echo "restore current work directory"
popd