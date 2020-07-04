/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
            scripts: [],
            selected: null,
            expanded: {},
            mask: false
        };

        this.handleAddScript = this.handleAddScript.bind(this);
        this.handleAddFolder = this.handleAddFolder.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleEditScript = this.handleEditScript.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleDrop = this.handleDrop.bind(this);

        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
    }

    render() {
        const { scripts, selected, expanded, mask } = this.state;

        const tree = [];
        this.createScriptTree(0, tree, scripts, expanded);

        let script = null;
        if (selected !== null) {
            script = scripts.filter(n => n.uuid === selected)[0];
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
                <IconButton icon={'delete'}
                    title={_t('Delete')}
                    disabled={script === null}
                    onClick={this.handleDelete}
                />
                <ToolbarSeparator />
                <IconButton icon={'edit'}
                    title={_t('Edit Script')}
                    disabled={script === null || script.type === 'folder'}
                    onClick={this.handleEditScript}
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

        list.sort((a, b) => {
            if (!a.sort) {
                a.sort = 0;
            }
            if (!b.sort) {
                b.sort = 0;
            }
            return a.sort - b.sort;
        });

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
                app.editor.scripts.push({
                    id: null,
                    pid: null,
                    name: value,
                    type: 'folder',
                    uuid: THREE.Math.generateUUID(),
                    sort: 0
                });

                app.call(`scriptChanged`, this);
            }
        });
    }

    handleEdit() {
        const selected = this.state.selected;
        if (selected === null) {
            return;
        }
        var script = app.editor.scripts.filter(n => n.uuid === selected)[0];

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

    handleDelete() {
        const selected = this.state.selected;
        if (selected === null) {
            return;
        }

        const script = app.editor.scripts.filter(n => n.uuid === selected)[0];

        app.confirm({
            title: _t('Confirm'),
            content: `${_t('Delete')} ${script.name}.${this.getExtension(script.type)}?`,
            onOK: () => {
                delete app.editor.scripts[script.uuid];
                app.call('scriptChanged', this);
            }
        });
    }

    handleEditScript() {
        const selected = this.state.selected;
        if (selected === null) {
            return;
        }
        var script = app.editor.scripts.filter(n => n.uuid === selected)[0];
        if (script) {
            app.call(`editScript`, this, script.uuid, script.name, script.type, script.source, this.save);
        }
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

        if (newParent) {
            let parent = scripts.filter(n => n.uuid === newParent)[0];
            if (parent.type !== 'folder') {
                app.toast(_t('It is not allowed to drop on another script.'));
                return;
            }
        }

        let currentScript = scripts.filter(n => n.uuid === current)[0];
        currentScript.pid = newParent;

        // 排序
        if (!newParent) {
            scripts = scripts.filter(n => !n.pid && n !== currentScript);
        } else {
            scripts = scripts.filter(n => n.pid === newParent && n !== currentScript);
        }

        let index = scripts.findIndex(n => n.uuid === newIndex);
        scripts.splice(index, 0, currentScript);

        scripts.forEach((n, i) => {
            n.sort = i;
        });

        app.call(`scriptChanged`, this);
    }

    save(uuid, name, type, source) {
        const index = app.editor.scripts.findIndex(n => n.uuid === uuid);

        if (index > -1) {
            app.editor.scripts[index] = {
                id: null,
                uuid,
                name,
                type,
                source
            };
        } else {
            app.editor.scripts.push({
                id: null,
                uuid,
                name,
                type,
                source
            });
        }

        app.call(`scriptChanged`, this);
    }
}

export default ScriptPanel;