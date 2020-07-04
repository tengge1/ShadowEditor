/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseLoader from './BaseLoader';
import AMFLoader from './AMFLoader';
import AWDLoader from './AWDLoader';
import BabylonLoader from './BabylonLoader';
import BinaryLoader from './BinaryLoader';
import ColladaLoader from './ColladaLoader';
import CTMLoader from './CTMLoader';
import FBXLoader from './FBXLoader';
import GLTFLoader from './GLTFLoader';
import KMZLoader from './KMZLoader';
import MD2Loader from './MD2Loader';
import ObjectLoader from './ObjectLoader';
import OBJLoader from './OBJLoader';
import PLYLoader from './PLYLoader';
import STLLoader from './STLLoader';
import VTKLoader from './VTKLoader';
import LOLLoader from './LOLLoader';
import MMDLoader from './MMDLoader';
import JsonLoader from './JsonLoader';
import _3DSLoader from './_3DSLoader';
import _3MFLoader from './_3MFLoader';
import AssimpLoader from './AssimpLoader';
import BVHLoader from './BVHLoader';
import DRACOLoader from './DRACOLoader';
import GCodeLoader from './GCodeLoader';
import NRRDLoader from './NRRDLoader';
import PCDLoader from './PCDLoader';
import PDBLoader from './PDBLoader';
import PRWMLoader from './PRWMLoader';
import SEA3DLoader from './SEA3DLoader';
import VRMLoader from './VRMLoader';
import VRMLLoader from './VRMLLoader';
import XLoader from './XLoader';
import MeshUtils from '../utils/MeshUtils';

const Loaders = {
    '_3ds': _3DSLoader,
    '_3mf': _3MFLoader,
    'amf': AMFLoader,
    'assimp': AssimpLoader,
    'awd': AWDLoader,
    'babylon': BabylonLoader,
    'binary': BinaryLoader,
    'bvh': BVHLoader,
    'ctm': CTMLoader,
    'dae': ColladaLoader,
    'fbx': FBXLoader,
    'glb': GLTFLoader,
    'gltf': GLTFLoader,
    'kmz': KMZLoader,
    'md2': MD2Loader,
    'json': ObjectLoader,
    'obj': OBJLoader,
    'ply': PLYLoader,
    'stl': STLLoader,
    'vtk': VTKLoader,
    'lol': LOLLoader,
    'pmd': MMDLoader,
    'pmx': MMDLoader,
    'js': JsonLoader,
    'drc': DRACOLoader,
    'gcode': GCodeLoader,
    'nrrd': NRRDLoader,
    'pcd': PCDLoader,
    'pdb': PDBLoader,
    'prwm': PRWMLoader,
    'sea3d': SEA3DLoader,
    'vrm': VRMLoader,
    'vrml': VRMLLoader,
    'x': XLoader
};

/**
 * ModelLoader
 * @author tengge / https://github.com/tengge1
 */
function ModelLoader() {
    BaseLoader.call(this);
}

ModelLoader.prototype = Object.create(BaseLoader.prototype);
ModelLoader.prototype.constructor = ModelLoader;

ModelLoader.prototype.load = function (url, options = {}, environment = {}) {
    var type = options.Type;

    if (type === undefined) {
        console.warn(`ModelLoader: no type parameters, and cannot load.`);
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        var loader = Loaders[type];
        if (loader === undefined) {
            console.warn(`ModelLoader: no ${type} loader.`);
            resolve(null);
            return;
        }
        new loader(app).load(url, options, environment).then(obj => {
            if (!obj || !obj.userData) {
                resolve(null);
                return;
            }

            // bug: 由于模型可能自带错误的_children数据，导致载入场景模型显示不全。
            // 所以，向场景添加模型时，清除掉_children属性。
            if (environment.clearChildren) {
                delete obj.userData._children;
            }

            // 由于每次加载模型，uuid会变，所以要记录原始模型的uuid，而且只能记录一次。
            if (obj.children && !obj.userData._children) {
                obj.userData._children = []; // 原始模型的uuid层次
                MeshUtils.traverseUUID(obj.children, obj.userData._children); // 记录最原始的模型，每个组件的uuid。
            }

            obj.userData.physics = obj.userData.physics || {
                enabled: false,
                type: 'rigidBody',
                shape: 'btBoxShape',
                mass: 1,
                inertia: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            };
            resolve(obj);
        });
    });
};

export default ModelLoader;