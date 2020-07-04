/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/EditorStatusBar.css';
import { Toolbar, ToolbarSeparator, Label, CheckBox } from '../../ui/index';

/**
 * 状态栏
 * @author tengge / https://github.com/tengge1
 */
class EditorStatusBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            objects: 0,
            vertices: 0,
            triangles: 0
        };

        this.handleUpdateMousePosition = this.handleUpdateMousePosition.bind(this);
        this.handleUpdateSceneInfo = this.handleUpdateSceneInfo.bind(this);

        this.handleAutoSaveChange = this.handleAutoSaveChange.bind(this);
    }

    render() {
        const { x, y, objects, vertices, triangles } = this.state;

        const autoSave = app.storage.autoSave;

        return <Toolbar className={'EditorStatusBar'}>
            <Label>{`r${THREE.REVISION}`}</Label>
            <ToolbarSeparator />
            <Label>{_t('X')}</Label>
            <div className={'mouse-position'}>
                <Label>{x}</Label>
            </div>
            <Label>{_t('Y')}</Label>
            <div className={'mouse-position'}>
                <Label>{y}</Label>
            </div>
            <ToolbarSeparator />
            <Label>{_t('Object')}</Label>
            <Label className={'value'}>{objects}</Label>
            <Label>{_t('Vertex')}</Label>
            <Label className={'value'}>{vertices}</Label>
            <Label>{_t('Triangle')}</Label>
            <Label className={'value'}>{triangles}</Label>
            <ToolbarSeparator />
            <Label>{_t('Auto Save')}</Label>
            <CheckBox name={'autoSave'}
                checked={autoSave}
                onChange={this.handleAutoSaveChange}
            />
            <ToolbarSeparator />
        </Toolbar>;
    }

    componentDidMount() {
        app.on(`mousemove.EditorStatusBar`, this.handleUpdateMousePosition);
        app.on(`objectAdded.EditorStatusBar`, this.handleUpdateSceneInfo);
        app.on(`objectRemoved.EditorStatusBar`, this.handleUpdateSceneInfo);
        app.on(`geometryChanged.EditorStatusBar`, this.handleUpdateSceneInfo);
    }

    handleUpdateMousePosition(event) {
        if (event.target !== app.editor.renderer.domElement) {
            this.setState({
                x: 0,
                y: 0
            });
            return;
        }
        this.setState({
            x: event.offsetX,
            y: event.offsetY
        });
    }

    handleUpdateSceneInfo() {
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

    handleAutoSaveChange(value, name) {
        app.storage.autoSave = value;
        this.forceUpdate();
        app.call('storageChanged', this, name, value);
    }
}

export default EditorStatusBar;