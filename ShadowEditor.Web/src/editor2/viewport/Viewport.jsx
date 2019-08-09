import './css/Viewport.css';
import { classNames, PropTypes, Canvas, SVG } from '../../third_party';
import ScriptEditorPanel from './ScriptEditorPanel.jsx';
import Player from '../../player/Player';

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
        return <div className={'Viewport'} ref={this.viewportRef}>
            <div className={'editor'} ref={this.editorRef}></div>
            <svg className={'svg'} ref={this.svgRef}></svg>
            <ScriptEditorPanel></ScriptEditorPanel>
            <div className={'player'} ref={this.playerRef}></div>
        </div>;
    }

    componentDidMount() {
        app.viewportRef = this.viewportRef.current;
        app.editorRef = this.editorRef.current;
        app.svgRef = this.svgRef.current;
        app.playerRef = this.playerRef.current;

        // 性能控件
        app.stats = new Stats();

        Object.assign(app.stats.dom.style, {
            position: 'absolute',
            left: '8px',
            top: '8px',
            zIndex: 'initial',
        });

        app.viewportRef.appendChild(app.stats.dom);

        app.viewport = this.editorRef.current;
        app.player = new Player(this.playerRef.current, {
            server: app.options.server,
            enableThrowBall: false,
            showStats: false,
        });
    }
}

export default Viewport;