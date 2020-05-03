# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor

# You can use `make` to build this application on ubuntu.
#
# 1. Assume you have installed MongoDB, and now it's working correctly.
# 2. Run `sudo apt install make` to install the make tool.
# 3. If you are in China, run `make proxy` to set golang and nodejs proxy.
# 4. Run `make` in the folder that contains `Makefile` to build all this application.
# 5. Open `build/config.toml`, to set the database host and port.
# 6. Run `make run` to launch the application. You can visit in `http://localhost:2020`.
#
# `make` does the following things for you:
# 1. Install golang and nodejs development tools.
# 2. Install golang and nodejs dependencies.
# 3. Build golang server.
# 4. Build web client.
# You will see all the builds in the `build` folder.

# Build both server and web.
all: FORCE
	./scripts/install_develop.sh
	./scripts/install.sh
	./scripts/build.sh
	echo "Now you can run `make run` to launch the application."

# Install golang and nodejs dependencies.
install: FORCE
	./scripts/install.sh

# Install develop tools for golang.
install-develop: FORCE
	./scripts/install_develop.sh

# Build server only.
server: FORCE
	cd server && go build -o ../build/ShadowEditor

# Build web only.
web: FORCE
	cd web && npm run build

# Build web only, and watch the file changes.
web-dev: FORCE
	cd web && npm run dev

# Run server.
run: FORCE
	./scripts/run.sh

# Set golang and npm proxy. (Only for Chinese)
proxy: FORCE
	./scripts/set_go_proxy.sh
	./scripts/set_npm_proxy.sh

# Remove all files in the build folder except the uploaded assets.
clean: FORCE
	rm -r build/logs build/public/assets build/public/build \
	build/public/locales build/public/temp build/public/favicon.ico \
	build/public/index.html build/public/manifest.json build/public/sw.js \
	build/public/view.html build/config.toml build/ShadowEditor

.PHONY: FORCE
FORCE: