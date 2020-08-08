/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Viewport.css';
import ScriptEditorPanel from './ScriptEditorPanel.jsx';
import Player from '../../player/Player';
import VisualDOM from '../../visual/VisualDOM.jsx';
import global from '../../global';

/**
 * 视口
 * @author tengge / https://github.com/tengge1
 */
class Viewport extends React.Component {
    constructor(props) {
        super(props);

        this.viewportRef = React.createRef();
        this.editorRef = React.createRef();
        this.cesiumRef = React.createRef();
        this.svgRef = React.createRef();
        this.playerRef = React.createRef();

        this.handleOptionChanged = this.handleOptionChanged.bind(this);
    }

    render() {
        return <div className={'Viewport'}
            ref={this.viewportRef}
               >
            <div className={'editor'}
                ref={this.editorRef}
                tabIndex={0}
            />
            <div className={'cesium'}
                ref={this.cesiumRef}
                tabIndex={10}
            />
            <VisualDOM className={'svg'}
                ref={this.svgRef}
            />
            <ScriptEditorPanel />
            <div className={'player'}
                ref={this.playerRef}
            />
        </div>;
    }

    componentDidMount() {
        global.app.viewportRef = this.viewportRef.current;
        global.app.editorRef = this.editorRef.current;
        global.app.cesiumRef = this.cesiumRef.current;
        global.app.svgRef = this.svgRef.current;
        global.app.visual = this.svgRef.current;
        global.app.playerRef = this.playerRef.current;

        // 性能控件
        global.app.stats = new Stats();

        let showStats = global.app.storage.showStats;

        if (showStats === undefined) {
            showStats = true;
            global.app.storage.showStats = true;
        }

        Object.assign(global.app.stats.dom.style, {
            position: 'absolute',
            left: '8px',
            top: '8px',
            zIndex: 'initial',
            display: showStats ? 'block' : 'none'
        });

        global.app.viewportRef.appendChild(global.app.stats.dom);

        global.app.viewport = this.editorRef.current;
        global.app.player = new Player(this.playerRef.current, {
            server: global.app.options.server,
            enableThrowBall: false,
            showStats: false
        });

        global.app.on(`optionChange.Viewport`, this.handleOptionChanged);
    }

    handleOptionChanged(key, value) {
        if (key !== 'sceneType') {
            return;
        }
        if (value === 'GIS') { // GIS
            this.editorRef.current.style.display = 'none';
            this.cesiumRef.current.style.display = 'block';
        } else { // Empty
            this.cesiumRef.current.style.display = 'none';
            this.editorRef.current.style.display = 'block';
        }
    }
}

export default Viewport;