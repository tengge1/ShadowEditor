import BaseSerializer from '../BaseSerializer';

/**
 * ScriptSerializer
 * @author tengge / https://github.com/tengge1
 */
function ScriptSerializer() {
    BaseSerializer.call(this);
}

ScriptSerializer.prototype = Object.create(BaseSerializer.prototype);
ScriptSerializer.prototype.constructor = ScriptSerializer;

ScriptSerializer.prototype.toJSON = function (scripts) {
    var list = [];

    Object.keys(scripts).forEach(uuid => {
        var json = BaseSerializer.prototype.toJSON.call(this);

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

ScriptSerializer.prototype.fromJSON = function (jsons, parent) {
    parent = parent || {};

    jsons.forEach(json => {
        parent[json.uuid] = {
            id: json.id,
            name: json.name,
            type: json.type,
            source: json.source,
            uuid: json.uuid
        };
    });

    return parent;
};

export default ScriptSerializer;