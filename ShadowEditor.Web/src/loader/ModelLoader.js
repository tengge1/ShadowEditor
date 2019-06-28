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
    'x': XLoader,
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
        (new loader(app)).load(url, options, environment).then(obj => {
            obj.userData.physics = obj.userData.physics || {
                enabled: false,
                type: 'rigidBody',
                shape: 'btBoxShape',
                mass: 1,
                inertia: {
                    x: 0,
                    y: 0,
                    z: 0,
                }
            };
            resolve(obj);
        });
    });
};

export default ModelLoader;