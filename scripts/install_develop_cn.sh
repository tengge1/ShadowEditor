#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor
#
# Download and install the third-party development dependencies. These are only
# needed when you want to develop the golang server.
#
# First, you should install `VSCode`. You can download from: https://code.visualstudio.com/
# Second, open `VSCode`, install the `Go` extension.
# Last, run this file to download and install the third-party development dependencies.
#
# You are ready to go, and can experience the power of golang now.
#
# For some well-known reasons, we can not visit golang.org in china.
# So, we can use a proxy to download third-party dependencies.

go env -w GO111MODULE=on

go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/

go get -u -v github.com/uudashr/gopkgs/v2/cmd/gopkgs

go env -w GOPROXY=https://goproxy.cn

go get -u golang.org/x/tools/cmd/guru
go get -u golang.org/x/tools/cmd/gorename
go get -u golang.org/x/tools/cmd/goimports
go get -u golang.org/x/lint/golint
go get -u golang.org/x/tools/cmd/godoc
go get -u -v golang.org/x/tools/gopls

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