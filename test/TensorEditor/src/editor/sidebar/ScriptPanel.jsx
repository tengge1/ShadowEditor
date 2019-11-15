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
        this.handleSaveScript = this.handleSaveScript.bind(this);
        this.handleRemoveScript = this.handleRemoveScript.bind(this);
        this.update = this.update.bind(this);
    }

    render() {
        const scripts = this.state.scripts;

        return <div className={'ScriptPanel'}>
            <div className={'toolbar'}>
                <Button onClick={this.handleAddScript}>{_t('New Script')}</Button>
            </div>
            <ul className={'content'}>
                {Object.values(scripts).map(n => {
                    return <li key={n.uuid}>
                        <span>{`${n.name}.${this.getExtension(n.type)}`}</span>
                        <Icon name={n.uuid} icon={'edit'} title={_t('Edit Script')} onClick={this.handleEditScript}></Icon>
                        <Icon name={n.uuid} icon={'delete'} title={_t('Delete Script')} onClick={this.handleRemoveScript}></Icon>
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
            app.call(`editScript`, this, uuid, script.name, script.type, script.source, this.handleSaveScript);
        }
    }

    handleSaveScript(uuid, name, type, source) {
        app.editor.scripts[uuid] = {
            id: null,
            uuid,
            name,
            type,
            source,
        };

        app.call(`scriptChanged`, this);
    }

    handleRemoveScript(uuid) {
        const script = app.editor.scripts[uuid];

        app.confirm({
            title: _t('Confirm'),
            content: `${_t('Delete')} ${script.name}.${this.getExtension(script.type)}？`,
            onOK: () => {
                delete app.editor.scripts[uuid];
                app.call('scriptChanged', this);
            }
        });
    }
}

export default ScriptPanel;