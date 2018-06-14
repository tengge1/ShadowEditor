/**
 * 场景转JSON对象
 * @param {*} scene 场景
 */
function toJSON(scene) {
    var list = [];
    var _this = this;
    scene.traverse(function (item) {
        list.push(obj3dToJson(item));
    });
    console.log(list);
    return list;
};

/**
 * 将场景中的对象转换为Json
 * @param {*} item 
 */
function obj3dToJson(item) {
    var obj = {
        type: item.type,
        uuid: item.uuid,
        castShadow: item.castShadow,
        children: item.children.map(function (child) {
            return child.id;
        }),
        frustumCulled: item.frustumCulled,
        matrix: item.matrix,
        matrixAutoUpdate: item.matrixAutoUpdate,
        name: item.name,
        parent: item.parent == null ? null : item.parent.uuid,
        position: item.position,
        quaternion: item.quaternion,
        receiveShadow: item.receiveShadow,
        renderOrder: item.renderOrder,
        rotation: item.rotation,
        scale: item.scale,
        up: item.up,
        userData: item.userData
    };
    if (item instanceof THREE.Scene) { // 场景
        obj.background = item.background;
        obj.fog = item.fog;
        obj.overrideMaterial = item.overrideMaterial;
    } else if (item instanceof THREE.Mesh) { // 网格
        obj.drawMode = item.drawMode;
        obj.geometry = geometryToJson(item.geometry);
        obj.material = materialToJson(item.material);
    } else if (item instanceof THREE.Light) { // 光源
        obj.color = item.color;
        obj.intensity = item.intensity;
        if (item instanceof THREE.HemisphereLight) {
            obj.skyColor = item.skyColor;
            obj.groundColor = item.groundColor;
        } else if (item instanceof THREE.PointLight) {
            obj.distance = item.distance;
            obj.decay = item.decay;
        } else if (item instanceof THREE.RectAreaLight) {
            obj.width = item.width;
            oboj.height = item.height;
        } else if (item instanceof THREE.SpotLight) {
            obj.distance = item.distance;
            obj.angle = item.angle;
            obj.penumbra = item.penumbra;
            obj.decay = item.decay;
        }
    }
    return obj;
};

function geometryToJson(geometry) {

}

function materialToJson(material) {
    var obj = {
        alphaMap: material.alphaMap,
        alphaTest: material.alphaTest,
        aoMap: material.aoMap,
        aoMapIntensity: material.aoMapIntensity,
        blendDst: material.blendDst,
        blendDstAlpha: material.blendDstAlpha,
        blendEquation: material.blendEquation,
        blendEquationAlpha: material.blendEquationAlpha,
        blendSrc: material.blendSrc,
        blendSrcAlpha: material.blendSrcAlpha,
        blending: material.blending,
        bumpMap: material.bumpMap,
        bumpScale: material.bumpScale,
        clipIntersection: material.clipIntersection,
        clipShadow: material.clipShadow,
        clippingPlanes: material.clippingPlanes,
        color: material.color,
        colorWrite: material.colorWrite,
        depthFunc: material.depthFunc,
        depthTest: material.depthTest,
        depthWrite: material.depthWrite,
        displacementBias: material.displacementBias,
        displacementMap: material.displacementMap,
        displacementScale: material.displacementScale,
        dithering: material.dithering,
        emissive: material.emissive,
        emissiveIntensity: material.emissiveIntensity,
        emissiveMap: material.emissiveMap
    };
    return obj;
}

/**
 * JSON对象转场景
 * @param {*} obj JSON对象
 */
function fromJSON(obj) {

}

/**
 * 场景工具
 */
const SceneUtils = {
    toJSON: toJSON,
    fromJSON: fromJSON
};

export default SceneUtils;