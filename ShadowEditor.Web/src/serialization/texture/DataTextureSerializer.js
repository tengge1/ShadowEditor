import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * DataTextureSerializer
 */
function DataTextureSerializer() {
    BaseSerializer.call(this);
}

DataTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
DataTextureSerializer.prototype.constructor = DataTextureSerializer;

DataTextureSerializer.prototype.toJSON = function (obj) {
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

DataTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.DataTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default DataTextureSerializer;