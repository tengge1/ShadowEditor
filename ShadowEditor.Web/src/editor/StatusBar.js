import UI from '../ui/UI';

/**
 * 状态栏
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function StatusBar(options) {
    UI.Control.call(this, options);
};

StatusBar.prototype = Object.create(UI.Control.prototype);
StatusBar.prototype.constructor = StatusBar;

StatusBar.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'statusBar',
        children: [{
            xtype: 'label',
            text: L_OBJECT_NUM
        }, {
            xtype: 'text',
            id: 'objectsText',
            scope: this.id,
            text: '0' // 物体数
        }, {
            xtype: 'label',
            text: L_VERTEX_NUM
        }, {
            xtype: 'text',
            id: 'verticesText',
            scope: this.id,
            text: '0' // 顶点数
        }, {
            xtype: 'label',
            text: L_TRIANGLE_NUM
        }, {
            xtype: 'text',
            id: 'trianglesText',
            scope: this.id,
            text: '0' // 三角形数
        }, {
            xtype: 'label',
            text: '|',
            style: {
                margin: '0 4px'
            }
        }, {
            xtype: 'label',
            text: L_THROW_BALL,
        }, {
            xtype: 'checkbox',
            id: 'cbThrowBall',
            onChange: this.onEnableThrowBall.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on('objectAdded.' + this.id, this.onUpdateInfo.bind(this));
    app.on('objectRemoved.' + this.id, this.onUpdateInfo.bind(this));
    app.on('geometryChanged.' + this.id, this.onUpdateInfo.bind(this));
};

StatusBar.prototype.onUpdateInfo = function () {
    var editor = app.editor;

    var scene = editor.scene;

    var objects = 0,
        vertices = 0,
        triangles = 0;

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

    var objectsText = UI.get('objectsText', this.id);
    var verticesText = UI.get('verticesText', this.id);
    var trianglesText = UI.get('trianglesText', this.id);

    objectsText.setValue(objects.format());
    verticesText.setValue(vertices.format());
    trianglesText.setValue(triangles.format());
};

StatusBar.prototype.onEnableThrowBall = function () {
    var enabled = UI.get('cbThrowBall');
    app.call('enableThrowBall', this, enabled.getValue());
};

export default StatusBar;