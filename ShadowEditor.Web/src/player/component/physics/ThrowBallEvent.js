import PlayerComponent from '../PlayerComponent';

/**
 * 按z键扔球事件
 * @param {*} app 
 * @param {*} world 
 * @param {*} rigidBodies 
 */
function ThrowBallEvent(app, world, rigidBodies) {
    PlayerComponent.call(this, app);

    this.world = world;
    this.rigidBodies = rigidBodies;

    this.enabled = false;
}

ThrowBallEvent.prototype = Object.create(PlayerComponent.prototype);
ThrowBallEvent.prototype.constructor = ThrowBallEvent;

ThrowBallEvent.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.enabled = UI.get('cbThrowBall').getValue();

    this.app.on(`click.${this.id}`, this.throwBall.bind(this));
    this.app.on(`enableThrowBall.${this.id}`, this.onEnableThrowBall.bind(this));
};

ThrowBallEvent.prototype.dispose = function () {
    this.app.on(`click.${this.id}`, null);
    this.app.on(`enableThrowBall.${this.id}`, null);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
};

ThrowBallEvent.prototype.onEnableThrowBall = function (enabled) {
    this.enabled = enabled;
};

ThrowBallEvent.prototype.throwBall = function (event) {
    if (!this.enabled) {
        return;
    }

    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    var camera = this.camera;

    var width = this.renderer.domElement.width;
    var height = this.renderer.domElement.height;

    mouse.set((event.offsetX / width) * 2 - 1, -(event.offsetY / height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);

    // Creates a ball and throws it
    var ballMass = 3;
    var ballRadius = 0.4;
    var ballMaterial = new THREE.MeshPhongMaterial({
        color: 0x202020
    });

    var ball = new THREE.Mesh(new THREE.SphereBufferGeometry(ballRadius, 14, 10), ballMaterial);
    ball.castShadow = true;
    ball.receiveShadow = true;
    this.scene.add(ball);

    var ballShape = new Ammo.btSphereShape(ballRadius);

    var pos = new THREE.Vector3();
    pos.copy(raycaster.ray.direction);
    pos.add(raycaster.ray.origin);

    var quat = new THREE.Quaternion();
    quat.set(0, 0, 0, 1);

    var body = this.createRigidBody(ball, ballShape, ballMass, pos, quat);

    pos.copy(raycaster.ray.direction);
    pos.multiplyScalar(20);

    body.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
    body.setFriction(0.5);

    ball.userData.physics = {
        body: body
    };

    this.world.addRigidBody(body);
    this.rigidBodies.push(ball);
};

ThrowBallEvent.prototype.createRigidBody = function (threeObject, physicsShape, mass, pos, quat) {
    threeObject.position.copy(pos);
    threeObject.quaternion.copy(quat);

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    var motionState = new Ammo.btDefaultMotionState(transform);

    var localInertia = new Ammo.btVector3(0, 0, 0);
    physicsShape.calculateLocalInertia(mass, localInertia);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    if (mass > 0) {
        body.setActivationState(4);
    }

    return body;
};

export default ThrowBallEvent;