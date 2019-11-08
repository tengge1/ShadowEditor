import './css/EditorStatusBar.css';
import { Toolbar, ToolbarSeparator, Label, CheckBox, Button, Input, Select } from '../../third_party';
import Converter from '../../utils/Converter';
import TimeUtils from '../../utils/TimeUtils';
import VideoRecorder from '../../utils/VideoRecorder';

/**
 * 状态栏
 * @author tengge / https://github.com/tengge1
 */
class EditorStatusBar extends React.Component {
    constructor(props) {
        super(props);

        this.selectMode = {
            whole: _t('Select Whole'),
            part: _t('Select Part')
        };

        this.addMode = {
            center: _t('Add To Center'),
            click: _t('Click Scene To Add')
        };

        this.state = {
            objects: 0,
            vertices: 0,
            triangles: 0,
            showStats: app.storage.get('showStats') === undefined ? true : app.storage.get('showStats'),
            showGrid: app.storage.get('showGrid') === undefined ? true : app.storage.get('showGrid'),
            showViewHelper: app.storage.get('showViewHelper') === undefined ? true : app.storage.get('showViewHelper'),
            isThrowBall: false,
            isRecording: false
        };

        this.handleShowStats = this.handleShowStats.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowViewHelper = this.handleShowViewHelper.bind(this);
        this.handleEnablePhysics = this.handleEnablePhysics.bind(this);
        this.handleEnableThrowBall = this.handleEnableThrowBall.bind(this);
        this.handleChangeSelectMode = this.handleChangeSelectMode.bind(this);
        this.handleChangeAddMode = this.handleChangeAddMode.bind(this);
        this.handleScreenshot = this.handleScreenshot.bind(this);
        this.commitScreenshot = this.commitScreenshot.bind(this);
        this.handleRecord = this.handleRecord.bind(this);
    }

    render() {
        const { objects, vertices, triangles, showStats, showGrid, showViewHelper, isThrowBall, isRecording } = this.state;
        const { selectMode, selectedColor, selectedThickness, addMode, enablePhysics } = app.options;

        const isLogin = !app.config.enableAuthority || app.config.isLogin;

        return <Toolbar className={'EditorStatusBar'}>
            <Label>{_t('Object')}</Label>
            <Label>{objects}</Label>
            <Label>{_t('Vertex')}</Label>
            <Label>{vertices}</Label>
            <Label>{_t('Triangle')}</Label>
            <Label>{triangles}</Label>
            <ToolbarSeparator />
            <Label>{_t('Show Stats')}</Label>
            <CheckBox checked={showStats}
                onChange={this.handleShowStats}
            />
            <Label>{_t('Grid')}</Label>
            <CheckBox checked={showGrid}
                onChange={this.handleShowGrid}
            />
            <Label>{_t('View Helper')}</Label>
            <CheckBox checked={showViewHelper}
                onChange={this.handleShowViewHelper}
            />
            <ToolbarSeparator />
            {isLogin && <>
                <Label>{_t('Physics Engine')}</Label>
                <CheckBox name={'enablePhysics'}
                    checked={enablePhysics}
                    onChange={this.handleEnablePhysics}
                />
                <Label>{_t('ThrowBall')}</Label>
                <CheckBox checked={isThrowBall}
                    onChange={this.handleEnableThrowBall}
                />
                <ToolbarSeparator />
            </>}
            {isLogin && <>
                <Label>{_t('Selected Mode')}</Label>
                <Select name={'selectMode'}
                    options={this.selectMode}
                    value={selectMode}
                    onChange={this.handleChangeSelectMode}
                />
                <ToolbarSeparator />
            </>}
            {isLogin && <>
                <Label>{_t('Add Mode')}</Label>
                <Select name={'addMode'}
                    options={this.addMode}
                    value={addMode}
                    onChange={this.handleChangeAddMode}
                />
                <ToolbarSeparator />
            </>}
            {isLogin && <>
                <Button onClick={this.handleScreenshot}>{_t('Screenshot')}</Button>
                <Button onClick={this.handleRecord}>{isRecording ? _t('Stop') : _t('Record')}</Button>
            </>}
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
            triangles: triangles.format()
        });
    }

    handleShowStats() {
        const showStats = !app.storage.get('showStats');
        app.storage.set('showStats', showStats);

        Object.assign(app.stats.dom.style, {
            display: showStats ? 'block' : 'none'
        });

        this.setState({
            showStats
        });
    }

    handleShowGrid(showGrid) {
        if (showGrid !== app.storage.get('showGrid')) {
            app.storage.set('showGrid', showGrid);
            app.call(`storageChanged`, this, 'showGrid', showGrid);

            this.setState({
                showGrid
            });
        }
    }

    handleShowViewHelper() {
        const showViewHelper = !app.storage.get('showViewHelper');
        app.storage.set('showViewHelper', showViewHelper);

        app.call(`storageChanged`, this, 'showViewHelper', showViewHelper);

        this.setState({
            showViewHelper
        });
    }

    handleEnablePhysics(value) {
        app.options.enablePhysics = value;
        app.call('optionChange', this, 'enablePhysics', value);
        this.forceUpdate();
    }

    handleEnableThrowBall(checked) {
        app.call('enableThrowBall', this, checked);
    }

    handleChangeSelectMode(value) {
        app.options.selectMode = value;
        app.call('optionChange', this, 'selectMode', value);
        this.forceUpdate();
    }

    handleChangeAddMode(value) {
        app.options.addMode = value;
        app.call('optionChange', this, 'addMode', value);
        this.forceUpdate();
    }

    handleScreenshot() {
        app.on(`afterRender.Screenshot`, this.commitScreenshot);
    }

    commitScreenshot() {
        app.on(`afterRender.Screenshot`, null);

        const canvas = app.editor.renderer.domElement;
        const dataUrl = Converter.canvasToDataURL(canvas);
        const file = Converter.dataURLtoFile(dataUrl, TimeUtils.getDateTime());

        let form = new FormData();
        form.append('file', file);

        fetch(`/api/Screenshot/Add`, {
            method: 'POST',
            body: form
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg));
                    return;
                }
                app.toast(_t(obj.Msg));
            });
        });
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
                    isRecording: true
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
                isRecording: false
            });
        });
    }
}

export default EditorStatusBar;