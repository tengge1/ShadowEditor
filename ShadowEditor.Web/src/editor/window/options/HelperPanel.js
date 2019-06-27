import UI from '../../../ui/UI';

/**
 * 帮助选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HelperPanel(options) {
    UI.Control.call(this, options);
}

HelperPanel.prototype = Object.create(UI.Control.prototype);
HelperPanel.prototype.constructor = HelperPanel;

HelperPanel.prototype.render = function () {
    UI.create({
        xtype: 'div',
        id: 'panel',
        scope: this.id,
        parent: this.parent,
        style: this.style,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_GRID
            }, {
                xtype: 'boolean',
                id: 'showGrid',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_CAMERA
            }, {
                xtype: 'boolean',
                id: 'showCamera',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_POINT_LIGHT
            }, {
                xtype: 'boolean',
                id: 'showPointLight',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_DIRECTIONAL_LIGHT
            }, {
                xtype: 'boolean',
                id: 'showDirectionalLight',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SPOT_LIGHT
            }, {
                xtype: 'boolean',
                id: 'showSpotLight',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_HEMISPHERE_LIGHT
            }, {
                xtype: 'boolean',
                id: 'showHemisphereLight',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_RECT_AREA_LIGHT
            }, {
                xtype: 'boolean',
                id: 'showRectAreaLight',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SKELETON
            }, {
                xtype: 'boolean',
                id: 'showSkeleton',
                scope: this.id,
                onChange: this.save.bind(this)
            }]
        }]
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

HelperPanel.prototype.update = function () {
    var showGrid = UI.get('showGrid', this.id);
    showGrid.setValue(app.storage.get('showGrid') === true);

    var showCamera = UI.get('showCamera', this.id);
    showCamera.setValue(app.storage.get('showCamera') === true);

    var showPointLight = UI.get('showPointLight', this.id);
    showPointLight.setValue(app.storage.get('showPointLight') === true);

    var showDirectionalLight = UI.get('showDirectionalLight', this.id);
    showDirectionalLight.setValue(app.storage.get('showDirectionalLight') === true);

    var showSpotLight = UI.get('showSpotLight', this.id);
    showSpotLight.setValue(app.storage.get('showSpotLight') === true);

    var showHemisphereLight = UI.get('showHemisphereLight', this.id);
    showHemisphereLight.setValue(app.storage.get('showHemisphereLight') === true);

    var showRectAreaLight = UI.get('showRectAreaLight', this.id);
    showRectAreaLight.setValue(app.storage.get('showRectAreaLight') === true);

    var showSkeleton = UI.get('showSkeleton', this.id);
    showSkeleton.setValue(app.storage.get('showSkeleton') === true);
};

HelperPanel.prototype.save = function () {
    var showGrid = UI.get('showGrid', this.id).getValue();
    if (showGrid !== app.storage.get('showGrid')) {
        app.storage.set('showGrid', showGrid);
        app.call(`storageChanged`, this, 'showGrid', showGrid);
    }

    var showCamera = UI.get('showCamera', this.id).getValue();
    if (showCamera !== app.storage.get('showCamera')) {
        app.storage.set('showCamera', showCamera);
        app.call(`storageChanged`, this, 'showCamera', showCamera);
    }

    var showPointLight = UI.get('showPointLight', this.id).getValue();
    if (showPointLight !== app.storage.get('showPointLight')) {
        app.storage.set('showPointLight', showPointLight);
        app.call(`storageChanged`, this, 'showPointLight', showPointLight);
    }

    var showDirectionalLight = UI.get('showDirectionalLight', this.id).getValue();
    if (showDirectionalLight !== app.storage.get('showDirectionalLight')) {
        app.storage.set('showDirectionalLight', showDirectionalLight);
        app.call(`storageChanged`, this, 'showDirectionalLight', showDirectionalLight);
    }

    var showSpotLight = UI.get('showSpotLight', this.id).getValue();
    if (showSpotLight !== app.storage.get('showSpotLight')) {
        app.storage.set('showSpotLight', showSpotLight);
        app.call(`storageChanged`, this, 'showSpotLight', showSpotLight);
    }

    var showHemisphereLight = UI.get('showHemisphereLight', this.id).getValue();
    if (showHemisphereLight !== app.storage.get('showHemisphereLight')) {
        app.storage.set('showHemisphereLight', showHemisphereLight);
        app.call(`storageChanged`, this, 'showHemisphereLight', showHemisphereLight);
    }

    var showRectAreaLight = UI.get('showRectAreaLight', this.id).getValue();
    if (showRectAreaLight !== app.storage.get('showRectAreaLight')) {
        app.storage.set('showRectAreaLight', showRectAreaLight);
        app.call(`storageChanged`, this, 'showRectAreaLight', showRectAreaLight);
    }

    var showSkeleton = UI.get('showSkeleton', this.id).getValue();
    if (showSkeleton !== app.storage.get('showSkeleton')) {
        app.storage.set('showSkeleton', showSkeleton);
        app.call(`storageChanged`, this, 'showSkeleton', showSkeleton);
    }
};

export default HelperPanel;