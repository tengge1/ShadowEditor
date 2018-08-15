function Physics(options) {
    this.app = options.app;
    this.app.physics = this;

    // Physics configuration
    this.collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.softBodySolver = new Ammo.btDefaultSoftBodySolver();

    this.world = new Ammo.btSoftRigidDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration, this.softBodySolver);
    this.world.setGravity(new Ammo.btVector3(0, this.app.options.gravityConstant, 0));
    this.world.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, this.app.options.gravityConstant, 0));
}

export default Physics;