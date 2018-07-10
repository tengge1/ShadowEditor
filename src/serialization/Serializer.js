import BaseSerialization from './BaseSerialization';

/**
 * 序列化器
 */
function Serializer() {

}

Serializer.prototype = Object.create(BaseSerialization.prototype);
Serializer.prototype.constructor = Serializer;

Serializer.prototype.toJSON = function (obj) {

};

Serializer.prototype.fromJSON = function (json) {

};

export default Serializer;
