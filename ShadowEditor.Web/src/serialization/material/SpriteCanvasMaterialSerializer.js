import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * SpriteCanvasMaterialSerializer
 */
function SpriteCanvasMaterialSerializer() {
    BaseSerializer.call(this);
}

SpriteCanvasMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
SpriteCanvasMaterialSerializer.prototype.constructor = SpriteCanvasMaterialSerializer;

SpriteCanvasMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

SpriteCanvasMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SpriteCanvasMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default SpriteCanvasMaterialSerializer;