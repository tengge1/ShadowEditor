import BaseSerializer from '../BaseSerializer';

/**
 * AnimationSerializer
 * @author tengge / https://github.com/tengge1
 */
function AnimationSerializer() {
    BaseSerializer.call(this);
}

AnimationSerializer.prototype = Object.create(BaseSerializer.prototype);
AnimationSerializer.prototype.constructor = AnimationSerializer;

AnimationSerializer.prototype.toJSON = function (manager) {
    var list = [];

    var groups = manager.animations;

    groups.forEach(n => {
        var json = BaseSerializer.prototype.toJSON.call(this, n);

        Object.assign(json, n);
        json.animations = n.animations.map(m => m.uuid);

        list.push(json);

        n.animations.forEach(m => {
            var json1 = BaseSerializer.prototype.toJSON.call(this, m);

            Object.assign(json1, m);

            list.push(json1);
        });
    });

    return list;
};

AnimationSerializer.prototype.fromJSON = function (jsons) {
    var list = [];

    var groups = jsons.filter(n => n.type === 'AnimationGroup');

    groups.forEach(n => {
        var obj = BaseSerializer.prototype.fromJSON.call(this, n);
        Object.assign(obj, n);

        obj.id = obj._id;
        delete obj._id;
        delete obj.metadata;

        var animations = obj.animations;
        obj.animations = [];

        animations.forEach(m => {
            var json1 = jsons.filter(o => o.uuid === m)[0];

            if (json1 === undefined) {
                console.warn(`AnimationSerializer: 不存在uuid为${m}的动画。`);
                return;
            }
            var obj1 = BaseSerializer.prototype.fromJSON.call(this, json1);

            Object.assign(obj1, json1);
            obj1.id = obj1._id;
            delete obj1._id;
            delete obj1.metadata;

            obj.animations.push(obj1);
        });

        list.push(obj);
    });

    return list;
};

export default AnimationSerializer;