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
        this.velocity = [];

        this.createPointClouds('assets/textures/particles/snowflake1.png');
        this.createPointClouds('assets/textures/particles/snowflake2.png');
        this.createPointClouds('assets/textures/particles/snowflake3.png');
        this.createPointClouds('assets/textures/particles/snowflake5.png');
    }

    createPointClouds(url) {
        let range = 40;
        let vertices = [];
        let geometry = new THREE.BufferGeometry();
        geometry.velocity = [];

        for (let i = 0; i < 50; i++) {
            vertices.push(
                Math.random() * range - range / 2,      // posX
                Math.random() * range * 1.5,            // posY
                Math.random() * range - range / 2       // posZ
            );
            geometry.velocity.push(
                0.1 + Math.random() / 5,                // velocityY
                (Math.random() - 0.5) / 3,              // velocityX
                (Math.random() - 0.5) / 3               // velocityZ
            );
        }

        const position = new THREE.Float32BufferAttribute(vertices, 3);
        geometry.setAttribute('position', position);

        let color = new THREE.Color(0xffffff);

        let hsl = {h: 0, s: 0, l: 0};
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
        this.children.forEach(n => {
            const position = n.geometry.attributes.position;
            const array = position.array;
            for (let i = 0; i < position.count; i++) {
                const velocityY = n.geometry.velocity[i * 3];
                const velocityX = n.geometry.velocity[i * 3 + 1];
                const velocityZ = n.geometry.velocity[i * 3 + 2];
                array[i * 3 + 1] = array[i * 3 + 1] - velocityY;
                array[i * 3] = array[i * 3] - velocityX;
                array[i * 3 + 2] = array[i * 3 + 2] - velocityZ;

                if (array[i * 3 + 1] <= 0) array[i * 3 + 1] = 60;
                if (array[i * 3] <= -20 || array[i * 3] >= 20) {
                    array[i * 3] = array[i * 3] * -1;
                }
                if (array[i * 3 + 2] <= -20 || array[i * 3 + 2] >= 20) {
                    n.geometry.velocity[i * 3 + 2] = velocityZ * -1;
                }
            }

            position.needsUpdate = true;
        });
    }
}

export default Snow;