/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from './BaseEvent';

/**
 * 物理事件
 */
function PhysicsEngine() {
    BaseEvent.call(this);

    this.enabled = false;
    this.init = false;

    this.rigidBodies = [];
    this.softBodies = [];

    this.onOptionChange = this.onOptionChange.bind(this);
    this.updatePhysicsWorld = this.updatePhysicsWorld.bind(this);
}

PhysicsEngine.prototype = Object.create(BaseEvent.prototype);
PhysicsEngine.prototype.constructor = PhysicsEngine;

PhysicsEngine.prototype.start = function () {
    app.on(`optionChange.${this.id}`, this.onOptionChange);
    app.on(`afterRender.${this.id}`, this.updatePhysicsWorld);
};

PhysicsEngine.prototype.stop = function () {
    app.on(`optionChange.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
};

PhysicsEngine.prototype.onOptionChange = function (name, value) {
    if (name !== 'enablePhysics') {
        return;
    }
    if (value) {
        this.enablePhysics();
    } else {
        this.disablePhysics();
    }
};

PhysicsEngine.prototype.enablePhysics = function () {
    this.enabled = true;

    if (!this.init) {
        this.init = true;
        this.initPhysicsWorld();

        this.clock = new THREE.Clock(false);
    }

    this.createScene();
    this.clock.start();
};

PhysicsEngine.prototype.disablePhysics = function () {
    this.enabled = false;

    if (!this.world) {
        return;
    }

    this.clock.stop();

    this.rigidBodies.forEach(n => {
        this.world.removeRigidBody(n._physicsBody);
    });

    this.rigidBodies.length = 0;

    app.editor.scene.traverse(n => {
        if (n._physicsBody) {
            n._physicsBody = null;
        }
    });

    this.scene = null;
};

PhysicsEngine.prototype.initPhysicsWorld = function () {
    // 各种参数
    let gravityConstant = -9.8; // 重力常数
    this.margin = 0.05; // 两个物体之间最小间距

    // 物理环境配置
    let collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration(); // 软体刚体碰撞配置
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration); // 碰撞调度器
    let broadphase = new Ammo.btDbvtBroadphase(); // dbvt粗测
    let solver = new Ammo.btSequentialImpulseConstraintSolver(); // 顺序脉冲约束求解器
    let softBodySolver = new Ammo.btDefaultSoftBodySolver(); // 默认软体求解器

    this.world = new Ammo.btSoftRigidDynamicsWorld(
        dispatcher,
        broadphase,
        solver,
        collisionConfiguration,
        softBodySolver
    );

    let gravity = new Ammo.btVector3(0, gravityConstant, 0);

    this.world.setGravity(gravity);
    this.world.getWorldInfo().set_m_gravity(gravity);

    this.transformAux1 = new Ammo.btTransform();
};

PhysicsEngine.prototype.createScene = function () {
    app.editor.scene.traverse(n => {
        if (!n.userData.physics || !n.userData.physics.enabled) {
            return;
        }

        if (n.userData.physics.type !== 'rigidBody') { // 仅对刚体提供支持
            console.warn(`PhysicsEngine: unknown physics type ${n.userData.physics.type}.`);
            return;
        }

        let body = this.createRigidBody(n);
        n._physicsBody = body;

        this.world.addRigidBody(body);

        if (n.userData.physics.mass > 0) {
            this.rigidBodies.push(n);
            body.setActivationState(4);
        }
    });
};

PhysicsEngine.prototype.updatePhysicsWorld = function () {
    if (!this.enabled) {
        return;
    }

    let deltaTime = this.clock.getDelta();

    this.world.stepSimulation(deltaTime, 10);

    for (let i = 0, l = this.rigidBodies.length; i < l; i++) {
        let obj = this.rigidBodies[i];
        if (!obj._physicsBody) {
            continue;
        }
        let state = obj._physicsBody.getMotionState();
        if (state) {
            state.getWorldTransform(this.transformAux1);

            let p = this.transformAux1.getOrigin();
            let q = this.transformAux1.getRotation();

            obj.position.set(p.x(), p.y(), p.z());
            obj.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }
};

PhysicsEngine.prototype.createRigidBody = function (obj) {
    let position = obj.position;
    let quaternion = obj.quaternion;
    // let scale = obj.scale;

    let physics = obj.userData.physics;
    let shape = physics.shape;
    let mass = physics.mass;
    let inertia = physics.inertia;

    // 形状
    let geometry = null;
    let physicsShape = null;

    if (shape === 'btBoxShape') {
        geometry = obj.geometry;
        geometry.computeBoundingBox();

        let box = geometry.boundingBox;

        let x = box.max.x - box.min.x;
        let y = box.max.y - box.min.y;
        let z = box.max.z - box.min.z;

        let center = new THREE.Vector3();
        box.getCenter(center);

        position = position.clone();
        position.add(center);

        physicsShape = new Ammo.btBoxShape(new Ammo.btVector3(x * 0.5, y * 0.5, z * 0.5));
    } else if (shape === 'btSphereShape') {
        geometry = obj.geometry;
        geometry.computeBoundingSphere();

        let sphere = geometry.boundingSphere;
        physicsShape = new Ammo.btSphereShape(sphere.radius);
    } else {
        console.warn(`PlayerPhysics: cannot create shape ${shape}.`);
        return null;
    }

    physicsShape.setMargin(0.05);

    // 位移
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

    let defaultState = new Ammo.btDefaultMotionState(transform);

    let localInertia = new Ammo.btVector3(inertia.x, inertia.y, inertia.z);
    physicsShape.calculateLocalInertia(mass, localInertia);

    let info = new Ammo.btRigidBodyConstructionInfo(mass, defaultState, physicsShape, localInertia);
    return new Ammo.btRigidBody(info);
};

export default PhysicsEngine;