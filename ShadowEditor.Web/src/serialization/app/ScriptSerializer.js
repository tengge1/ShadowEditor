import BaseSerializer from '../BaseSerializer';

/**
 * ScriptSerializer
 */
function ScriptSerializer() {
    BaseSerializer.call(this);
}

ScriptSerializer.prototype = Object.create(BaseSerializer.prototype);
ScriptSerializer.prototype.constructor = ScriptSerializer;

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