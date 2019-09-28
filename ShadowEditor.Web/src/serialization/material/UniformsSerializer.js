import BaseSerializer from '../BaseSerializer';

import TexturesSerializer from '../texture/TexturesSerializer';

/**
 * UniformsSerializer
 * @author tengge / https://github.com/tengge1
 */
function UniformsSerializer() {
    BaseSerializer.call(this);
}

UniformsSerializer.prototype = Object.create(BaseSerializer.prototype);
UniformsSerializer.prototype.constructor = UniformsSerializer;

UniformsSerializer.prototype.toJSON = function (obj) {

};

UniformsSerializer.prototype.fromJSON = function (json) {

};

export default UniformsSerializer;