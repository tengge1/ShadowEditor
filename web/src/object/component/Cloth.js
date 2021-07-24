/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/*
 * Cloth Simulation using a relaxed constraints solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf
var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.1;
var restDistance = 25;

var xSegs = 10;
var ySegs = 10;

function plane(width, height) {
    return function (u, v, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();

        var x = (u - 0.5) * width;
        var y = (v + 0.5) * height;
        var z = 0;

        return result.set(x, y, z);
    };
}

var clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(MASS);

var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var wind = true;
// var windStrength = 2;
var windForce = new THREE.Vector3(0, 0, 0);

var tmpForce = new THREE.Vector3();

var lastTime;

class Particle {

    constructor(x, y, z, mass) {

        this.position = new THREE.Vector3();
        this.previous = new THREE.Vector3();
        this.original = new THREE.Vector3();
        this.a = new THREE.Vector3(0, 0, 0); // acceleration
        this.mass = mass;
        this.invMass = 1 / mass;
        this.tmp = new THREE.Vector3();
        this.tmp2 = new THREE.Vector3();

        // init

        clothFunction(x, y, this.position); // position
        clothFunction(x, y, this.previous); // previous
        clothFunction(x, y, this.original);

    }

    // Force -> Acceleration

    addForce(force) {

        this.a.add(
            this.tmp2.copy(force).multiplyScalar(this.invMass)
        );

    }

    // Performs Verlet integration

    integrate(timesq) {

        const newPos = this.tmp.subVectors(this.position, this.previous);
        newPos.multiplyScalar(DRAG).add(this.position);
        newPos.add(this.a.multiplyScalar(timesq));

        this.tmp = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.a.set(0, 0, 0);

    }

}

var diff = new THREE.Vector3();

function satisfyConstraints(p1, p2, distance) {
    diff.subVectors(p2.position, p1.position);
    var currentDist = diff.length();
    if (currentDist === 0) return; // prevents division by 0
    var correction = diff.multiplyScalar(1 - distance / currentDist);
    var correctionHalf = correction.multiplyScalar(0.5);
    p1.position.add(correctionHalf);
    p2.position.sub(correctionHalf);
}

/**
 * 布料
 */
class Cloth extends THREE.Mesh {
    constructor(w = 20, h = 20) {
        var pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        var w = xSegs;
        var h = ySegs;

        const particles = [];
        const constraints = [];

        // Create particles
        for (let v = 0; v <= h; v++) {
            for (let u = 0; u <= w; u++) {
                particles.push(
                    new Particle(u / w, v / h, 0, MASS)
                );
            }
        }

        // Structural
        for (let v = 0; v < h; v++) {
            for (let u = 0; u < w; u++) {
                constraints.push([
                    particles[index(u, v)],
                    particles[index(u, v + 1)],
                    restDistance
                ]);
                constraints.push([
                    particles[index(u, v)],
                    particles[index(u + 1, v)],
                    restDistance
                ]);
            }
        }

        for (let u = w, v = 0; v < h; v++) {
            constraints.push([
                particles[index(u, v)],
                particles[index(u, v + 1)],
                restDistance
            ]);
        }
        for (let v = h, u = 0; u < w; u++) {
            constraints.push([
                particles[index(u, v)],
                particles[index(u + 1, v)],
                restDistance
            ]);
        }

        function index(u, v) {
            return u + v * (w + 1);
        }

        // 材质
        var loader = new THREE.TextureLoader();

        var clothTexture = loader.load('assets/textures/patterns/circuit_pattern.png');
        clothTexture.anisotropy = 16;

        var clothGeometry = new THREE.ParametricGeometry(clothFunction, w, h);

        var clothMaterial = new THREE.MeshLambertMaterial({
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        super(clothGeometry, clothMaterial);

        this.w = w;
        this.h = h;
        this.particles = particles;
        this.constraints = constraints;
        this.index = index;

        this.scale.multiplyScalar(0.02);

        this.castShadow = true;

        Object.assign(this.userData, {
            type: 'Cloth'
        });

        this.pins = pins;
        this.clothGeometry = clothGeometry;
    }

    update() {
        var time = Date.now();

        this.simulate(time);

        const p = this.particles;
        const clothGeometry = this.clothGeometry;

        for (let i = 0, il = p.length; i < il; i++) {
            const v = p[i].position;
            clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);
        }

        clothGeometry.attributes.position.needsUpdate = true;
        clothGeometry.computeVertexNormals();
    }

    simulate(now) {
        const windStrength = Math.cos(now / 7000) * 20 + 40;

        windForce.set(Math.sin(now / 2000), Math.cos(now / 3000), Math.sin(now / 1000));
        windForce.normalize();
        windForce.multiplyScalar(windStrength);

        // Aerodynamics forces

        const particles = this.particles;
        const clothGeometry = this.clothGeometry;

        // if ( params.enableWind ) {

        let indx;
        const normal = new THREE.Vector3();
        const indices = clothGeometry.index;
        const normals = clothGeometry.attributes.normal;

        for (let i = 0, il = indices.count; i < il; i += 3) {

            for (let j = 0; j < 3; j++) {

                indx = indices.getX(i + j);
                normal.fromBufferAttribute(normals, indx);
                tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
                particles[indx].addForce(tmpForce);

            }

        }

        // }

        for (let i = 0, il = particles.length; i < il; i++) {

            const particle = particles[i];
            particle.addForce(gravity);

            particle.integrate(TIMESTEP_SQ);

        }

        // Start Constraints

        const constraints = this.constraints;
        const il = constraints.length;

        for (let i = 0; i < il; i++) {

            const constraint = constraints[i];
            satisfyConstraints(constraint[0], constraint[1], constraint[2]);

        }

        // Floor Constraints

        for (let i = 0, il = particles.length; i < il; i++) {

            const particle = particles[i];
            const pos = particle.position;
            if (pos.y < -250) {

                pos.y = -250;

            }

        }

        // Pin Constraints
        const pins = this.pins;

        for (let i = 0, il = pins.length; i < il; i++) {

            const xy = pins[i];
            const p = particles[xy];
            p.position.copy(p.original);
            p.previous.copy(p.original);

        }
    }
}

export default Cloth;