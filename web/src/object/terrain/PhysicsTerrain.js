/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 物理地形
 */
function PhysicsTerrain() {
    // 灰阶高度参数
    var terrainWidthExtents = 100; // 地形宽度范围
    var terrainDepthExtents = 100; // 地形深度范围
    var terrainWidth = 128; // 地形宽度
    var terrainDepth = 128; // 地形深度
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

    this.name = _t('Terrain');
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

    // 物理
    var mass = 0;
    var position = this.position;
    var quaternion = this.quaternion;

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
    var state = new Ammo.btDefaultMotionState(transform);

    var shape = this.createTerrainShape(terrainWidth, terrainDepth, terrainWidthExtents, terrainDepthExtents, heightData, terrainMinHeight, terrainMaxHeight);

    var localInertia = new Ammo.btVector3(0, 0, 0);

    var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(mass, state, shape, localInertia));

    this.userData.physicsBody = body;
}

PhysicsTerrain.prototype = Object.create(THREE.Mesh.prototype);
PhysicsTerrain.prototype.constructor = PhysicsTerrain;

/**
 * 生成高程数据（正弦曲线）
 * @param {Number} width 宽度
 * @param {Number} depth 深度
 * @param {Number} minHeight 最小高度
 * @param {Number} maxHeight 最大高度
 * @returns {Float32Array} 高程数据
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
 * @param {Number} terrainWidth 地形宽度
 * @param {Number} terrainDepth 地形深度
 * @param {Number} terrainWidthExtents 地形宽度扩展
 * @param {Number} terrainDepthExtents 地形高度扩展
 * @param {Float32Array} heightData 高程数据
 * @param {Number} terrainMinHeight 地形最小高度
 * @param {Number} terrainMaxHeight 地形最大高度
 * @returns {Ammo.btHeightfieldTerrainShape} 高程地形形状
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
    var dh = (terrainMinHeight + terrainMaxHeight) / 2;
    for (var j = 0; j < terrainDepth; j++) {
        for (var i = 0; i < terrainWidth; i++) {
            // 将32位浮点数写入内存。
            Ammo.HEAPF32[ammoHeightData + p2 >> 2] = heightData[p] + dh;
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