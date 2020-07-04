/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */

// r113
// source: https://github.com/mrdoob/three.js/blob/dev/editor/sw.js

const assets = [
	// './index.html',
	// './favicon.ico'
];

self.addEventListener('install', async function () {
	const cache = await caches.open('ShadowEditor');

	assets.forEach(function (asset) {
		cache.add(asset).catch(function () {
			// console.error('[SW] Cound\'t cache:', asset);
		});
	});
});

self.addEventListener('fetch', async function (event) {
	const request = event.request;
	event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
	const cachedResponse = await caches.match(request);

	if (cachedResponse === undefined) {
		// console.error('[SW] Not cached:', request.url);
		return fetch(request);
	}

	return cachedResponse;
}
