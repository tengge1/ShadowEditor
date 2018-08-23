import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 更新场景编辑区信息事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function UpdateSceneStatusEvent(app) {
    BaseEvent.call(this, app);
}

UpdateSceneStatusEvent.prototype = Object.create(BaseEvent.prototype);
UpdateSceneStatusEvent.prototype.constructor = UpdateSceneStatusEvent;

UpdateSceneStatusEvent.prototype.start = function () {
    var _this = this;
    this.app.on('objectAdded.' + this.id, this.onUpdateInfo.bind(this));
    this.app.on('objectRemoved.' + this.id, this.onUpdateInfo.bind(this));
    this.app.on('geometryChanged.' + this.id, this.onUpdateInfo.bind(this));
};

UpdateSceneStatusEvent.prototype.stop = function () {
    this.app.on('objectAdded.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
    this.app.on('geometryChanged.' + this.id, null);
};

UpdateSceneStatusEvent.prototype.onUpdateInfo = function () {
    var editor = this.app.editor;

    var scene = editor.scene;

    var objects = 0, vertices = 0, triangles = 0;

    for (var i = 0, l = scene.children.length; i < l; i++) {
        var object = scene.children[i];

        object.traverseVisible(function (object) {
            objects++;

            if (object instanceof THREE.Mesh) {
                var geometry = object.geometry;

                if (geometry instanceof THREE.Geometry) {
                    vertices += geometry.vertices.length;
                    triangles += geometry.faces.length;
                } else if (geometry instanceof THREE.BufferGeometry) {
                    if (geometry.index !== null) {
                        vertices += geometry.index.count * 3;
                        triangles += geometry.index.count;
                    } else {
                        vertices += geometry.attributes.position.count;
                        triangles += geometry.attributes.position.count / 3;
                    }
                }
            }
        });
    }

    var objectsText = UI.get('objectsText');
    var verticesText = UI.get('verticesText');
    var trianglesText = UI.get('trianglesText');

    objectsText.setValue(objects.format());
    verticesText.setValue(vertices.format());
    trianglesText.setValue(triangles.format());
};

export default UpdateSceneStatusEvent;