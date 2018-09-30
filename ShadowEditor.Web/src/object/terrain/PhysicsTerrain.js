/**
 * 物理地形
 */
function PhysicsTerrain() {
    // 灰阶高度参数
    var terrainWidthExtents = 100; // 地形宽度范围
    var terrainDepthExtents = 100; // 地形深度范围
    var terrainWidth = 128; // 地形宽度
    var terrainDepth = 128; // 地形深度
    var terrainHalfWidth = terrainWidth / 2;
    var terrainHalfDepth = terrainDepth / 2;
    var terrainMinHeight = -2;
    var terrainMaxHeight = 8;

    // 创建几何体
    var geometry = new THREE.PlaneBufferGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1);
    geometry.rotateX(-Math.PI / 2);

    var vertices = geometry.attributes.position.array;

    var heightData = this.generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);

    for (var i = 0, j = 0, l = vertices.length; i < l; i++ , j += 3) {
        // j + 1 because it is the y component that we modify
        vertices[j + 1] = heightData[i];
    }

    geometry.computeVertexNormals();

    // 创建材质
    var material = new THREE.MeshPhongMaterial({
        color: 0xC7C7C7
    });

    // 创建网格
    THREE.Mesh.call(this, geometry, material);

    this.name = '地形';
    this.castShadow = true;
    this.receiveShadow = true;

    // 下载贴图
    var loader = new THREE.TextureLoader();
    loader.load(`assets/textures/grid.png`, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(terrainWidth - 1, terrainDepth - 1);
        material.map = texture;
        material.needsUpdate = true;
    });

    // 创建地形刚体
    var groundShape = this.createTerrainShape(terrainWidth, terrainDepth, terrainWidthExtents, terrainDepthExtents, heightData, terrainMinHeight, terrainMaxHeight);
    var groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    // 由于子弹将其重新定位在其边界框上，因此会改变地形。
    groundTransform.setOrigin(new Ammo.btVector3(0, (terrainMinHeight + terrainMaxHeight) / 2, 0));

    // 初始化刚体参数
    var groundMass = 0;
    var groundLocalInertia = new Ammo.btVector3(0, 0, 0); // 惯性
    var groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
    var groundBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia));

    this.userData.physicsBody = groundBody;
}

PhysicsTerrain.prototype = Object.create(THREE.Mesh.prototype);
PhysicsTerrain.prototype.constructor = PhysicsTerrain;

/**
 * 生成高程数据（正弦曲线）
 * @param {*} width 
 * @param {*} depth 
 * @param {*} minHeight 
 * @param {*} maxHeight 
 */
PhysicsTerrain.prototype.generateHeight = function (width, depth, minHeight, maxHeight) {
    var size = width * depth;
    var data = new Float32Array(size);
    var hRange = maxHeight - minHeight;
    var w2 = width / 2;
    var d2 = depth / 2;
    var phaseMult = 12;
    var p = 0;
    for (var j = 0; j < depth; j++) {
        for (var i = 0; i < width; i++) {
            var radius = Math.sqrt(Math.pow((i - w2) / w2, 2.0) + Math.pow((j - d2) / d2, 2.0));
            var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
            data[p] = height;
            p++;
        }
    }
    return data;
};

/**
 * 创建物理地形形状
 * @param {*} terrainWidth 
 * @param {*} terrainDepth 
 * @param {*} terrainWidthExtents 
 * @param {*} terrainDepthExtents 
 * @param {*} heightData 
 * @param {*} terrainMinHeight 
 * @param {*} terrainMaxHeight 
 */
PhysicsTerrain.prototype.createTerrainShape = function (terrainWidth, terrainDepth, terrainWidthExtents, terrainDepthExtents, heightData, terrainMinHeight, terrainMaxHeight) {
    // 此参数并未真正使用，因为我们使用的是PHY_FLOAT高度数据类型，因此会被忽略。
    var heightScale = 1;
    // 向上轴 0表示X，1表示Y，2表示Z。通常使用1=Y。
    var upAxis = 1;
    // hdt，高度数据类型。 使用“PHY_FLOAT”。 可能的值为“PHY_FLOAT”，“PHY_UCHAR”，“PHY_SHORT”。
    var hdt = "PHY_FLOAT";
    // 根据您的需要设置（反转三角形）。
    var flipQuadEdges = false;
    // 在Ammo堆中创建高度数据缓冲区。
    var ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainDepth);
    // 将javascript高度数据数组复制到Ammo。
    var p = 0;
    var p2 = 0;
    for (var j = 0; j < terrainDepth; j++) {
        for (var i = 0; i < terrainWidth; i++) {
            // 将32位浮点数写入内存。
            Ammo.HEAPF32[ammoHeightData + p2 >> 2] = heightData[p];
            p++;
            // 4个字节/浮点数
            p2 += 4;
        }
    }
    // 创建高度场物理形状
    var heightFieldShape = new Ammo.btHeightfieldTerrainShape(
        terrainWidth,
        terrainDepth,
        ammoHeightData,
        heightScale,
        terrainMinHeight,
        terrainMaxHeight,
        upAxis,
        hdt,
        flipQuadEdges
    );
    // 设置水平缩放
    var scaleX = terrainWidthExtents / (terrainWidth - 1);
    var scaleZ = terrainDepthExtents / (terrainDepth - 1);
    heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));
    heightFieldShape.setMargin(0.05);
    return heightFieldShape;
};

PhysicsTerrain.prototype.update = function (deltaTime, physicsWorld) {
    physicsWorld.stepSimulation(deltaTime, 10);

    var body = this.userData.physics.body;
    var state = body.getMotionState();

    if (state) {
        var transformAux1 = new Ammo.btTransform();

        state.getWorldTransform(transformAux1);
        var p = transformAux1.getOrigin();
        var q = transformAux1.getRotation();
        this.position.set(p.x(), p.y(), p.z());
        this.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
};

export default PhysicsTerrain;