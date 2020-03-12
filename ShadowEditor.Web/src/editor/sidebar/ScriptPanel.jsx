import './css/ScriptPanel.css';
import { Tree, IconButton, ToolbarSeparator } from '../../ui/index';
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
            expanded: {},
            mask: false
        };

        this.handleAddScript = this.handleAddScript.bind(this);
        this.handleAddFolder = this.handleAddFolder.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);

        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleDrop = this.handleDrop.bind(this);

        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
    }

    render() {
        const { scripts, selected, expanded, mask } = this.state;

        const tree = [];
        this.createScriptTree(0, tree, Object.values(scripts), expanded);

        let script = null;
        if (selected !== null && scripts[selected] && scripts[selected].type !== 'folder') {
            script = scripts[selected];
        }

        return <div className={'ScriptPanel'}>
            <div className={'toolbar'}>
                <IconButton icon={'add script'}
                    title={_t('Create Script')}
                    onClick={this.handleAddScript}
                />
                <IconButton icon={'add-folder'}
                    title={_t('Create Folder')}
                    onClick={this.handleAddFolder}
                />
                <IconButton icon={'edit'}
                    title={_t('Edit')}
                    disabled={script === null}
                    onClick={this.handleEdit}
                />
                <IconButton icon={'refresh'}
                    title={_t('Refresh')}
                    onClick={this.handleRefresh}
                />
                <ToolbarSeparator />
                <IconButton icon={'edit'}
                    title={_t('Edit')}
                    disabled={script === null}
                    onClick={this.handleEditScript}
                />
                <IconButton icon={'delete'}
                    title={_t('Delete')}
                    disabled={script === null}
                    onClick={this.handleDelete}
                />
            </div>
            <div className={'content'}>
                <Tree
                    data={tree}
                    selected={selected}
                    mask={mask}
                    onSelect={this.handleSelect}
                    onExpand={this.handleExpand}
                    onDrop={this.handleDrop}
                />
            </div>
        </div>;
    }

    createScriptTree(pid, tree, scripts, expanded) {
        let list = null;

        if (pid === 0) {
            list = scripts.filter(n => n.pid === undefined || n.pid === null);
        } else {
            list = scripts.filter(n => n.pid === pid);
        }

        if (!list || list.length === 0) {
            return;
        }

        list.forEach(n => {
            if (n.type === 'folder') {
                let node = {
                    value: n.uuid,
                    text: `${n.name}`,
                    children: [],
                    leaf: false,
                    expanded: expanded[n.uuid] !== false
                };
                tree.push(node);
                this.createScriptTree(n.uuid, node.children, scripts, expanded);
            } else {
                tree.push({
                    value: n.uuid,
                    text: `${n.name}.${this.getExtension(n.type)}`,
                    leaf: true
                });
            }
        });
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

    handleAddScript() {
        const window = app.createElement(ScriptWindow);
        app.addElement(window);
    }

    handleAddFolder() {
        app.prompt({
            title: _t('Input Folder Name'),
            content: _t('Folder Name'),
            value: _t('New folder'),
            onOK: value => {
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
        });
    }

    handleEdit() {
        const selected = this.state.selected;
        if (selected === null) {
            return;
        }
        var script = app.editor.scripts[selected];

        app.prompt({
            title: _t('Input New Name'),
            content: _t('Name'),
            value: script.name,
            onOK: value => {
                script.name = value;
                app.call('scriptChanged', this);
            }
        });
    }

    handleRefresh() {
        // TODO: 为了显示LoadMask，刷新一次其实刷新了两次。
        this.setState({
            mask: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    mask: false
                });
            }, 100);
        });
    }

    handleEditScript() {
        const selected = this.state.selected;
        if (selected === null) {
            return;
        }
        var script = app.editor.scripts[selected];
        if (script) {
            app.call(`editScript`, this, script.uuid, script.name, script.type, script.source, this.save);
        }
    }

    handleDelete() {
        const selected = this.state.selected;
        if (selected === null) {
            return;
        }

        const script = app.editor.scripts[selected];

        app.confirm({
            title: _t('Confirm'),
            content: `${_t('Delete')} ${script.name}.${this.getExtension(script.type)}？`,
            onOK: () => {
                delete app.editor.scripts[script.uuid];
                app.call('scriptChanged', this);
            }
        });
    }

    handleSelect(value) {
        this.setState({
            selected: value
        });
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

    handleDrop(current, newParent, newIndex) {
        let scripts = this.state.scripts;

        let currentScript = scripts[current];
        currentScript.pid = newParent;

        app.call(`scriptChanged`, this);
    }

    save(uuid, name, type, source) {
        app.editor.scripts[uuid] = {
            id: null,
            uuid,
            name,
            type,
            source
        };

        app.call(`scriptChanged`, this);
    }
}

export default ScriptPanel;