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

/**
 * 视口
 * @author tengge / https://github.com/tengge1
 */
class Viewport extends React.Component {
    constructor(props) {
        super(props);

        this.viewportRef = React.createRef();
        this.editorRef = React.createRef();
        this.svgRef = React.createRef();
        this.playerRef = React.createRef();
    }

    render() {
        return <div className={'Viewport'}
            ref={this.viewportRef}
               >
            <div className={'editor'}
                ref={this.editorRef}
                tabIndex={0}
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
        app.viewportRef = this.viewportRef.current;
        app.editorRef = this.editorRef.current;
        app.svgRef = this.svgRef.current;
        app.visual = this.svgRef.current;
        app.playerRef = this.playerRef.current;

        // 性能控件
        app.stats = new Stats();

        let showStats = app.storage.showStats;

        if (showStats === undefined) {
            showStats = true;
            app.storage.showStats = true;
        }

        Object.assign(app.stats.dom.style, {
            position: 'absolute',
            left: '8px',
            top: '8px',
            zIndex: 'initial',
            display: showStats ? 'block' : 'none'
        });

        app.viewportRef.appendChild(app.stats.dom);

        app.viewport = this.editorRef.current;
        app.player = new Player(this.playerRef.current, {
            server: app.options.server,
            enableThrowBall: false,
            showStats: false
        });
    }
}

export default Viewport;