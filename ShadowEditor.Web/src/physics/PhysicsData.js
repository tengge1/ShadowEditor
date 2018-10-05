/**
 * Object3D.userData.physics表示的物理数据结构
 */
var PhysicsData = {
    // 物理形状
    // btBoxShape: 正方体
    // btBvhTriangleMeshShape: 三角形
    // btCapsuleShape: 胶囊
    // btCapsuleShapeX: x轴胶囊
    // btCapsuleShapeY: y轴胶囊
    // btCapsuleShapeZ: z轴胶囊
    // btCompoundShape: 复合形状
    // btConeShape: 圆锥体
    // btConeShapeX: x轴圆椎体
    // btConeShapeZ: z轴圆椎体
    // btConvexHullShape: 凸包
    // btConvexTriangleMeshShape: 凸三角形
    // btCylinderShape: 圆柱体
    // btCylinderShapeX: x轴圆柱体
    // btCylinderShapeZ: z轴圆柱体
    // btHeightfieldTerrainShape: 灰阶高程地形
    // btSphereShape: 球体
    // btStaticPlaneShape: 静态平板
    shape: 'btBoxShape',

    // 质量
    mass: 1,

    // 惯性
    inertia: {
        x: 0,
        y: 0,
        z: 0,
    }
};

export default PhysicsData;