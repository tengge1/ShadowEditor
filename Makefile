# Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
# Use of this source code is governed by a MIT-style
# license that can be found in the LICENSE file.
#
# For more information, please visit: https://github.com/tengge1/ShadowEditor
# You can also visit: https://gitee.com/tengge1/ShadowEditor

# Build both server and web.
all: FORCE
	./scripts/build.sh

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

# Remove all files in the build folder except the uploaded assets.
clean: FORCE
	rm -r build/logs build/public/assets build/public/build \
	build/public/locales build/public/temp build/public/favicon.ico \
	build/public/index.html build/public/manifest.json build/public/sw.js \
	build/public/view.html build/config.toml build/ShadowEditor

.PHONY: FORCE
FORCE: