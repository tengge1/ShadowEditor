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

    scripts.forEach(script => {
        var json = BaseSerializer.prototype.toJSON.call(this);

        Object.assign(json, {
            id: script.id,
            pid: script.pid,
            name: script.name,
            type: script.type,
            source: script.source,
            sort: script.sort,
            uuid: script.uuid
        });

        list.push(json);
    });

    return list;
};

ScriptSerializer.prototype.fromJSON = function (jsons, parent) {
    parent = parent || [];

    jsons.forEach(json => {
        parent.push({
            id: json.id,
            pid: json.pid,
            name: json.name,
            type: json.type,
            source: json.source,
            sort: json.sort,
            uuid: json.uuid
        });
    });

    return parent;
};

export default ScriptSerializer;