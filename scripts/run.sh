#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor
#
# Run the golang server. You should run `install.sh` and `build.sh` first.

# The current dir that you run this bash file.
CURRENT_DIR=$(pwd)
# The root dir that contains `README.md`.
ROOT_DIR=$(cd "$(dirname "$0")";cd "..";pwd)
# The build dir.
BUILD_DIR=$ROOT_DIR/build

# Print the dir information.
echo "current dir:" $CURRENT_DIR
echo "root dir:" $ROOT_DIR
echo "build dir:" $BUILD_DIR

# run the golang server.
echo 'enter' $BUILD_DIR
cd $BUILD_DIR
cd $ROOT_DIR/build
$ROOT_DIR/build/ShadowEditor serve --config=./config.toml
echo 'leave' $BUILD_DIR
cd $CURRENT_DIR