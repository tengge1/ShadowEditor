import './css/EditorStatusBar.css';
import { classNames, PropTypes, Toolbar, ToolbarSeparator, Label, CheckBox, Button } from '../../third_party';
import VideoRecorder from '../../utils/VideoRecorder';

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
            isRecording: false,
        };

        this.handleEnableThrowBall = this.handleEnableThrowBall.bind(this);
        this.handleRecord = this.handleRecord.bind(this);
    }

    render() {
        const { objects, vertices, triangles, isThrowBall, isRecording } = this.state;

        return <Toolbar className={'EditorStatusBar'}>
            <Label>{_t('Object')}</Label>
            <Label>{objects}</Label>
            <Label>{_t('Vertex')}</Label>
            <Label>{vertices}</Label>
            <Label>{_t('Triangle')}</Label>
            <Label>{triangles}</Label>
            <ToolbarSeparator></ToolbarSeparator>
            <Label>{_t('ThrowBall')}</Label>
            <CheckBox checked={isThrowBall} onChange={this.handleEnableThrowBall}></CheckBox>
            <ToolbarSeparator></ToolbarSeparator>
            <Button onClick={this.handleRecord}>{isRecording ? _t('Cancel') : _t('Record')}</Button>
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

    handleRecord() {
        if (this.state.isRecording) {
            this.stopRecord();
        } else {
            this.startRecord();
        }
    }

    startRecord() {
        if (this.recorder === undefined) {
            this.recorder = new VideoRecorder();
        }

        this.recorder.start().then(success => {
            if (success) {
                this.setState({
                    isRecording: true,
                });
            }
        });
    }

    stopRecord() {
        if (!this.recorder) {
            return;
        }

        this.recorder.stop().then(() => {
            this.setState({
                isRecording: false,
            });
        });
    }
}

export default EditorStatusBar;