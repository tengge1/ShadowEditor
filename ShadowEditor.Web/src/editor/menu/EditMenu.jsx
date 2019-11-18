import { MenuItem, MenuItemSeparator } from '../../third_party';
import AddObjectCommand from '../../command/AddObjectCommand';
import RemoveObjectCommand from '../../command/RemoveObjectCommand';

/**
 * 编辑菜单
 * @author tengge / https://github.com/tengge1
 */
class EditMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            enableUndo: false,
            enableRedo: false,
            enableClearHistory: false,
            enableClone: false,
            enableDelete: false
        };

        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleClearHistory = this.handleClearHistory.bind(this);
        this.handleClone = this.handleClone.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.onHistoryChanged = this.onHistoryChanged.bind(this);
        this.onObjectSelected = this.onObjectSelected.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    render() {
        const { enableUndo, enableRedo, enableClearHistory, enableClone, enableDelete } = this.state;

        return <MenuItem title={_t('Edit')}>
            <MenuItem title={`${_t('Undo')}(Ctrl+Z)`}
                disabled={!enableUndo}
                onClick={this.handleUndo}
            />
            <MenuItem title={`${_t('Redo')}(Ctrl+Y)`}
                disabled={!enableRedo}
                onClick={this.handleRedo}
            />
            <MenuItem title={_t('Clear History')}
                disabled={!enableClearHistory}
                onClick={this.handleClearHistory}
            />
            <MenuItemSeparator />
            <MenuItem title={`${_t('Clone')}(Ctrl+C)`}
                disabled={!enableClone}
                onClick={this.handleClone}
            />
            <MenuItem title={`${_t('Delete')}(Delete)`}
                disabled={!enableDelete}
                onClick={this.handleDelete}
            />
        </MenuItem>;
    }

    componentDidMount() {
        app.on(`historyChanged.EditMenu`, this.onHistoryChanged);
        app.on(`objectSelected.EditMenu`, this.onObjectSelected);
        app.on(`keydown.EditMenu`, this.onKeyDown);
    }

    // --------------------- 撤销 --------------------------

    handleUndo() {
        var history = app.editor.history;

        if (history.undos.length === 0) {
            return;
        }

        app.editor.undo();
    }

    // --------------------- 重做 -----------------------------

    handleRedo() {
        var history = app.editor.history;

        if (history.redos.length === 0) {
            return;
        }

        app.editor.redo();
    }

    // -------------------- 清空历史记录 --------------------------------

    handleClearHistory() {
        var editor = app.editor;
        var history = editor.history;

        if (history.undos.length === 0 && history.redos.length === 0) {
            return;
        }

        app.confirm({
            title: _t('Confirm'),
            content: _t('Undo/Redo history will be cleared. Are you sure?'),
            onOK: () => {
                editor.history.clear();
            }
        });
    }

    // -------------------------- 复制 -----------------------------------

    handleClone() {
        var editor = app.editor;
        var object = editor.selected;

        if (object === null || object.parent === null) { // 避免复制场景或相机
            return;
        }

        object = object.clone();
        editor.execute(new AddObjectCommand(object));
    }

    // ----------------------- 删除 -----------------------------------

    handleDelete() {
        var editor = app.editor;
        var object = editor.selected;

        if (object === null || object.parent === null) { // 避免删除场景或相机
            return;
        }

        app.confirm({
            title: _t('Confirm'),
            content: _t('Delete') + ' ' + object.name + '?',
            onOK: () => {
                editor.execute(new RemoveObjectCommand(object));
            }
        });
    }

    // 快捷键
    onKeyDown(event) {
        if (event.keyCode === 46) { // 删除键
            this.handleDelete();
        } else if (event.keyCode === 67) { // c键
            this.handleClone();
        } else if (event.keyCode === 89) { // y键
            event.ctrlKey && this.handleRedo();
        } else if (event.keyCode === 90) { // z键
            event.ctrlKey && this.handleUndo();
        }
    }

    // ---------------------- 事件 -----------------------

    onHistoryChanged() {
        const history = app.editor.history;

        this.setState({
            enableUndo: history.undos.length > 0,
            enableRedo: history.redos.length > 0,
            enableClearHistory: history.undos.length > 0 || history.redos.length > 0
        });
    }

    onObjectSelected() {
        const editor = app.editor;

        this.setState({
            enableClone: editor.selected && editor.selected.parent !== null,
            enableDelete: editor.selected && editor.selected.parent !== null
        });
    }
}

export default EditMenu;