import PlayerComponent from '../PlayerComponent';

/**
 * 按z键扔球事件
 * @param {*} app 
 */
function ThrowBallEvent(app) {
    PlayerComponent.call(this, app);
}

ThrowBallEvent.prototype = Object.create(PlayerComponent.prototype);
ThrowBallEvent.prototype.constructor = ThrowBallEvent;

ThrowBallEvent.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.renderer.domElement.addEventListener('keydown', this.throwBall.bind(this));
};

ThrowBallEvent.prototype.update = function (clock, deltaTime) {

};

ThrowBallEvent.prototype.dispose = function () {
    this.renderer.domElement.removeEventListener('keydown', this.throwBall);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
};

ThrowBallEvent.prototype.throwBall = function (event) {
    debugger
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
    var ballMaterial = new THREE.MeshPhongMaterial({
        color: 0x202020
    });

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

ThrowBallEvent.prototype.createRigidBody = function (threeObject, physicsShape, mass, pos, quat) {
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

export default ThrowBallEvent;