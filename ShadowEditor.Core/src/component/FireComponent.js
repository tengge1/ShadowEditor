import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 火焰组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FireComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;

    this.isPlaying = false;
}

FireComponent.prototype = Object.create(BaseComponent.prototype);
FireComponent.prototype.constructor = FireComponent;

FireComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'firePanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'label',
            style: {
                width: '100%',
                color: '#555',
                fontWeight: 'bold'
            },
            text: '火焰组件'
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度'
            }, {
                xtype: 'int',
                id: 'width',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度'
            }, {
                xtype: 'int',
                id: 'height',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '深度'
            }, {
                xtype: 'int',
                id: 'depth',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '切片厚度'
            }, {
                xtype: 'number',
                id: 'sliceSpacing',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label'
            }, {
                xtype: 'button',
                id: 'btnPreview',
                scope: this.id,
                text: '预览',
                onClick: this.onPreview.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

FireComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

FireComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

FireComponent.prototype.updateUI = function () {
    var container = UI.get('firePanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'Fire') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var width = UI.get('width', this.id);
    var height = UI.get('height', this.id);
    var depth = UI.get('depth', this.id);
    var sliceSpacing = UI.get('sliceSpacing', this.id);
    var btnPreview = UI.get('btnPreview', this.id);

    var fire = this.selected.userData.fire;
    width.setValue(fire.mesh.userData.width);
    height.setValue(fire.mesh.userData.height);
    depth.setValue(fire.mesh.userData.depth);
    sliceSpacing.setValue(fire.mesh.userData.sliceSpacing);

    if (this.isPlaying) {
        btnPreview.setText('取消');
    } else {
        btnPreview.setText('预览');
    }
};

FireComponent.prototype.onChange = function () {
    var width = UI.get('width', this.id);
    var height = UI.get('height', this.id);
    var depth = UI.get('depth', this.id);
    var sliceSpacing = UI.get('sliceSpacing', this.id);

    VolumetricFire.texturePath = 'assets/textures/VolumetricFire/';

    var editor = this.app.editor;

    var fire = new VolumetricFire(
        width.getValue(),
        height.getValue(),
        depth.getValue(),
        sliceSpacing.getValue(),
        editor.camera
    );

    fire.mesh.name = this.selected.name;
    fire.mesh.position.copy(this.selected.position);
    fire.mesh.rotation.copy(this.selected.rotation);
    fire.mesh.scale.copy(this.selected.scale);

    fire.mesh.userData.type = 'Fire';
    fire.mesh.userData.fire = fire;
    fire.mesh.userData.width = width.getValue();
    fire.mesh.userData.height = height.getValue();
    fire.mesh.userData.depth = depth.getValue();
    fire.mesh.userData.sliceSpacing = sliceSpacing.getValue();

    var index = editor.scene.children.indexOf(this.selected);
    if (index > -1) {
        editor.scene.children[index] = fire.mesh;
        fire.mesh.parent = this.selected.parent;
        this.selected.parent = null;
        this.app.call(`objectRemoved`, this, this.selected);
        this.app.call(`objectAdded`, this, fire.mesh);
        editor.select(fire.mesh);
        this.app.call('sceneGraphChanged', this.id);

        fire.update(0);
    }
};

FireComponent.prototype.onPreview = function () {
    if (this.isPlaying) {
        this.stopPreview();
    } else {
        this.startPreview();
    }
};

FireComponent.prototype.startPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = true;
    btnPreview.setText('取消');

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

FireComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText('预览');

    this.app.on(`animate.${this.id}`, null);
};

FireComponent.prototype.onAnimate = function (clock, deltaTime) {
    var elapsed = clock.getElapsedTime();

    var fire = this.selected.userData.fire;
    fire.update(elapsed);
};

export default FireComponent;