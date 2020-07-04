/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { ToolbarSeparator, IconButton } from '../../ui/index';

/**
 * 编辑工具
 * @author tengge / https://github.com/tengge1
 */
class EditTools extends React.Component {
    constructor(props) {
        super(props);

        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleClearHistory = this.handleClearHistory.bind(this);
        this.onHistoryChanged = this.onHistoryChanged.bind(this);
        this.onObjectSelected = this.onObjectSelected.bind(this);
    }

    render() {
        const editor = app.editor;
        const history = editor.history;

        const enableUndo = history.undos.length > 0;
        const enableRedo = history.redos.length > 0;
        const enableClearHistory = history.undos.length > 0 || history.redos.length > 0;
        const enableClone = editor.selected && editor.selected.parent !== null;
        const enableDelete = editor.selected && editor.selected.parent !== null;

        return <>
            <IconButton
                icon={'undo'}
                title={`${_t('Undo')}(Ctrl+Z)`}
                disabled={!enableUndo}
                onClick={this.handleUndo}
            />
            <IconButton
                icon={'redo'}
                title={`${_t('Redo')}(Ctrl+Y)`}
                disabled={!enableRedo}
                onClick={this.handleRedo}
            />
            <IconButton
                icon={'history'}
                title={_t('Clear History')}
                disabled={!enableClearHistory}
                onClick={this.handleClearHistory}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'duplicate'}
                title={`${_t('Clone')}(Ctrl+C)`}
                disabled={!enableClone}
                onClick={this.handleCopy}
            />
            <IconButton
                icon={'delete'}
                title={`${_t('Delete')}(Delete)`}
                disabled={!enableDelete}
                onClick={this.handleDelete}
            />
            <ToolbarSeparator />
        </>;
    }

    componentDidMount() {
        app.on(`historyChanged.EditMenu`, this.onHistoryChanged);
        app.on(`objectSelected.EditMenu`, this.onObjectSelected);
    }

    handleUndo() {
        app.call(`undo`, this);
    }

    handleRedo() {
        app.call(`redo`, this);
    }

    handleClearHistory() {
        app.call(`clearHistory`, this);
    }

    handleCopy() {
        app.call(`clone`, this);
    }

    handleDelete() {
        app.call(`delete`, this);
    }

    onHistoryChanged() {
        this.forceUpdate();
    }

    onObjectSelected() {
        this.forceUpdate();
    }
}

export default EditTools;