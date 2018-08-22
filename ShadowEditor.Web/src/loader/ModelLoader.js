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

ModelLoader.prototype.load = function (url) {
    return new Promise(resolve => {

    });
};

export default ModelLoader;