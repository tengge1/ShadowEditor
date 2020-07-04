/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { ToolbarSeparator, IconButton, ImageButton } from '../../ui/index';

/**
 * 地形工具
 * @author tengge / https://github.com/tengge1
 */
class TerrainTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'translate',
            view: 'perspective',
            isGridMode: false
        };

        this.handleEnterSelectMode = this.handleEnterSelectMode.bind(this);
        this.handleEnterTranslateMode = this.handleEnterTranslateMode.bind(this);
        this.handleEnterRotateMode = this.handleEnterRotateMode.bind(this);
        this.handleEnterScaleMode = this.handleEnterScaleMode.bind(this);

        this.handlePerspective = this.handlePerspective.bind(this);
        this.handleFrontView = this.handleFrontView.bind(this);
        this.handleSideView = this.handleSideView.bind(this);
        this.handleTopView = this.handleTopView.bind(this);

        this.handleGridMode = this.handleGridMode.bind(this);
    }

    render() {
        const { mode, view, isGridMode } = this.state;

        return <>
            <IconButton
                icon={'select'}
                title={_t('Select')}
                selected={mode === 'select'}
                onClick={this.handleEnterSelectMode}
            />
            <IconButton
                icon={'translate'}
                title={_t('Translate')}
                selected={mode === 'translate'}
                onClick={this.handleEnterTranslateMode}
            />
            <IconButton
                icon={'rotate'}
                title={_t('Rotate')}
                selected={mode === 'rotate'}
                onClick={this.handleEnterRotateMode}
            />
            <IconButton
                icon={'scale'}
                title={_t('Scale')}
                selected={mode === 'scale'}
                onClick={this.handleEnterScaleMode}
            />
            <ToolbarSeparator />
            <ImageButton
                src={'assets/image/perspective-view.png'}
                title={_t('Perspective View')}
                selected={view === 'perspective'}
                onClick={this.handlePerspective}
            />
            <ImageButton
                src={'assets/image/front-view.png'}
                title={_t('Front View')}
                selected={view === 'front'}
                onClick={this.handleFrontView}
            />
            <ImageButton
                src={'assets/image/side-view.png'}
                title={_t('Side View')}
                selected={view === 'side'}
                onClick={this.handleSideView}
            />
            <ImageButton
                src={'assets/image/top-view.png'}
                title={_t('Top View')}
                selected={view === 'top'}
                onClick={this.handleTopView}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'grid'}
                title={_t('Grid Mode')}
                selected={isGridMode}
                onClick={this.handleGridMode}
            />
            <ToolbarSeparator />
        </>;
    }

    // --------------------------------- 选择模式 -------------------------------------

    handleEnterSelectMode() {
        this.setState({ mode: 'select' });
        app.call('changeMode', this, 'select');
    }

    handleEnterTranslateMode() {
        this.setState({ mode: 'translate' });
        app.call('changeMode', this, 'translate');
    }

    handleEnterRotateMode() {
        this.setState({ mode: 'rotate' });
        app.call('changeMode', this, 'rotate');
    }

    handleEnterScaleMode() {
        this.setState({ mode: 'scale' });
        app.call('changeMode', this, 'scale');
    }

    // ------------------------------ 视角工具 ------------------------------------------

    handlePerspective() {
        app.call(`changeView`, this, 'perspective');
        this.setState({
            view: 'perspective'
        });
    }

    handleFrontView() {
        app.call(`changeView`, this, 'front');
        this.setState({
            view: 'front'
        });
    }

    handleSideView() {
        app.call(`changeView`, this, 'side');
        this.setState({
            view: 'side'
        });
    }

    handleTopView() {
        app.call(`changeView`, this, 'top');
        this.setState({
            view: 'top'
        });
    }

    // ----------------------------- 网格模式 ------------------------------------------

    handleGridMode() {
        const isGridMode = !this.state.isGridMode;

        if (isGridMode) {
            app.editor.scene.overrideMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
        } else {
            app.editor.scene.overrideMaterial = null;
        }

        this.setState({
            isGridMode
        });
    }
}

export default TerrainTools;