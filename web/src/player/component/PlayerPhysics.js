/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from './PlayerComponent';
import ThrowBallEvent from './physics/ThrowBallEvent';

/**
 * 播放器物理
 * @param {*} app 播放器
 */
function PlayerPhysics(app) {
    PlayerComponent.call(this, app);
}

PlayerPhysics.prototype = Object.create(PlayerComponent.prototype);
PlayerPhysics.prototype.constructor = PlayerPhysics;

PlayerPhysics.prototype.create = function (scene, camera, renderer) {
    if (!this.app.options.enablePhysics) {
        return;
    }

    var usePhysics = false;

    this.scene = scene;

    this.scene.traverse(n => {
        if (n.userData &&
            n.userData.physics &&
            n.userData.physics.enabled
        ) {
            usePhysics = true;
        }
    });

    // 未使用物理
    if (!usePhysics) {
        return new Promise(resolve => {
            resolve();
        });
    }

    this.initPhysicsWorld();
    this.initScene(scene, camera, renderer);
};

PlayerPhysics.prototype.initPhysicsWorld = function () {
    // 各种参数
    var gravityConstant = -9.8; // 重力常数
    this.margin = 0.05; // 两个物体之间最小间距

    // 物理环境配置
    var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration(); // 软体刚体碰撞配置
    var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration); // 碰撞调度器
    var broadphase = new Ammo.btDbvtBroadphase(); // dbvt粗测
    var solver = new Ammo.btSequentialImpulseConstraintSolver(); // 顺序脉冲约束求解器
    var softBodySolver = new Ammo.btDefaultSoftBodySolver(); // 默认软体求解器

    this.world = new Ammo.btSoftRigidDynamicsWorld(
        dispatcher,
        broadphase,
        solver,
        collisionConfiguration,
        softBodySolver
    );

    var gravity = new Ammo.btVector3(0, gravityConstant, 0);
    this.world.setGravity(gravity);
    this.world.getWorldInfo().set_m_gravity(gravity);

    this.transformAux1 = new Ammo.btTransform();
    this.rigidBodies = [];
    this.softBodies = [];

    this.softBodyHelpers = new Ammo.btSoftBodyHelpers();

    this.events = [
        new ThrowBallEvent(app, this.world, this.rigidBodies)
    ];

    // api函数
    // TODO: 很难受的实现
    Object.assign(this.app, {
        addPhysicsObject: this.addPhysicsObject.bind(this)
    });
};

PlayerPhysics.prototype.initScene = function (scene, camera, renderer) {
    let body;
    this.scene.traverse(n => {
        if (n.userData &&
            n.userData.physics &&
            n.userData.physics.enabled
        ) {
            if (n.userData.physics.type === 'rigidBody') {
                body = this.createRigidBody(n);
                if (body) {
                    n.userData.physics.body = body;
                    this.world.addRigidBody(body);

                    if (n.userData.physics.mass > 0) {
                        this.rigidBodies.push(n);
                        body.setActivationState(4);
                    }
                }
            } else if (n.userData.physics.type === 'softVolume') {
                body = this.createSoftVolume(n);
                if (body) {
                    n.userData.physics.body = body;
                    this.world.addSoftBody(body, 1, -1);

                    this.softBodies.push(n);

                    if (n.userData.physics.mass > 0) {
                        body.setActivationState(4);
                    }
                }
            } else {
                console.warn(`PlayerPhysics: unknown physics type ${n.userData.physics.type}.`);
            }
        }
    });

    this.events.forEach(n => {
        n.create(scene, camera, renderer);
    });
};

PlayerPhysics.prototype.update = function (clock, deltaTime) {
    if (!this.app.options.enablePhysics || !this.world) {
        return;
    }

    this.world.stepSimulation(deltaTime, 10);

    // 更新柔软体
    var softBodies = this.softBodies;
    let i, il;

    for (i = 0, il = softBodies.length; i < il; i++) {
        var volume = softBodies[i];

        var geometry = volume.geometry;
        var body = volume.userData.physics.body;

        var volumePositions = geometry.attributes.position.array;
        var volumeNormals = geometry.attributes.normal.array;
        var association = geometry.ammoIndexAssociation;

        var numVerts = association.length;
        var nodes = body.get_m_nodes();

        for (var j = 0; j < numVerts; j++) {
            var node = nodes.at(j);
            var nodePos = node.get_m_x();
            var x = nodePos.x();
            var y = nodePos.y();
            var z = nodePos.z();
            var nodeNormal = node.get_m_n();
            var nx = nodeNormal.x();
            var ny = nodeNormal.y();
            var nz = nodeNormal.z();
            var assocVertex = association[j];

            for (var k = 0, kl = assocVertex.length; k < kl; k++) {
                var indexVertex = assocVertex[k];
                volumePositions[indexVertex] = x;
                volumeNormals[indexVertex] = nx;
                indexVertex++;
                volumePositions[indexVertex] = y;
                volumeNormals[indexVertex] = ny;
                indexVertex++;
                volumePositions[indexVertex] = z;
                volumeNormals[indexVertex] = nz;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
    }

    // 更新刚体
    var rigidBodies = this.rigidBodies;

    for (i = 0, il = rigidBodies.length; i < il; i++) {
        var objThree = rigidBodies[i];
        var objPhys = objThree.userData.physics.body;
        if (!objPhys) {
            continue;
        }
        var ms = objPhys.getMotionState();
        if (ms) {
            ms.getWorldTransform(this.transformAux1);

            var p = this.transformAux1.getOrigin();
            var q = this.transformAux1.getRotation();

            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }

    this.events.forEach(n => {
        n.update(clock, deltaTime);
    });
};

PlayerPhysics.prototype.dispose = function () {
    if (!this.app.options.enablePhysics) {
        return;
    }
    this.events && this.events.forEach(n => {
        n.dispose();
    });

    if (this.rigidBodies) {
        this.rigidBodies.forEach(n => {
            var body = n.userData.physics.body;
            this.world.removeRigidBody(body);
        });

        this.rigidBodies.length = 0;
    }

    if (this.softBodies) {
        this.softBodies.forEach(n => {
            var body = n.userData.physics.body;
            this.world.removeRigidBody(body);
        });

        this.softBodies.length = 0;
    }

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics) {
            n.userData.physics.body = null;
        }
    });

    this.scene = null;
};

// ------------------------------------ 创建刚体 ------------------------------------

PlayerPhysics.prototype.createRigidBody = function (obj) {
    var position = obj.position;
    var quaternion = obj.quaternion;

    var physics = obj.userData.physics;
    var shape = physics.shape;
    var mass = physics.mass;
    var inertia = physics.inertia;

    // 形状
    var physicsShape = null;
    var geometry = null;

    if (shape === 'btBoxShape') {
        geometry = obj.geometry;
        geometry.computeBoundingBox();

        var box = geometry.boundingBox;

        var x = box.max.x - box.min.x;
        var y = box.max.y - box.min.y;
        var z = box.max.z - box.min.z;

        var center = new THREE.Vector3();
        box.getCenter(center);

        position = position.clone();
        position.add(center);

        physicsShape = new Ammo.btBoxShape(new Ammo.btVector3(x * 0.5, y * 0.5, z * 0.5));
    } else if (shape === 'btSphereShape') {
        geometry = obj.geometry;
        geometry.computeBoundingSphere();

        var sphere = geometry.boundingSphere;
        physicsShape = new Ammo.btSphereShape(sphere.radius);
    } else {
        console.warn(`PlayerPhysics: cannot create shape ${shape}.`);
        return null;
    }

    physicsShape.setMargin(0.05);

    // 位移
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

    var defaultState = new Ammo.btDefaultMotionState(transform);

    var localInertia = new Ammo.btVector3(inertia.x, inertia.y, inertia.z);
    physicsShape.calculateLocalInertia(mass, localInertia);

    var info = new Ammo.btRigidBodyConstructionInfo(mass, defaultState, physicsShape, localInertia);
    return new Ammo.btRigidBody(info);
};

// --------------------------------- 创建柔软体 ---------------------------------------------

PlayerPhysics.prototype.createSoftVolume = function (obj) {
    var geometry = obj.geometry;
    var mass = obj.userData.physics.mass;
    var pressure = obj.userData.physics.pressure;

    this.processGeometry(geometry);
    var volume = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        color: 0xFFFFFF
    }));

    volume.castShadow = true;
    volume.receiveShadow = true;
    volume.frustumCulled = false;

    // Volume physic object
    var body = this.softBodyHelpers.CreateFromTriMesh(
        this.world.getWorldInfo(),
        geometry.ammoVertices,
        geometry.ammoIndices,
        geometry.ammoIndices.length / 3,
        true);

    var sbConfig = body.get_m_cfg();
    sbConfig.set_viterations(40); // 设置迭代次数
    sbConfig.set_piterations(40);

    // Soft-soft and soft-rigid碰撞
    sbConfig.set_collisions(0x11);

    // 摩擦力(Friction)
    sbConfig.set_kDF(0.1);

    // 减震(Damping)
    sbConfig.set_kDP(0.01);

    // 压力(Pressure)
    sbConfig.set_kPR(pressure);

    // 刚性(Stiffness)
    body.get_m_materials().at(0).set_m_kLST(0.9);
    body.get_m_materials().at(0).set_m_kAST(0.9);
    body.setTotalMass(mass, false);

    Ammo.castObject(body, Ammo.btCollisionObject).getCollisionShape().setMargin(0.05);

    return body;
};

PlayerPhysics.prototype.processGeometry = function (bufGeometry) {
    // Obtain a Geometry
    var geometry = new THREE.Geometry().fromBufferGeometry(bufGeometry);
    // Merge the vertices so the triangle soup is converted to indexed triangles
    geometry.mergeVertices();
    // Convert again to BufferGeometry, indexed
    var indexedBufferGeom = this.createIndexedBufferGeometryFromGeometry(geometry);
    // Create index arrays mapping the indexed vertices to bufGeometry vertices
    this.mapIndices(bufGeometry, indexedBufferGeom);
};

PlayerPhysics.prototype.createIndexedBufferGeometryFromGeometry = function (geometry) {
    var numVertices = geometry.vertices.length;
    var numFaces = geometry.faces.length;
    var bufferGeom = new THREE.BufferGeometry();
    var vertices = new Float32Array(numVertices * 3);
    var indices = new (numFaces * 3 > 65535 ? Uint32Array : Uint16Array)(numFaces * 3);

    let i, i3;

    for (i = 0; i < numVertices; i++) {
        var p = geometry.vertices[i];
        i3 = i * 3;
        vertices[i3] = p.x;
        vertices[i3 + 1] = p.y;
        vertices[i3 + 2] = p.z;
    }

    for (i = 0; i < numFaces; i++) {
        var f = geometry.faces[i];
        i3 = i * 3;
        indices[i3] = f.a;
        indices[i3 + 1] = f.b;
        indices[i3 + 2] = f.c;
    }

    bufferGeom.setIndex(new THREE.BufferAttribute(indices, 1));
    bufferGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    return bufferGeom;
};

PlayerPhysics.prototype.mapIndices = function (bufGeometry, indexedBufferGeom) {
    // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry
    var vertices = bufGeometry.attributes.position.array;
    var idxVertices = indexedBufferGeom.attributes.position.array;
    var indices = indexedBufferGeom.index.array;
    var numIdxVertices = idxVertices.length / 3;
    var numVertices = vertices.length / 3;

    bufGeometry.ammoVertices = idxVertices;
    bufGeometry.ammoIndices = indices;
    bufGeometry.ammoIndexAssociation = [];

    for (var i = 0; i < numIdxVertices; i++) {
        var association = [];
        bufGeometry.ammoIndexAssociation.push(association);
        var i3 = i * 3;
        for (var j = 0; j < numVertices; j++) {
            var j3 = j * 3;
            if (this.isEqual(idxVertices[i3], idxVertices[i3 + 1], idxVertices[i3 + 2],
                vertices[j3], vertices[j3 + 1], vertices[j3 + 2])) {
                association.push(j3);
            }
        }
    }
};

PlayerPhysics.prototype.isEqual = function (x1, y1, z1, x2, y2, z2) {
    var delta = 0.000001;
    return Math.abs(x2 - x1) < delta &&
        Math.abs(y2 - y1) < delta &&
        Math.abs(z2 - z1) < delta;
};

// --------------------------------- API函数 ------------------------------------------------

/**
 * 添加一个物理物体
 * @param {*} obj 物体
 */
PlayerPhysics.prototype.addPhysicsObject = function (obj) {
    this.scene.add(obj);
    let body = null;

    if (obj.userData && obj.userData.physics && obj.userData.physics.enabled) {
        if (obj.userData.physics.type === 'rigidBody') {
            body = this.createRigidBody(obj);
            if (body) {
                obj.userData.physics.body = body;
                this.world.addRigidBody(body);

                if (obj.userData.physics.mass > 0) {
                    this.rigidBodies.push(obj);
                    body.setActivationState(4);
                }
            }
        } else if (obj.userData.physics.type === 'softVolume') {
            body = this.createSoftVolume(obj);
            if (body) {
                obj.userData.physics.body = body;
                this.world.addSoftBody(body);
                this.softBodies.push(obj);
            }
        }
    }
};

export default PlayerPhysics;