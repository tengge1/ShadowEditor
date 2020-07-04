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

function Particle(x, y, z, mass) {
    this.position = clothFunction(x, y); // position
    this.previous = clothFunction(x, y); // previous
    this.original = clothFunction(x, y);
    this.a = new THREE.Vector3(0, 0, 0); // acceleration
    this.mass = mass;
    this.invMass = 1 / mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();
}

// Force -> Acceleration
Particle.prototype.addForce = function (force) {
    this.a.add(
        this.tmp2.copy(force).multiplyScalar(this.invMass)
    );
};

// Performs Verlet integration
Particle.prototype.integrate = function (timesq) {
    var newPos = this.tmp.subVectors(this.position, this.previous);
    newPos.multiplyScalar(DRAG).add(this.position);
    newPos.add(this.a.multiplyScalar(timesq));

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;

    this.a.set(0, 0, 0);
};

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
function Cloth() {
    var pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    var w = xSegs;
    var h = ySegs;
    this.w = w;
    this.h = h;

    var particles = [];
    var constraints = [];

    var u, v;

    // Create particles
    for (v = 0; v <= h; v++) {
        for (u = 0; u <= w; u++) {
            particles.push(
                new Particle(u / w, v / h, 0, MASS)
            );
        }
    }

    // Structural
    for (v = 0; v < h; v++) {
        for (u = 0; u < w; u++) {
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

    for (u = w, v = 0; v < h; v++) {
        constraints.push([
            particles[index(u, v)],
            particles[index(u, v + 1)],
            restDistance
        ]);
    }

    for (v = h, u = 0; u < w; u++) {
        constraints.push([
            particles[index(u, v)],
            particles[index(u + 1, v)],
            restDistance
        ]);
    }

    this.particles = particles;
    this.constraints = constraints;

    function index(u, v) {
        return u + v * (w + 1);
    }

    this.index = index;

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

    THREE.Mesh.call(this, clothGeometry, clothMaterial);

    this.scale.multiplyScalar(0.02);

    this.castShadow = true;

    Object.assign(this.userData, {
        type: 'Cloth'
    });

    this.pins = pins;
    this.clothGeometry = clothGeometry;
}

Cloth.prototype = Object.create(THREE.Mesh.prototype);
Cloth.prototype.constructor = Cloth;

Cloth.prototype.update = function () {
    var time = Date.now();

    var windStrength = Math.cos(time / 7000) * 20 + 40;

    windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000));
    windForce.normalize();
    windForce.multiplyScalar(windStrength);

    this.simulate(time, this.clothGeometry, this.pins);

    var p = this.particles;
    var clothGeometry = this.clothGeometry;

    for (var i = 0, il = p.length; i < il; i++) {
        clothGeometry.vertices[i].copy(p[i].position);
    }

    clothGeometry.verticesNeedUpdate = true;

    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();
};

Cloth.prototype.simulate = function (time) {
    if (!lastTime) {
        lastTime = time;
        return;
    }

    var i, il, particles, particle, constraints, constraint;

    // Aerodynamics forces
    if (wind) {
        var face, faces = this.clothGeometry.faces,
            normal;
        particles = this.particles;

        for (i = 0, il = faces.length; i < il; i++) {
            face = faces[i];
            normal = face.normal;

            tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
            particles[face.a].addForce(tmpForce);
            particles[face.b].addForce(tmpForce);
            particles[face.c].addForce(tmpForce);
        }
    }

    for (particles = this.particles, i = 0, il = particles.length; i < il; i++) {
        particle = particles[i];
        particle.addForce(gravity);

        particle.integrate(TIMESTEP_SQ);
    }

    // Start Constraints
    constraints = this.constraints;
    il = constraints.length;

    for (i = 0; i < il; i++) {
        constraint = constraints[i];
        satisfyConstraints(constraint[0], constraint[1], constraint[2]);
    }

    // Floor Constraints
    for (particles = this.particles, i = 0, il = particles.length; i < il; i++) {
        particle = particles[i];
        var pos = particle.position;
        if (pos.y < -250) {
            pos.y = -250;
        }
    }

    // Pin Constraints
    var pins = this.pins;

    for (i = 0, il = pins.length; i < il; i++) {
        var xy = pins[i];
        var p = particles[xy];
        p.position.copy(p.original);
        p.previous.copy(p.original);
    }
};

export default Cloth;