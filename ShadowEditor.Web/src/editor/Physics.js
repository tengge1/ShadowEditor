/**
 * 物理
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Physics(options) {
    this.app = options.app;
    this.app.physics = this;

    // 各种参数
    this.gravityConstant = -9.8;
    this.rigidBodies = [];
    this.margin = 0.05;
    this.hinge;
    this.transformAux1 = new Ammo.btTransform();

    this.time = 0;
    this.armMovement = 0;

    // 物理环境配置
    this.collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.softBodySolver = new Ammo.btDefaultSoftBodySolver();

    this.world = new Ammo.btSoftRigidDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration, this.softBodySolver);
    this.world.setGravity(new Ammo.btVector3(0, this.gravityConstant, 0));
    this.world.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, this.gravityConstant, 0));

    // 扔球
    this.enableThrowBall = false;
}

Physics.prototype.start = function () {
    this.app.on(`animate.Physics`, this.update.bind(this));
    this.app.on(`mThrowBall.Physics`, this.onEnableThrowBall.bind(this));
};

/**
 * 创建刚体
 * @param {*} threeObject three.js中Object3D对象
 * @param {*} physicsShape 物理形状
 * @param {*} mass 重力
 * @param {*} pos 位置
 * @param {*} quat 旋转
 */
Physics.prototype.createRigidBody = function (threeObject, physicsShape, mass, pos, quat) {
    threeObject.position.copy(pos);
    threeObject.quaternion.copy(quat);

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    var motionState = new Ammo.btDefaultMotionState(transform);

    // 惯性
    var localInertia = new Ammo.btVector3(0, 0, 0);
    physicsShape.calculateLocalInertia(mass, localInertia);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    threeObject.userData.physicsBody = body;

    // 重力大于0才响应物理事件
    if (mass > 0) {
        this.rigidBodies.push(threeObject);
        body.setActivationState(4);
    }

    this.world.addRigidBody(body);

    return body;
};

/**
 * 创建一个平板
 * @param {*} sx 长度
 * @param {*} sy 厚度
 * @param {*} sz 宽度
 * @param {*} mass 重力
 * @param {*} pos 位置
 * @param {*} quat 旋转
 * @param {*} material 材质
 */
Physics.prototype.createParalellepiped = function (sx, sy, sz, mass, pos, quat, material) {
    var threeObject = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);
    var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
    shape.setMargin(this.margin);

    this.createRigidBody(threeObject, shape, mass, pos, quat);

    return threeObject;
};

Physics.prototype.onThrowBall = function (event) {
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    var camera = this.app.editor.camera;

    var width = UI.get('viewport').dom.clientWidth;
    var height = UI.get('viewport').dom.clientHeight;

    mouse.set((event.offsetX / width) * 2 - 1, -(event.offsetY / height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);

    // Creates a ball and throws it
    var ballMass = 35;
    var ballRadius = 0.4;
    var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

    var ball = new THREE.Mesh(new THREE.SphereBufferGeometry(ballRadius, 14, 10), ballMaterial);
    ball.castShadow = true;
    ball.receiveShadow = true;
    this.app.editor.scene.add(ball);

    var ballShape = new Ammo.btSphereShape(ballRadius);
    ballShape.setMargin(this.margin);

    var pos = new THREE.Vector3();
    pos.copy(raycaster.ray.direction);
    pos.add(raycaster.ray.origin);

    var quat = new THREE.Quaternion();
    quat.set(0, 0, 0, 1);

    var ballBody = this.createRigidBody(ball, ballShape, ballMass, pos, quat);

    pos.copy(raycaster.ray.direction);
    pos.multiplyScalar(24);

    ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
};

Physics.prototype.update = function (clock, deltaTime) {
    this.world.stepSimulation(deltaTime, 10);

    // Update rigid bodies
    for (var i = 0, il = this.rigidBodies.length; i < il; i++) {
        var objThree = this.rigidBodies[i];
        var objPhys = objThree.userData.physicsBody;
        var ms = objPhys.getMotionState();
        if (ms) {
            ms.getWorldTransform(this.transformAux1);
            var p = this.transformAux1.getOrigin();
            var q = this.transformAux1.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }
};

Physics.prototype.onEnableThrowBall = function () {
    if (this.enableThrowBall) {
        this.enableThrowBall = false;
        UI.get('mThrowBall').dom.innerHTML = '开启探测小球';
        this.app.on(`click.Physics`, null);
    } else {
        this.enableThrowBall = true;
        UI.get('mThrowBall').dom.innerHTML = '关闭探测小球';
        this.app.on(`click.Physics`, this.onThrowBall.bind(this));
    }
};

export default Physics;