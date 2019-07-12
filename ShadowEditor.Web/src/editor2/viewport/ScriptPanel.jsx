import './css/ScriptPanel.css';
import { classNames, PropTypes, Canvas, SVG } from '../../third_party';
import ScriptEditor from '../script/ScriptEditor';

/**
 * 脚本面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        return <div className={'ScriptPanel'} ref={this.ref}></div>;
    }

    componentDidMount() {
        app.require(['codemirror', 'codemirror-addon', 'esprima', 'jsonlint', 'glslprep', 'acorn', 'ternjs']).then(() => {
            app.scriptEditor = new ScriptEditor(this.ref.current);
        });
    }
}

export default ScriptPanel;