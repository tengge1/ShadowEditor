import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 编辑菜单
 * @author tengge / https://github.com/tengge1
 */
class EditMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleClearHistory = this.handleClearHistory.bind(this);
        this.handleClone = this.handleClone.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    render() {
        return <MenuItem title={L_EDIT}>
            <MenuItem title={`${L_UNDO}(Ctrl+Z)`} onClick={this.handleUndo}></MenuItem>
            <MenuItem title={`${L_REDO}(Ctrl+Y)`} onClick={this.handleRedo}></MenuItem>
            <MenuItem title={L_CLEAR_HISTORY} onClick={this.handleClearHistory}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_CLONE} onClick={this.handleClone}></MenuItem>
            <MenuItem title={`${L_DELETE}(Del)`} onClick={this.handleDelete}></MenuItem>
        </MenuItem>;
    }

    componentDidMount() {
        // app.on(`historyChanged.${this.id}`, this.onHistoryChanged.bind(this));
        // app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
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

        UI.confirm(L_CONFIRM, L_HISTORY_WILL_CLEAR, function (event, btn) {
            if (btn === 'ok') {
                editor.history.clear();
            }
        });
    }

    // -------------------------- 复制 -----------------------------------

    handleClone() {
        var editor = app.editor;
        var object = editor.selected;

        if (object == null || object.parent == null) { // 避免复制场景或相机
            return;
        }

        object = object.clone();
        editor.execute(new AddObjectCommand(object));
    }

    // ----------------------- 删除 -----------------------------------

    handleDelete() {
        var editor = app.editor;
        var object = editor.selected;

        if (object == null || object.parent == null) { // 避免删除场景或相机
            return;
        }

        UI.confirm(L_CONFIRM, L_DELETE + ' ' + object.name + '?', function (event, btn) {
            if (btn === 'ok') {
                editor.execute(new RemoveObjectCommand(object));
            }
        });
    }

    // ---------------------- 事件 -----------------------

    onHistoryChanged() {
        var history = app.editor.history;

        var undo = UI.get('undo', this.id);
        var redo = UI.get('redo', this.id);
        var clearHistory = UI.get('clearHistory', this.id);

        if (history.undos.length === 0) {
            undo.dom.classList.add('inactive');
        } else {
            undo.dom.classList.remove('inactive');
        }

        if (history.redos.length === 0) {
            redo.dom.classList.add('inactive');
        } else {
            redo.dom.classList.remove('inactive');
        }

        if (history.undos.length === 0 && history.redos.length === 0) {
            clearHistory.dom.classList.add('inactive');
        } else {
            clearHistory.dom.classList.remove('inactive');
        }
    }

    onObjectSelected() {
        var editor = app.editor;

        var clone = UI.get('clone', this.id);
        var deleteBtn = UI.get('delete', this.id);

        if (editor.selected && editor.selected.parent != null) {
            clone.dom.classList.remove('inactive');
            deleteBtn.dom.classList.remove('inactive');
        } else {
            clone.dom.classList.add('inactive');
            deleteBtn.dom.classList.add('inactive');
        }
    }
}

export default EditMenu;