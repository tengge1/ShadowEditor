#! /bin/bash

# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor
#
# Build both the server and the web client.

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

# install the golang dependencies.
echo "enter" $SERVER_DIR
cd $SERVER_DIR
go env -w GO111MODULE=on
go install
echo 'leave' $SERVER_DIR
cd $CURRENT_DIR

# install the nodejs dependencies.
echo 'enter' $WEB_DIR
cd $WEB_DIR
npm install
echo 'leave' $WEB_DIR
cd $CURRENT_DIR

# Create build dir if it does not exist.
if [ ! -d build  ];then
  cd $ROOT_DIR
  echo "enter" $ROOT_DIR
  mkdir build
  echo 'leave' $CURRENT_DIR
  cd $CURRENT_DIR
fi

# Build the golang server.
echo "enter" $SERVER_DIR
cd $SERVER_DIR
echo "build server..."
go env -w GO111MODULE=on
go build -o ../build/ShadowEditor
echo "copy config.toml to the build directory"
cp config.toml ../build
echo 'leave' $SERVER_DIR
cd $CURRENT_DIR

# Build the nodejs web client.
echo 'enter' $WEB_DIR
cd $WEB_DIR
echo "build web client..."
npm run build
echo "copy files..."
cp -r ./assets ../build/public/assets
cp -r ./locales ../build/public/locales
cp ./favicon.ico ../build/public/favicon.ico
cp ./index.html ../build/public/index.html
cp ./manifest.json ../build/public/manifest.json
cp ./sw.js ../build/public/sw.js
cp ./view.html ../build/public/view.html
echo 'leave' $WEB_DIR
cd $CURRENT_DIR

# Output run information.
echo "Now you can run \`make run\` to launch the application."