:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.
::
:: For more information, please visit: https://github.com/tengge1/ShadowEditor
:: You can also visit: https://gitee.com/tengge1/ShadowEditor
::
:: Run the golang server. You should run `install.sh` and `build.sh` first.

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

:: run the golang server.
echo "enter" %BUILD_DIR%
cd %BUILD_DIR%
.\ShadowEditor.exe serve --config=.\config.toml

:: Restore current dir.
echo "restore current work directory"
popd

:: Pause to see if there are some errors.
pause