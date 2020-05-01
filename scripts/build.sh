#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor
#
# Download and install the third-party dependencies both for golang and nodejs.

# The current dir that you run this bash file.
CURRENT_DIR=$(pwd)
# The root dir that contains `README.md`.
ROOT_DIR=$(cd "$(dirname "$0")";cd "..";pwd)
# The golang server dir.
SERVER_DIR=$ROOT_DIR/server
# The web dir.
WEB_DIR=$ROOT_DIR/web

# Print the dir information.
echo "current dir:" $CURRENT_DIR
echo "root dir:" $ROOT_DIR
echo "server dir:" $SERVER_DIR
echo "web dir:" $WEB_DIR