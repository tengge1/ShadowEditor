import PlayerComponent from './PlayerComponent';
import ThrowBallEvent from './physics/ThrowBallEvent';

const shape = {
    btBoxShape: Ammo.btBoxShape, // 正方体
    btBvhTriangleMeshShape: Ammo.btBvhTriangleMeshShape, // 三角形
    btCapsuleShape: Ammo.btCapsuleShape, // 胶囊
    btCapsuleShapeX: Ammo.btCapsuleShapeX, // x轴胶囊
    btCapsuleShapeZ: Ammo.btCapsuleShapeZ, // z轴胶囊
    btCollisionShape: Ammo.btCollisionShape, // 碰撞体
    btCompoundShape: Ammo.btCompoundShape, // 复合形状
    btConcaveShape: Ammo.btConcaveShape, // 
    btConeShape: Ammo.btConeShape, // 圆锥体
    btConeShapeX: Ammo.btConeShapeX, // x轴圆椎体
    btConeShapeZ: Ammo.btConeShapeZ, // z轴圆椎体
    btConvexHullShape: Ammo.btConvexHullShape, // 凸包
    btConvexShape: Ammo.btConvexShape, // 
    btConvexTriangleMeshShape: Ammo.btConvexTriangleMeshShape, // 凸三角形
    btCylinderShape: Ammo.btCylinderShape, // 圆柱体
    btCylinderShapeX: Ammo.btCylinderShapeX, // x轴圆柱体
    btCylinderShapeZ: Ammo.btCylinderShapeZ, // z轴圆柱体
    btHeightfieldTerrainShape: Ammo.btHeightfieldTerrainShape, // 灰阶高程地形
    btSphereShape: Ammo.btSphereShape, // 球体
    btStaticPlaneShape: Ammo.btStaticPlaneShape, // 静态平板
    btTriangleMeshShape: Ammo.btTriangleMeshShape, // 三角网格
};

/**
 * 播放器物理
 * @param {*} app 应用
 */
function PlayerPhysics(app) {
    PlayerComponent.call(this, app);

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
        new ThrowBallEvent(this.app, this.world, this.rigidBodies)
    ];

    // api函数
    Object.assign(app, {
        addPhysicsObject: this.addPhysicsObject.bind(this)
    });
}

PlayerPhysics.prototype = Object.create(PlayerComponent.prototype);
PlayerPhysics.prototype.constructor = PlayerPhysics;

PlayerPhysics.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics && n.userData.physics.enabled) {
            var body = this.createRigidBody(n);
            if (body) {
                n.userData.physics.body = body;
                this.world.addRigidBody(body);

                if (n.userData.physics.mass > 0) {
                    this.rigidBodies.push(n);
                    body.setActivationState(4);
                }
            }
        }
    });

    this.events.forEach(n => {
        n.create(scene, camera, renderer);
    });

    return new Promise(resolve => {
        resolve();
    });
};

PlayerPhysics.prototype.update = function (clock, deltaTime) {
    this.world.stepSimulation(deltaTime, 10);

    // 更新柔软体
    var softBodies = this.softBodies;

    for (var i = 0, il = softBodies.length; i < il; i++) {
        var volume = softBodies[i];

        var geometry = volume.geometry;
        var softBody = volume.userData.physicsBody;

        var volumePositions = geometry.attributes.position.array;
        var volumeNormals = geometry.attributes.normal.array;
        var association = geometry.ammoIndexAssociation;

        var numVerts = association.length;
        var nodes = softBody.get_m_nodes();

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
    };

    // 更新刚体
    var rigidBodies = this.rigidBodies;

    for (var i = 0, l = rigidBodies.length; i < l; i++) {
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
    this.events.forEach(n => {
        n.dispose();
    });

    this.rigidBodies.forEach(n => {
        var body = n.userData.physics.body;
        this.world.removeRigidBody(body);
    });

    this.rigidBodies.length = 0;

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics && n.userData.physics) {
            n.userData.physics.body = null;
        }
    });

    this.scene = null;
};

// ------------------------------------ 创建刚体 ------------------------------------

PlayerPhysics.prototype.createRigidBody = function (obj) {
    var position = obj.position;
    var quaternion = obj.quaternion;
    var scale = obj.scale;

    var physics = obj.userData.physics;
    var shape = physics.shape;
    var mass = physics.mass;
    var inertia = physics.inertia;

    // 形状
    var physicsShape = null;

    if (shape === 'btBoxShape') {
        var geometry = obj.geometry;
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
        var geometry = obj.geometry;
        geometry.computeBoundingSphere();

        var sphere = geometry.boundingSphere;
        physicsShape = new Ammo.btSphereShape(sphere.radius);
    } else {
        console.warn(`PlayerPhysics: 无法创建形状${shape}。`);
        return null;
    }

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

PlayerPhysics.prototype.createSoftVolume = function (bufferGeom, mass, pressure) {
    this.processGeometry(bufferGeom);
    var volume = new THREE.Mesh(bufferGeom, new THREE.MeshPhongMaterial({
        color: 0xFFFFFF
    }));

    volume.castShadow = true;
    volume.receiveShadow = true;
    volume.frustumCulled = false;

    // scene.add(volumn);

    // Volume physic object
    var volumeSoftBody = this.softBodyHelpers.CreateFromTriMesh(
        this.world.getWorldInfo(),
        bufferGeom.ammoVertices,
        bufferGeom.ammoIndices,
        bufferGeom.ammoIndices.length / 3,
        true);

    var sbConfig = volumeSoftBody.get_m_cfg();
    sbConfig.set_viterations(40); // 设置迭代次数
    sbConfig.set_piterations(40);

    // Soft-soft and soft-rigid collisions
    sbConfig.set_collisions(0x11);

    // Friction
    sbConfig.set_kDF(0.1);

    // Damping
    sbConfig.set_kDP(0.01);

    // Pressure
    sbConfig.set_kPR(pressure);

    // Stiffness
    volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9);
    volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9);
    volumeSoftBody.setTotalMass(mass, false);

    Ammo.castObject(volumeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(0.05);

    this.world.addSoftBody(volumeSoftBody, 1, -1);

    volume.userData.physicsBody = volumeSoftBody;

    // Disable deactivation
    volumeSoftBody.setActivationState(4);

    this.softBodies.push(volume);
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

    for (var i = 0; i < numVertices; i++) {
        var p = geometry.vertices[i];
        var i3 = i * 3;
        vertices[i3] = p.x;
        vertices[i3 + 1] = p.y;
        vertices[i3 + 2] = p.z;
    }

    for (var i = 0; i < numFaces; i++) {
        var f = geometry.faces[i];
        var i3 = i * 3;
        indices[i3] = f.a;
        indices[i3 + 1] = f.b;
        indices[i3 + 2] = f.c;
    }

    bufferGeom.setIndex(new THREE.BufferAttribute(indices, 1));
    bufferGeom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

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
 * @param {*} obj 
 */
PlayerPhysics.prototype.addPhysicsObject = function (obj) {
    this.scene.add(obj);
    if (obj.userData && obj.userData.physics && obj.userData.physics.enabled) {
        var body = this.createRigidBody(obj);
        if (body) {
            obj.userData.physics.body = body;
            this.world.addRigidBody(body);

            if (obj.userData.physics.mass > 0) {
                this.rigidBodies.push(obj);
                body.setActivationState(4);
            }
        }
    }
};

export default PlayerPhysics;