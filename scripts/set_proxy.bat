:: Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
:: Use of this source code is governed by a MIT-style
:: license that can be found in the LICENSE file.
::
:: For more information, please visit: https://github.com/tengge1/ShadowEditor
:: You can also visit: https://gitee.com/tengge1/ShadowEditor

:: Usage: Double-click `set_proxy.bat` in the Windows explorer.
:: IMPORTANT: This script is for Chinese users only!

@echo off

:: For some well-known reasons, we can not install packages from golang.org in china;
:: and installing packages from github.com is extremely slow.
:: So, we can set a proxy to make it faster.

echo set go proxy...
call go env -w GO111MODULE=on
call go env -w GOPROXY=https://goproxy.cn

:: For some well-known reasons, it is slow to install packages from https://www.npmjs.com/ in china.
:: So, we can set a proxy to make it faster to install third-party dependencies.

call echo set nodejs proxy...
call npm config set registry https://registry.npm.taobao.org/

:: Output the current `go_proxy` and `node_proxy`.

for /F %%i in ('go env GOPROXY') do ( set go_proxy=%%i)
for /F %%i in ('npm config get registry') do ( set node_proxy=%%i)
echo current go proxy: %go_proxy%
echo current node proxy: %node_proxy%

:: Stop to let user see the execution result.
echo done
pause