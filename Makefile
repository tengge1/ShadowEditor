# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor

# You can use `make` to build this application on ubuntu.
#
# 1. If you are in `China`, run `make proxy` to set golang and nodejs proxy.
# 2. Run `make` to build the server and web.
# 3. Edit `build/config.toml`, and modify the database host and port.
# 4. Run `make run` to launch the server. You can now visit: `http://localhost:2020`.

# Build both server and web.
all: FORCE
	./scripts/build.sh

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

# Set golang and nodejs proxy. (Only for Chinese)
proxy: FORCE
	./scripts/set_proxy.sh

# Unset golang and nodejs proxy.
unproxy: FORCE
	./scripts/unset_proxy.sh

# Remove all files in the build folder except the uploaded assets.
clean: FORCE
	rm -r build/logs build/public/assets build/public/build \
	build/public/locales build/public/temp build/public/favicon.ico \
	build/public/index.html build/public/manifest.json build/public/sw.js \
	build/public/view.html build/config.toml build/ShadowEditor

# Install as linux service, for ubuntu only.
service: FORCE
	sudo cp ./scripts/service_linux/shadoweditor.service /etc/systemd/system/
	sudo systemctl daemon-reload


# Uninstall linux service, for ubuntu only.
uninstall-service: FORCE
	sudo rm /etc/systemd/system/shadoweditor.service
	sudo systemctl daemon-reload

.PHONY: FORCE
FORCE: