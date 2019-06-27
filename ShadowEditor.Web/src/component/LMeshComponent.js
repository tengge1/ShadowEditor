import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';
import RemoveObjectCommand from '../command/RemoveObjectCommand';
import AddObjectCommand from '../command/AddObjectCommand';

/**
 * LMesh组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function LMeshComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;

    this.isPlaying = false;
}

LMeshComponent.prototype = Object.create(BaseComponent.prototype);
LMeshComponent.prototype.constructor = LMeshComponent;

LMeshComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'lmeshPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    width: '100%',
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: L_LMESH_COMPONENT
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ANIMATION
            }, {
                xtype: 'select',
                id: 'anims',
                scope: this.id,
                onChange: this.onSelectAnim.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label'
            }, {
                xtype: 'button',
                id: 'btnPreview',
                scope: this.id,
                text: L_PREVIEW,
                onClick: this.onPreview.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

LMeshComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

LMeshComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

LMeshComponent.prototype.updateUI = function () {
    var container = UI.get('lmeshPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected.userData.type === 'lol') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var anims = UI.get('anims', this.id);
    var btnPreview = UI.get('btnPreview', this.id);

    var model = this.selected.userData.model;
    var animNames = model.getAnimations();

    var options = {

    };

    animNames.forEach(n => {
        options[n] = n;
    });

    anims.setOptions(options);
    anims.setValue(animNames[0]);

    if (this.isPlaying) {
        btnPreview.setText('取消');
    } else {
        btnPreview.setText('预览');
    }
};

LMeshComponent.prototype.onSelectAnim = function () {
    var anims = UI.get('anims', this.id);

    var model = this.selected.userData.model;
    model.setAnimation(anims.getValue());
};

LMeshComponent.prototype.onPreview = function () {
    if (this.isPlaying) {
        this.stopPreview();
    } else {
        this.startPreview();
    }
};

LMeshComponent.prototype.startPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = true;
    btnPreview.setText('取消');

    this.onSelectAnim();

    app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

LMeshComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText('预览');

    app.on(`animate.${this.id}`, null);
};

LMeshComponent.prototype.onAnimate = function (clock, deltaTime) {
    var model = this.selected.userData.model;
    model.update(clock.getElapsedTime() * 1000);
};

export default LMeshComponent;