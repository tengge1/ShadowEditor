import './css/ScriptPanel.css';
import { Tree, IconButton } from '../../ui/index';
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
            selected: null,
            expanded: {}
        };

        this.handleAddFolder = this.handleAddFolder.bind(this);
        this.handleCommitAddFolder = this.handleCommitAddFolder.bind(this);
        this.handleAddScript = this.handleAddScript.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleClickIcon = this.handleClickIcon.bind(this);
        this.handleExpand = this.handleExpand.bind(this);

        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleSaveScript = this.handleSaveScript.bind(this);
        this.handleRemoveScript = this.handleRemoveScript.bind(this);
        this.update = this.update.bind(this);
    }

    render() {
        const { scripts, selected, expanded } = this.state;

        const data = Object.entries(scripts || []).map(n => {
            if (n[1].type === 'folder') { // 文件夹
                return {
                    value: n[0],
                    text: `${n[1].name}.${this.getExtension(n[1].type)}`,
                    leaf: false,
                    expanded: expanded[n[0]] !== false
                };
            } else { // 脚本
                return {
                    value: n[0],
                    text: `${n[1].name}.${this.getExtension(n[1].type)}`,
                    leaf: true,
                    icons: [{
                        name: 'edit',
                        value: n[0],
                        icon: 'edit',
                        title: _t('Edit Script')
                    }, {
                        name: 'delete',
                        value: n[0],
                        icon: 'delete',
                        title: _t('Delete Script')
                    }]
                };
            }
        });

        return <div className={'ScriptPanel'}>
            <div className={'toolbar'}>
                <IconButton icon={'add-folder'}
                    title={_t('Add Folder')}
                    onClick={this.handleAddFolder}
                />
                <IconButton icon={'add script'}
                    title={_t('Add Script')}
                    onClick={this.handleAddScript}
                />
            </div>
            <div className={'content'}>
                <Tree
                    data={data}
                    selected={selected}
                    onSelect={this.handleSelect}
                    onClickIcon={this.handleClickIcon}
                    onExpand={this.handleExpand}
                />
            </div>
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
            scripts: app.editor.scripts
        });
    }

    handleAddFolder() {
        app.prompt({
            title: _t('Input Folder Name'),
            content: _t('Folder Name'),
            value: _t('New folder'),
            onOK: this.handleCommitAddFolder
        });
    }

    handleCommitAddFolder(value) {
        const uuid = THREE.Math.generateUUID();

        app.editor.scripts[uuid] = {
            id: null,
            pid: null,
            name: value,
            type: 'folder',
            uuid,
            sort: 0
        };

        app.call(`scriptChanged`, this);
    }

    handleAddScript() {
        const window = app.createElement(ScriptWindow);
        app.addElement(window);
    }

    handleSelect(value) {
        this.setState({
            selected: value
        });
    }

    handleClickIcon(value, name) {
        if (name === 'edit') {
            this.handleEditScript(value);
        } else if (name === 'delete') {
            this.handleRemoveScript(value);
        }
    }

    handleExpand(value) {
        let { expanded } = this.state;
        if (expanded[value] === undefined || expanded[value] === true) {
            expanded[value] = false;
        } else {
            expanded[value] = true;
        }
        this.setState({
            expanded
        });
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
            source
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