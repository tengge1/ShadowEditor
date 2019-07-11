import './css/Viewport.css';
import { classNames, PropTypes, Canvas, SVG } from '../../third_party';
import ScriptPanel from './ScriptPanel.jsx';
import Player from '../../player/Player';

/**
 * 视口
 * @author tengge / https://github.com/tengge1
 */
class Viewport extends React.Component {
    constructor(props) {
        super(props);

        this.editorRef = React.createRef();
        this.svgRef = React.createRef();
        this.scriptRef = React.createRef();
        this.playerRef = React.createRef();
    }

    render() {
        return <div className={'Viewport'}>
            <div className={'editor'} ref={this.editorRef}></div>
            <div className={'svg'} ref={this.svgRef}></div>
            <div className={'script'} ref={this.scriptRef}>
                <ScriptPanel></ScriptPanel>
            </div>
            <div className={'player'} ref={this.playerRef}></div>
        </div>;
    }

    componentDidMount() {
        app.editorRef = this.editorRef.current;
        app.svgRef = this.svgRef.current;
        app.scriptRef = this.scriptRef;
        app.playerRef = this.playerRef.current;

        app.viewport = this.editorRef.current;
        app.player = new Player(this.playerRef.current, {
            server: app.options.server,
            enableThrowBall: false,
            showStats: false,
        });
    }
}

export default Viewport;