import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ViewportInfo(editor) {
    this.app = editor.app;

    var container = new UI.Panel();
    container.setId('info');
    container.setPosition('absolute');
    container.setLeft('10px');
    container.setBottom('10px');
    container.setFontSize('12px');
    container.setColor('#fff');

    var objectsText = new UI.Text('0').setMarginLeft('6px');
    var verticesText = new UI.Text('0').setMarginLeft('6px');
    var trianglesText = new UI.Text('0').setMarginLeft('6px');

    container.add(new UI.Text('物体'), objectsText, new UI.Break());
    container.add(new UI.Text('顶点'), verticesText, new UI.Break());
    container.add(new UI.Text('三角形'), trianglesText, new UI.Break());

    this.app.on('objectAdded.ViewportInfo', function () {
        update();
    });

    this.app.on('objectRemoved.ViewportInfo', function () {
        update();
    });

    this.app.on('geometryChanged.ViewportInfo', function () {
        update();
    });

    //

    function update() {

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

        objectsText.setValue(objects.format());
        verticesText.setValue(vertices.format());
        trianglesText.setValue(triangles.format());

    }

    return container;

};

export default ViewportInfo;