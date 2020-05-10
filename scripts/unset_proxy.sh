#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor

# unset go proxy

echo unset go proxy
go env -u GOPROXY

# unset nodejs proxy

echo unset nodejs proxy
npm config set registry https://registry.npmjs.org/

# Output the current `go proxy` and `nodejs proxy`.

echo current go proxy: $(go env GOPROXY)
echo current nodejs proxy: $(npm config get registry)