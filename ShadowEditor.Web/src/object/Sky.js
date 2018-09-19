import BaseObject from './BaseObject';

function Sky() {
    BaseObject.call(this);
}

Sky.prototype = Object.create(BaseObject.prototype);
Sky.prototype.constructor = Sky;

export default Sky;