import BaseComponent from '../BaseComponent';

/**
 * GIS基本组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function GisBasicComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

GisBasicComponent.prototype = Object.create(BaseComponent.prototype);
GisBasicComponent.prototype.constructor = GisBasicComponent;

GisBasicComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'panel',
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
                text: L_GIS_COMPONENT
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TILE_MAP
            }, {
                xtype: 'select',
                id: 'bakcground',
                scope: this.id,
                options: {
                    google: L_GOOGLE_MAP,
                    bing: L_BING_MAP,
                    tianditu: L_TIANDITU_MAP,
                },
                onChange: this.onChangeBackground.bind(this),
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

GisBasicComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

GisBasicComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

GisBasicComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected.userData.type === 'Globe') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var bakcground = UI.get('bakcground', this.id);

    bakcground.setValue(this.selected.getBackground());
};

GisBasicComponent.prototype.onChangeBackground = function () {
    var bakcground = UI.get('bakcground', this.id).getValue();
    this.selected.setBackground(bakcground);
};

export default GisBasicComponent;