import BaseSerializer from '../BaseSerializer';

/**
 * ConfigSerializer
 * @param {*} app 
 */
function ConfigSerializer(app) {
    BaseSerializer.call(this, app);
}

ConfigSerializer.prototype = Object.create(BaseSerializer.prototype);
ConfigSerializer.prototype.constructor = ConfigSerializer;

ConfigSerializer.prototype.toJSON = function () {
    var config = this.app.editor.config;
    var json = BaseSerializer.prototype.toJSON.call(this, config);
    Object.assign(json, config.toJSON());
    return json;
};

ConfigSerializer.prototype.fromJSON = function (json) {
    Object.keys(json).forEach(key => {
        if (key === '_id' || key === 'metadata') {
            return;
        }
        this.app.editor.config.setKey(key, json[key]);
    });

    // theme
    this.app.call('setTheme', this, json['theme']);
};

export default ConfigSerializer;