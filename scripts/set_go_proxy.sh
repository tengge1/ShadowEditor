#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor
#
# For some well-known reasons, we can not install packages from golang.org in china;
# and install packages from github.com is extremely slow.
#
# So, we can set a proxy to make it faster to install third-party dependencies.

go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn