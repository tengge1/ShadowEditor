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
 * 下雪
 */
class Snow extends THREE.Object3D {
    constructor() {
        super();

        this.createPointClouds('assets/textures/particles/snowflake1.png');
        this.createPointClouds('assets/textures/particles/snowflake2.png');
        this.createPointClouds('assets/textures/particles/snowflake3.png');
        this.createPointClouds('assets/textures/particles/snowflake5.png');
    }

    createPointClouds(url) {
        let geometry = new THREE.Geometry();

        let range = 40;

        for (let i = 0; i < 50; i++) {
            let particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2);

            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            particle.velocityZ = (Math.random() - 0.5) / 3;
            geometry.vertices.push(particle);
        }

        let color = new THREE.Color(0xffffff);

        let hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        color.setHSL(hsl.h, hsl.s, Math.random() * hsl.l);

        let material = new THREE.PointsMaterial({
            size: 10,
            transparent: true,
            opacity: 0.6,
            map: new THREE.TextureLoader().load(url),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            color: color
        });

        let points = new THREE.Points(geometry, material);
        points.sortParticles = true;
        this.add(points);
    }

    update() {
        this.children.forEach(child => {
            let vertices = child.geometry.vertices;

            vertices.forEach(v => {
                v.y = v.y - v.velocityY;
                v.x = v.x - v.velocityX;
                v.z = v.z - v.velocityZ;

                if (v.y <= 0) v.y = 60;
                if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
                if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
            });

            child.geometry.verticesNeedUpdate = true;
        });
    }
}

export default Snow;