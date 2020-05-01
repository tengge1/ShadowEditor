#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor
#
# Download and install the third-party dependencies both for golang and nodejs.

# install the golang dependencies.
go env -w GO111MODULE=on
go install ../server/

# install the nodejs dependencies.
npm install ../