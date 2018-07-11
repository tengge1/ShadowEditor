import BaseSerializer from './BaseSerializer';

/**
 * 序列化
 */
function Serialization() {

}

Serialization.prototype = Object.create(BaseSerializer.prototype);
Serialization.prototype.constructor = Serialization;

Serialization.prototype.toJSON = function (obj) {

};

Serialization.prototype.fromJSON = function (json) {

};

export default Serialization;
