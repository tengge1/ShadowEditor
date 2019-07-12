import './css/ScriptPanel.css';
import { classNames, PropTypes, Icon } from '../../third_party';
import ScriptEditor from '../script/ScriptEditor';

/**
 * 脚本面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
        };

        this.ref = React.createRef();

        this.handleSave = this.handleSave.bind(this);
    }

    render() {
        const { title } = this.state;

        return <div className={'ScriptPanel'}>
            <div className={'header'}>
                <div className={'title'}>{title}</div>
                <Icon icon={'close'} onClick={this.handleSave}></Icon>
            </div>
            <div className={'content'} ref={this.ref}>
            </div>
        </div>;
    }

    componentDidMount() {
        app.require(['codemirror', 'codemirror-addon', 'esprima', 'jsonlint', 'glslprep', 'acorn', 'ternjs']).then(() => {
            app.scriptEditor = new ScriptEditor(this.ref.current);
        });
    }

    handleSave() {
        var value = app.scriptEditor.getValue();

        debugger
    }
}

export default ScriptPanel;