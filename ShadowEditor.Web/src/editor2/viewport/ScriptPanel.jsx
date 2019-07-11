import './css/Viewport.css';
import { classNames, PropTypes, Canvas, SVG } from '../../third_party';

/**
 * 脚本面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);

        this.editorRef = React.createRef();
        this.svgRef = React.createRef();
        this.scriptRef = React.createRef();
        this.playerRef = React.createRef();
    }

    render() {
        return <div className={'ScriptPanel'}>

        </div>;
    }
}

export default ScriptPanel;