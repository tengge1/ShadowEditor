/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 下雨
 */
class Rain extends THREE.Object3D {
    constructor() {
        super();
        this.createPointClouds('assets/textures/particles/raindrop-3.png');
    }

    createPointClouds(url) {
        let range = 40;
        let vertices = [];
        let geometry = new THREE.BufferGeometry();
        geometry.velocity = [];

        for (let i = 0; i < 1500; i++) {
            vertices.push(
                Math.random() * range - range / 2,      // posX
                Math.random() * range * 1.5,            // posY
                Math.random() * range - range / 2      // posZ
            );
            geometry.velocity.push(
                0.1 + Math.random() / 5,                // velocityY
                (Math.random() - 0.5) / 3               // velocityX
            );
        }

        const position = new THREE.Float32BufferAttribute(vertices, 3);
        geometry.setAttribute('position', position);

        let material = new THREE.PointsMaterial({
            size: 3,
            transparent: true,
            opacity: 0.6,
            map: new THREE.TextureLoader().load(url),
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            color: 0xffffff
        });

        let points = new THREE.Points(geometry, material);
        points.sortParticles = true;

        this.add(points);
    }

    update() {
        this.children.forEach(n => {
            const position = n.geometry.attributes.position;
            const array = position.array;
            for (let i = 0; i < position.count; i++) {
                const velocityY = n.geometry.velocity[i * 2];
                const velocityX = n.geometry.velocity[i * 2 + 1];
                array[i * 3 + 1] -= velocityY;
                array[i * 3] -= velocityX;
                if (array[i * 3 + 1] <= 0) {
                    array[i * 3 + 1] = 60;
                }
                if (array[i * 3] <= -20 || array[i * 3] >= 20) {
                    array[i * 3] *= -1;
                }
            }

            position.needsUpdate = true;
        });
    }
}

export default Rain;