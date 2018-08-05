import BaseSerializer from '../BaseSerializer';
import RendererChangedEvent from '../../event/viewport/RendererChangedEvent';

/**
 * 配置序列化器
 */
function ConfigSerializer() {
    BaseSerializer.call(this);
}

ConfigSerializer.prototype = Object.create(BaseSerializer.prototype);
ConfigSerializer.prototype.constructor = ConfigSerializer;

ConfigSerializer.prototype.filter = function (obj) {
    if (obj.constructor.name === 'Application') {
        return true;
    } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
        return true;
    } else {
        return false;
    }
    return false;
};

ConfigSerializer.prototype.toJSON = function (app) {
    var json = BaseSerializer.prototype.toJSON.call(this, app);
    Object.assign(json, app.editor.config.toJSON());
    return json;
};

ConfigSerializer.prototype.fromJSON = function (app, json) {
    Object.keys(json).forEach(key => {
        if (key === '_id' || key === 'metadata') {
            return;
        }
        app.editor.config.setKey(key, json[key]);
    });

    // renderer
    var renderer = app.editor.createRendererFromConfig();
    app.call('rendererChanged', this, renderer);

    // vr
    UI.get('vr').setValue(json['project/vr']);

    // theme
    app.call('setTheme', this, json['theme']);
};

export default ConfigSerializer;