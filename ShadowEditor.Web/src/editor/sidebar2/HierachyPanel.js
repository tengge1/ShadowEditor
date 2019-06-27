import UI from '../../ui/UI';
import MoveObjectCommand from '../../command/MoveObjectCommand';

/**
 * 场景层次图面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function HierachyPanel(options) {
    UI.Control.call(this, options);
};

HierachyPanel.prototype = Object.create(UI.Control.prototype);
HierachyPanel.prototype.constructor = HierachyPanel;

HierachyPanel.prototype.render = function () {
    var editor = app.editor;

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
            cls: 'Tree Hierachy',
            onClick: this.onClick.bind(this),
            onDblClick: this.onDblClick.bind(this),
            onDrag: this.onDrag.bind(this),
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`sceneGraphChanged.${this.id}`, this.updateUI.bind(this));

    // bug: https://gitee.com/tengge1/ShadowEditor/issues/ITCA9
    app.on(`objectChanged.${this.id}`, this.updateUI.bind(this));

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
};

/**
 * 单击树节点
 * @param {*} data 
 */
HierachyPanel.prototype.onClick = function (data) {
    app.editor.selectByUuid(data.value);
};

HierachyPanel.prototype.onDblClick = function (data) {
    app.editor.focusByUUID(data.value);
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
    var camera = app.editor.camera;
    var scene = app.editor.scene;

    var list = [{
        value: camera.uuid,
        text: camera.name,
        cls: 'Camera',
        children: []
    }];

    this._parseData(scene, list);

    var tree = UI.get('tree', this.id);
    tree.setValue(list);
};

HierachyPanel.prototype._parseData = function (obj, list) {
    var scene = app.editor.scene;

    var cls = null;

    if (obj === scene) {
        cls = 'Scene';
    } else if (obj instanceof THREE.Line) {
        cls = 'Line';
    } else if (obj instanceof THREE.Light) {
        cls = 'Light';
    } else if (obj instanceof THREE.Points) {
        cls = 'Points';
    } else {
        cls = 'Default';
    }

    var data = {
        value: obj.uuid,
        text: obj.name,
        expand: obj === scene,
        draggable: obj !== scene,
        cls: cls,
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

    var editor = app.editor;

    object = editor.objectByUuid(objData.value);
    newParent = editor.objectByUuid(newParentData.value);

    if (newBeforeData) {
        newBefore = editor.objectByUuid(newBeforeData.value);
    }

    app.editor.execute(new MoveObjectCommand(object, newParent, newBefore));

    var tree = UI.get('tree', this.id);
    tree.expand(newParentData.value);
};

export default HierachyPanel;