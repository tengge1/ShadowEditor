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
import OBJLoader from './OBJLoader';
import PLYLoader from './PLYLoader';
import STLLoader from './STLLoader';
import VTKLoader from './VTKLoader';

const Loaders = {
    'amf': AMFLoader,
    'awd': AWDLoader,
    'babylon': BabylonLoader,
    'binary': BinaryLoader,
    'ctm': CTMLoader,
    'dae': ColladaLoader,
    'fbx': FBXLoader,
    'glb': GLTFLoader,
    'gltf': GLTFLoader,
    'kmz': KMZLoader,
    'md2': MD2Loader,
    'obj': OBJLoader,
    'ply': PLYLoader,
    'stl': STLLoader,
    'vtk': VTKLoader
};

/**
 * ModelLoader
 * @param {*} app 
 */
function ModelLoader(app) {
    BaseLoader.call(this, app);
}

ModelLoader.prototype = Object.create(BaseLoader.prototype);
ModelLoader.prototype.constructor = ModelLoader;

ModelLoader.prototype.load = function (url, options) {
    var paths = url.split('.');
    var ext = paths[paths.length - 1].toLowerCase();

    return new Promise(resolve => {
        var loader = Loaders[ext];
        if (loader === undefined) {
            console.warn(`ModelLoader: 不存在加载${ext}后缀模型的加载器。`);
            resolve(null);
            return;
        }
        (new loader(this.app)).load(url, options).then(obj => {
            resolve(obj);
        });
    });
};

export default ModelLoader;