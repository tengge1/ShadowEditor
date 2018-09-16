import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';
import RemoveObjectCommand from '../command/RemoveObjectCommand';
import AddObjectCommand from '../command/AddObjectCommand';

/**
 * 基本信息组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BasicComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

BasicComponent.prototype = Object.create(BaseComponent.prototype);
BasicComponent.prototype.constructor = BasicComponent;

BasicComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'basicPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '基本信息'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'name',
                scope: this.id,
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: this.onChangeName.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'text',
                id: 'type',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '可见性'
            }, {
                xtype: 'checkbox',
                id: 'visible',
                scope: this.id,
                onChange: this.onChangeVisible.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'reflectRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '反光'
            }, {
                xtype: 'checkbox',
                id: 'reflect',
                scope: this.id,
                onChange: this.onChangeReflect.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'colorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '颜色'
            }, {
                xtype: 'color',
                id: 'color',
                scope: this.id,
                value: 0xffffff,
                onChange: this.onChangeReflect.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'sizeRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '贴图尺寸'
            }, {
                xtype: 'select',
                id: 'size',
                scope: this.id,
                options: {
                    512: '512*512',
                    1024: '1024*1024',
                    2018: '2048*2048'
                },
                value: '1024',
                onChange: this.onChangeReflect.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'clipBiasRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '裁剪偏移'
            }, {
                xtype: 'number',
                id: 'clipBias',
                scope: this.id,
                value: 0,
                onChange: this.onChangeReflect.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'recursionRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '递归'
            }, {
                xtype: 'checkbox',
                id: 'recursion',
                scope: this.id,
                value: false,
                onChange: this.onChangeReflect.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

BasicComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

BasicComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

BasicComponent.prototype.updateUI = function () {
    var container = UI.get('basicPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var reflectRow = UI.get('reflectRow', this.id);
    var colorRow = UI.get('colorRow', this.id);
    var sizeRow = UI.get('sizeRow', this.id);
    var clipBiasRow = UI.get('clipBiasRow', this.id);
    var recursionRow = UI.get('recursionRow', this.id);

    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var visible = UI.get('visible', this.id);
    var reflect = UI.get('reflect', this.id);
    var color = UI.get('color', this.id);
    var size = UI.get('size', this.id);
    var clipBias = UI.get('clipBias', this.id);
    var recursion = UI.get('recursion', this.id);

    if (this.selected instanceof THREE.Mesh) {
        reflectRow.dom.style.display = '';
    } else {
        reflectRow.dom.style.display = 'none';
    }

    name.setValue(this.selected.name);
    type.setValue(this.selected.constructor.name);
    visible.setValue(this.selected.visible);
    reflect.setValue(this.selected instanceof THREE.Reflector);

    if (this.selected instanceof THREE.Reflector) {
        colorRow.dom.style.display = '';
        sizeRow.dom.style.display = '';
        clipBiasRow.dom.style.display = '';
        recursionRow.dom.style.display = '';
        color.setHexValue(this.selected.userData.color);
        size.setValue(this.selected.userData.size);
        clipBias.setValue(this.selected.userData.clipBias);
        recursion.setValue(this.selected.userData.recursion);
    } else {
        colorRow.dom.style.display = 'none';
        sizeRow.dom.style.display = 'none';
        clipBiasRow.dom.style.display = 'none';
        recursionRow.dom.style.display = 'none';
    }
};

BasicComponent.prototype.onChangeName = function () {
    var name = UI.get('name', this.id);
    var editor = this.app.editor;

    editor.execute(new SetValueCommand(this.selected, 'name', name.getValue()));
};

BasicComponent.prototype.onChangeVisible = function () {
    this.selected.visible = UI.get('visible', this.id).getValue();
};

BasicComponent.prototype.onChangeReflect = function () {
    var reflect = UI.get('reflect', this.id);
    var color = UI.get('color', this.id);
    var size = UI.get('size', this.id);
    var clipBias = UI.get('clipBias', this.id);
    var recursion = UI.get('recursion', this.id);

    var editor = this.app.editor;

    if (reflect.getValue()) {
        var reflector = new THREE.Reflector(this.selected.geometry, {
            color: color.getHexValue(),
            textureWidth: parseInt(size.getValue()),
            textureHeight: parseInt(size.getValue()),
            clipBias: clipBias.getValue(),
            recursion: recursion.getValue() ? 1 : 0
        });

        reflector.name = this.selected.name;
        reflector.position.copy(this.selected.position);
        reflector.rotation.copy(this.selected.rotation);
        reflector.scale.copy(this.selected.scale);
        reflector.castShadow = this.selected.castShadow;
        reflector.receiveShadow = this.selected.receiveShadow;

        if (this.selected instanceof THREE.Reflector) {
            Object.assign(reflector.userData, this.selected.userData);
        } else {
            Object.assign(reflector.userData, this.selected.userData, {
                mesh: this.selected
            });
        }

        reflector.userData.color = color.getHexValue();
        reflector.userData.size = size.getValue();
        reflector.userData.clipBias = clipBias.getValue();
        reflector.userData.recursion = recursion.getValue();

        var index = editor.scene.children.indexOf(this.selected);
        if (index > -1) {
            editor.scene.children[index] = reflector;
            reflector.parent = this.selected.parent;
            this.selected.parent = null;
            this.app.call(`objectRemoved`, this, this.selected);
            this.app.call(`objectAdded`, this, reflector);
            editor.select(reflector);
            this.app.call('sceneGraphChanged', this.id);
        }
    } else {
        if (this.selected instanceof THREE.Reflector) {
            var mesh = this.selected.userData.mesh;
            this.selected.userData.mesh = null;

            mesh.name = this.selected.name;
            mesh.position.copy(this.selected.position);
            mesh.rotation.copy(this.selected.rotation);
            mesh.scale.copy(this.selected.scale);
            mesh.castShadow = this.selected.castShadow;
            mesh.receiveShadow = this.selected.receiveShadow;

            Object.assign(mesh.userData, this.selected.userData);

            var index = editor.scene.children.indexOf(this.selected);
            if (index > -1) {
                editor.scene.children[index] = mesh;
                mesh.parent = this.selected.parent;
                this.selected.parent = null;
                this.app.call(`objectRemoved`, this, this.selected);
                this.app.call(`objectAdded`, this, mesh);
                editor.select(mesh);
                this.app.call('sceneGraphChanged', this.id);
            }
        }
    }
};

export default BasicComponent;