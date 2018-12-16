import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';
import RemoveObjectCommand from '../command/RemoveObjectCommand';
import AddObjectCommand from '../command/AddObjectCommand';
// import MMDWindow from '../editor/window/MMDWindow';

/**
 * MMD模型组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MMDComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

MMDComponent.prototype = Object.create(BaseComponent.prototype);
MMDComponent.prototype.constructor = MMDComponent;

MMDComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'mmdPanel',
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
                text: 'MMD模型'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '模型动画'
            }, {
                xtype: 'input',
                id: 'animation',
                scope: this.id,
                disabled: true,
                style: {
                    width: '80px',
                    fontSize: '12px'
                }
            }, {
                xtype: 'button',
                text: '选择',
                onClick: this.selectAnimation.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

MMDComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

MMDComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

MMDComponent.prototype.updateUI = function () {
    var container = UI.get('mmdPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && (editor.selected.userData.Type === 'pmd' || editor.selected.userData.Type === 'pmx')) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var animation = UI.get('animation', this.id);

    if (this.selected.userData.Animation) {
        animation.setValue(this.selected.userData.Animation.Name);
    }
};

MMDComponent.prototype.selectAnimation = function () {
    // if (this.mmdWindow === undefined) {
    //     this.mmdWindow = new MMDWindow({
    //         app: this.app,
    //         onSelect: this.onSelectAnimation.bind(this)
    //     });
    //     this.mmdWindow.render();
    // }
    // this.mmdWindow.show();
};

MMDComponent.prototype.onSelectAnimation = function (data) {
    this.selected.userData.Animation = {};
    Object.assign(this.selected.userData.Animation, data);
    this.updateUI();
};

export default MMDComponent;