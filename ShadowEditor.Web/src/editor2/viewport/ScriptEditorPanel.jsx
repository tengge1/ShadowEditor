import './css/ScriptEditorPanel.css';
import { classNames, PropTypes, Icon } from '../../third_party';
import ScriptEditor from '../script/ScriptEditor';

/**
 * 脚本面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptEditorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            uuid: null,
            name: '',
            source: '',
            title: '',
        };

        this.ref = React.createRef();

        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    render() {
        const { show, uuid, name, source, title } = this.state;

        return <div className={classNames('ScriptEditorPanel', !show && 'hidden')}>
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
        app.on(`editScript.ScriptPanel`, this.handleEditScript);
    }

    handleEditScript(uuid, name, source, title) {
        this.setState({
            show: true,
            uuid,
            name,
            source,
            title
        });
    }

    handleSave() {
        var value = app.scriptEditor.getValue();

        this.setState({
            show: false,
        });
    }
}

export default ScriptEditorPanel;