import './css/ScriptPanel.css';
import { classNames, PropTypes, Button, IconButton, Icon } from '../../third_party';
import ScriptWindow from './window/ScriptWindow.jsx';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scripts: {},
        };

        this.handleAddScript = this.handleAddScript.bind(this);
        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleRemoveScript = this.handleRemoveScript.bind(this);
        this.update = this.update.bind(this);
    }

    render() {
        const scripts = this.state.scripts;

        return <div className={'ScriptPanel'}>
            <div className={'toolbar'}>
                <Button onClick={this.handleAddScript}>{L_NEW_SCRIPT}</Button>
            </div>
            <ul className={'content'}>
                {Object.values(scripts).map(n => {
                    return <li className={'script'} key={n.uuid}>
                        <div className={`name.${this.getExtension(n.type)}`}>{n.name}</div>
                        <IconButton icon={'edit'} onClick={this.handleEditScript}></IconButton>
                        <IconButton icon={'delete'} onClick={this.handleRemoveScript}></IconButton>
                    </li>;
                })}
            </ul>
        </div>;
    }

    getExtension(type) {
        let extension = '';

        switch (type) {
            case 'javascript':
                extension = 'js';
                break;
            case 'vertexShader':
                extension = 'glsl';
                break;
            case 'fragmentShader':
                extension = 'glsl';
                break;
            case 'json':
                extension = 'json';
                break;
        }

        return extension;
    }

    componentDidMount() {
        app.on(`scriptChanged.ScriptPanel`, this.update);
    }

    update() {
        this.setState({
            scripts: app.editor.scripts,
        });
    }

    handleAddScript() {
        const window = app.createElement(ScriptWindow);
        app.addElement(window);
    }

    handleEditScript(uuid) {
        var script = app.editor.scripts[uuid];
        if (script) {
            app.script.open(uuid, script.name, script.type, script.source, script.name, source => {
                script.source = source;
            });
        }
    }

    handleRemoveScript(uuid) {
        var script = app.editor.scripts[uuid];

        app.confirm(L_CONFIRM, `${L_DELETE} ${script.name}？`, (event, btn) => {
            if (btn === 'ok') {
                delete app.editor.scripts[uuid];
                app.call('scriptChanged', this);
            }
        });
    }
}

export default ScriptPanel;