import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 场景组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SceneComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SceneComponent.prototype = Object.create(BaseComponent.prototype);
SceneComponent.prototype.constructor = SceneComponent;

SceneComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'scenePanel',
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
                text: '场景组件'
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SceneComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SceneComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SceneComponent.prototype.updateUI = function () {
    var container = UI.get('scenePanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
};

export default SceneComponent;