import BaseSerializer from '../BaseSerializer';
// import Application from '../../Application';

/**
 * Object3D序列化器
 */
function ScriptSerializer() {
    BaseSerializer.call(this);
}

ScriptSerializer.prototype = Object.create(BaseSerializer.prototype);
ScriptSerializer.prototype.constructor = ScriptSerializer;

ScriptSerializer.prototype.filter = function (obj) {
    // TODO: 消除rollup打包Circular dependency警告

    // if (obj instanceof Application) {
    //     return true;
    // } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
    //     return true;
    // } else {
    //     return false;
    // }

    return false;
};

ScriptSerializer.prototype.toJSON = function (app) {
    var list = [];

    Object.keys(app.editor.scripts).forEach(id => {
        var json = BaseSerializer.prototype.toJSON.call(this, app);

        var name = app.editor.scripts[id].name;
        var source = app.editor.scripts[id].source;

        Object.assign(json, {
            id: id,
            name: name,
            source: source
        });

        list.push(json);
    });

    return list;
};

ScriptSerializer.prototype.fromJSON = function (app, json) {
    app.editor.scripts = {};

    json.forEach(n => {
        app.editor.scripts[id] = {
            name: n.name,
            source: n.source
        };
    });
};

export default ScriptSerializer;