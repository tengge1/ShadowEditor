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
        let geometry = new THREE.Geometry();

        let range = 40;

        for (let i = 0; i < 1500; i++) {
            let particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2);
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            geometry.vertices.push(particle);
        }

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
            n.geometry.vertices.forEach(v => {
                v.y = v.y - v.velocityY;
                v.x = v.x - v.velocityX;

                if (v.y <= 0) {
                    v.y = 60;
                }

                if (v.x <= -20 || v.x >= 20) {
                    v.velocityX = v.velocityX * -1;
                }
            });

            n.geometry.verticesNeedUpdate = true;
        });
    }
}

export default Rain;