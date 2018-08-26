import BaseSerializer from '../BaseSerializer';

/**
 * OptionsSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function OptionsSerializer(app) {
    BaseSerializer.call(this, app);
}

OptionsSerializer.prototype = Object.create(BaseSerializer.prototype);
OptionsSerializer.prototype.constructor = OptionsSerializer;

OptionsSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);
    Object.assign(json, obj);
    return json;
};

OptionsSerializer.prototype.fromJSON = function (json, parent) {
    if (parent === undefined) {
        console.warn(`OptionsSerializer: parent是undefined。`);
        return null;
    }
    Object.keys(json).forEach(n => {
        if (n === '_id' || n === 'metadata' || n === 'server') { // 由于不同服务器的服务端不一样，所以不能反序列化server配置
            return;
        }
        parent[n] = json[n];
    });

    this.app.editor.grid.visible = json.showGrid === undefined ? true : json.showGrid;
};

export default OptionsSerializer;