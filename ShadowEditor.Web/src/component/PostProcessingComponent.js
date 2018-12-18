import BaseComponent from './BaseComponent';

/**
 * 后期处理组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PostProcessingComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PostProcessingComponent.prototype = Object.create(BaseComponent.prototype);
PostProcessingComponent.prototype.constructor = PostProcessingComponent;

PostProcessingComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'panel',
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
                text: '后期处理'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '背景'
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                }
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PostProcessingComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PostProcessingComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PostProcessingComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
    var scene = this.selected;
};

export default PostProcessingComponent;