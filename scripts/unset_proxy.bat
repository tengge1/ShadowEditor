:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.
::
:: For more information, please visit: https://github.com/tengge1/ShadowEditor
:: You can also visit: https://gitee.com/tengge1/ShadowEditor

:: Usage: Double-click `unset_proxy.bat` in the Windows explorer.

@echo off

:: unset go proxy

echo unset go proxy
call go env -u GOPROXY

:: unset nodejs proxy

echo unset nodejs proxy
call npm config set registry https://registry.npmjs.org/

:: Output the current `go_proxy` and `node_proxy`.

for /F %%i in ('go env GOPROXY') do ( set go_proxy=%%i)
for /F %%i in ('npm config get registry') do ( set node_proxy=%%i)
echo current go proxy: %go_proxy%
echo current nodejs proxy: %node_proxy%

:: Pause to let user see the execution result.
echo done
pause