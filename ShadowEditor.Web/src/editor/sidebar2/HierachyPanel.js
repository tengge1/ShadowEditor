import UI from '../../ui/UI';
import MoveObjectCommand from '../../command/MoveObjectCommand';

/**
 * 场景层次图面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function HierachyPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

HierachyPanel.prototype = Object.create(UI.Control.prototype);
HierachyPanel.prototype.constructor = HierachyPanel;

HierachyPanel.prototype.render = function () {
    var editor = this.app.editor;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        style: {
            height: 'calc(50% - 40px)',
            borderTop: 0,
            overflowY: 'auto',
        },
        children: [{
            xtype: 'tree',
            id: 'tree',
            scope: this.id,
            onClick: this.onClick.bind(this),
            onDblClick: this.onDblClick.bind(this),
            onDrag: this.onDrag.bind(this),
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`sceneGraphChanged.${this.id}`, this.updateUI.bind(this));
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
};

/**
 * 单击树节点
 * @param {*} data 
 */
HierachyPanel.prototype.onClick = function (data) {
    this.app.editor.selectByUuid(data.value);
};

HierachyPanel.prototype.onDblClick = function (data) {
    this.app.editor.focusByUUID(data.value);
};

/**
 * 选中物体改变
 * @param {*} object 
 */
HierachyPanel.prototype.onObjectSelected = function (object) {
    var tree = UI.get('tree', this.id);

    if (!object) {
        var selected = tree.getSelected();
        if (selected) {
            tree.unselect(selected.value);
        }
        return;
    }

    tree.select(object.uuid);
};

/**
 * 根据场景变化，更新场景树状图
 */
HierachyPanel.prototype.updateUI = function () {
    var camera = this.app.editor.camera;
    var scene = this.app.editor.scene;

    var list = [{
        value: camera.uuid,
        text: camera.name,
        children: []
    }];

    this._parseData(scene, list);

    var tree = UI.get('tree', this.id);
    tree.setValue(list);
};

HierachyPanel.prototype._parseData = function (obj, list) {
    var scene = this.app.editor.scene;

    var data = {
        value: obj.uuid,
        text: obj.name,
        expand: obj === scene,
        draggable: obj !== scene,
        children: []
    };
    list.push(data);

    if (Array.isArray(obj.children)) {
        obj.children.forEach(n => {
            this._parseData(n, data.children);
        });
    }
};

/**
 * 拖动节点
 */
HierachyPanel.prototype.onDrag = function (objData, newParentData, newBeforeData) {
    var object, newParent, newBefore;

    var editor = this.app.editor;

    object = editor.objectByUuid(objData.value);
    newParent = editor.objectByUuid(newParentData.value);

    if (newBeforeData) {
        newBefore = editor.objectByUuid(newBeforeData.value);
    }

    this.app.editor.execute(new MoveObjectCommand(object, newParent, newBefore));
};

export default HierachyPanel;