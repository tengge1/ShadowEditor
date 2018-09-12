import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 渲染器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function RendererComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

RendererComponent.prototype = Object.create(BaseComponent.prototype);
RendererComponent.prototype.constructor = RendererComponent;

RendererComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'cameraPanel',
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
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '渲染器'
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

RendererComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

RendererComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

RendererComponent.prototype.updateUI = function () {
    var container = UI.get('cameraPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.PerspectiveCamera) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
};

export default RendererComponent;