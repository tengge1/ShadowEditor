import BaseEvent from '../BaseEvent';

/**
 * 更新场景编辑区信息事件
 * @param {*} app 
 */
function UpdateViewportInfoEvent(app) {
    BaseEvent.call(this, app);
}

UpdateViewportInfoEvent.prototype = Object.create(BaseEvent.prototype);
UpdateViewportInfoEvent.prototype.constructor = UpdateViewportInfoEvent;

UpdateViewportInfoEvent.prototype.start = function () {
    var _this = this;
    this.app.on('objectAdded.' + this.id, function (event) {
        _this.onUpdateInfo(event);
    });
    this.app.on('objectRemoved.' + this.id, function (event) {
        _this.onUpdateInfo(event);
    });
    this.app.on('geometryChanged.' + this.id, function (event) {
        _this.onUpdateInfo(event);
    });
};

UpdateViewportInfoEvent.prototype.stop = function () {
    this.app.on('objectAdded.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
    this.app.on('geometryChanged.' + this.id, null);
};

UpdateViewportInfoEvent.prototype.onUpdateInfo = function (event) {
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

    document.getElementById('objectsText').innerHTML = objects.format();
    document.getElementById('verticesText').innerHTML = vertices.format();
    document.getElementById('trianglesText').innerHTML = triangles.format();
};

export default UpdateViewportInfoEvent;