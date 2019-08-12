import './css/EditorStatusBar.css';
import { classNames, PropTypes, Toolbar, ToolbarSeparator, Label, CheckBox } from '../../third_party';

/**
 * 状态栏
 * @author tengge / https://github.com/tengge1
 */
class EditorStatusBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            objects: 0,
            vertices: 0,
            triangles: 0,
            isThrowBall: false,
        };

        this.handleEnableThrowBall = this.handleEnableThrowBall.bind(this);
    }

    render() {
        const { objects, vertices, triangles, isThrowBall } = this.state;

        return <Toolbar className={'EditorStatusBar'}>
            <Label>{L_OBJECT_NUM}</Label>
            <Label>{objects}</Label>
            <Label>{L_VERTEX_NUM}</Label>
            <Label>{vertices}</Label>
            <Label>{L_TRIANGLE_NUM}</Label>
            <Label>{triangles}</Label>
            <ToolbarSeparator></ToolbarSeparator>
            <Label>{L_THROW_BALL}</Label>
            <CheckBox checked={isThrowBall} onChange={this.handleEnableThrowBall}></CheckBox>
        </Toolbar>;
    }

    componentDidMount() {
        app.on('objectAdded.' + this.id, this.onUpdateInfo.bind(this));
        app.on('objectRemoved.' + this.id, this.onUpdateInfo.bind(this));
        app.on('geometryChanged.' + this.id, this.onUpdateInfo.bind(this));
    }

    onUpdateInfo() {
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
                        } else if (geometry.attributes.position) {
                            vertices += geometry.attributes.position.count;
                            triangles += geometry.attributes.position.count / 3;
                        }
                    }
                }
            });
        }

        this.setState({
            objects: objects.format(),
            vertices: vertices.format(),
            triangles: triangles.format(),
        });
    }

    handleEnableThrowBall(checked) {
        app.call('enableThrowBall', this, checked);
    }
}

export default EditorStatusBar;