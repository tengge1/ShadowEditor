import BaseSerializer from '../BaseSerializer';

/**
 * ScriptSerializer
 * @param {*} app 
 */
function ScriptSerializer(app) {
    BaseSerializer.call(this, app);
}

ScriptSerializer.prototype = Object.create(BaseSerializer.prototype);
ScriptSerializer.prototype.constructor = ScriptSerializer;

ScriptSerializer.prototype.toJSON = function () {
    var list = [];

    var scripts = this.app.editor.scripts;

    Object.keys(scripts).forEach(id => {
        var json = BaseSerializer.prototype.toJSON.call(this, this.app);

        var name = scripts[id].name;
        var source = scripts[id].source;

        Object.assign(json, {
            id: id,
            name: name,
            source: source
        });

        list.push(json);
    });

    return list;
};

ScriptSerializer.prototype.fromJSON = function (json) {
    this.app.editor.scripts = {};

    json.forEach(n => {
        this.app.editor.scripts[id] = {
            name: n.name,
            source: n.source
        };
    });
};

export default ScriptSerializer;