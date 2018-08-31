import BaseSerializer from '../BaseSerializer';

/**
 * ScriptSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ScriptSerializer(app) {
    BaseSerializer.call(this, app);
}

ScriptSerializer.prototype = Object.create(BaseSerializer.prototype);
ScriptSerializer.prototype.constructor = ScriptSerializer;

ScriptSerializer.prototype.toJSON = function (scripts) {
    var list = [];

    Object.keys(scripts).forEach(uuid => {
        var json = BaseSerializer.prototype.toJSON.call(this, this.app);

        var script = scripts[uuid];

        Object.assign(json, {
            id: script.id,
            name: script.name,
            type: script.type,
            source: script.source,
            uuid: script.uuid
        });

        list.push(json);
    });

    return list;
};

ScriptSerializer.prototype.fromJSON = function (jsons) {
    var scripts = {};

    jsons.forEach(json => {
        scripts[json.uuid] = {
            id: json.id,
            name: json.name,
            type: json.type,
            source: json.source,
            uuid: json.uuid
        };
    });

    this.app.editor.scripts = scripts;
    this.app.call('scriptChange', this);
};

export default ScriptSerializer;