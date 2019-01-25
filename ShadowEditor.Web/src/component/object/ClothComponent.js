import BaseComponent from '../BaseComponent';

/**
 * 布组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ClothComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;

    this.isPlaying = false;
}

ClothComponent.prototype = Object.create(BaseComponent.prototype);
ClothComponent.prototype.constructor = ClothComponent;

ClothComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'clothPanel',
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
            text: L_CLOTH_COMPONENT
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

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ClothComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ClothComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ClothComponent.prototype.updateUI = function () {
    var container = UI.get('clothPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'Cloth') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var btnPreview = UI.get('btnPreview', this.id);

    if (this.isPlaying) {
        btnPreview.setText(L_CANCEL);
    } else {
        btnPreview.setText(L_PREVIEW);
    }
};

ClothComponent.prototype.onPreview = function () {
    if (this.isPlaying) {
        this.stopPreview();
    } else {
        this.startPreview();
    }
};

ClothComponent.prototype.startPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = true;
    btnPreview.setText(L_CANCEL);

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

ClothComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText(L_PREVIEW);

    this.app.on(`animate.${this.id}`, null);
};

ClothComponent.prototype.onAnimate = function (clock, deltaTime) {
    this.selected.update();
};

export default ClothComponent;