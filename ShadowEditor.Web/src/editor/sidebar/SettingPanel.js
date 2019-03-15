import UI from '../../ui/UI';

/**
 * 设置面板
 * @author tengge / https://github.com/tengge1
 */
function SettingPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

SettingPanel.prototype = Object.create(UI.Control.prototype);
SettingPanel.prototype.constructor = SettingPanel;

SettingPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            paddingTop: '20px'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: L_HELPERS
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_GRID
            }, {
                xtype: 'boolean',
                id: 'showGrid',
                scope: this.id,
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
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
                onChange: this.update.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    // 为各种设置设定默认值
    if (this.app.storage.get('showGrid') === null) {
        this.app.storage.set('showGrid', true);
    }

    if (this.app.storage.get('showCamera') === null) {
        this.app.storage.set('showCamera', false);
    }

    if (this.app.storage.get('showPointLight') === null) {
        this.app.storage.set('showPointLight', true);
    }

    if (this.app.storage.get('showDirectionalLight') === null) {
        this.app.storage.set('showDirectionalLight', true);
    }

    if (this.app.storage.get('showSpotLight') === null) {
        this.app.storage.set('showSpotLight', true);
    }

    if (this.app.storage.get('showHemisphereLight') === null) {
        this.app.storage.set('showHemisphereLight', true);
    }

    if (this.app.storage.get('showRectAreaLight') === null) {
        this.app.storage.set('showRectAreaLight', true);
    }

    if (this.app.storage.get('showSkeleton') === null) {
        this.app.storage.set('showSkeleton', false);
    }

    this.app.on(`tabSelected.${this.id}`, this.onTabSelected.bind(this));
};

SettingPanel.prototype.onTabSelected = function (tabName) {
    if (tabName !== 'setting') {
        return;
    }

    var showGrid = UI.get('showGrid', this.id);
    showGrid.setValue(this.app.storage.get('showGrid') === true);

    var showCamera = UI.get('showCamera', this.id);
    showCamera.setValue(this.app.storage.get('showCamera') === true);

    var showPointLight = UI.get('showPointLight', this.id);
    showPointLight.setValue(this.app.storage.get('showPointLight') === true);

    var showDirectionalLight = UI.get('showDirectionalLight', this.id);
    showDirectionalLight.setValue(this.app.storage.get('showDirectionalLight') === true);

    var showSpotLight = UI.get('showSpotLight', this.id);
    showSpotLight.setValue(this.app.storage.get('showSpotLight') === true);

    var showHemisphereLight = UI.get('showHemisphereLight', this.id);
    showHemisphereLight.setValue(this.app.storage.get('showHemisphereLight') === true);

    var showRectAreaLight = UI.get('showRectAreaLight', this.id);
    showRectAreaLight.setValue(this.app.storage.get('showRectAreaLight') === true);

    var showSkeleton = UI.get('showSkeleton', this.id);
    showSkeleton.setValue(this.app.storage.get('showSkeleton') === true);
};

SettingPanel.prototype.update = function () {
    // 帮助器
    var showGrid = UI.get('showGrid', this.id).getValue();
    if (showGrid !== this.app.storage.get('showGrid')) {
        this.app.storage.set('showGrid', showGrid);
        this.app.call(`storageChanged`, this, 'showGrid', showGrid);
    }

    var showCamera = UI.get('showCamera', this.id).getValue();
    if (showCamera !== this.app.storage.get('showCamera')) {
        this.app.storage.set('showCamera', showCamera);
        this.app.call(`storageChanged`, this, 'showCamera', showCamera);
    }

    var showPointLight = UI.get('showPointLight', this.id).getValue();
    if (showPointLight !== this.app.storage.get('showPointLight')) {
        this.app.storage.set('showPointLight', showPointLight);
        this.app.call(`storageChanged`, this, 'showPointLight', showPointLight);
    }

    var showDirectionalLight = UI.get('showDirectionalLight', this.id).getValue();
    if (showDirectionalLight !== this.app.storage.get('showDirectionalLight')) {
        this.app.storage.set('showDirectionalLight', showDirectionalLight);
        this.app.call(`storageChanged`, this, 'showDirectionalLight', showDirectionalLight);
    }

    var showSpotLight = UI.get('showSpotLight', this.id).getValue();
    if (showSpotLight !== this.app.storage.get('showSpotLight')) {
        this.app.storage.set('showSpotLight', showSpotLight);
        this.app.call(`storageChanged`, this, 'showSpotLight', showSpotLight);
    }

    var showHemisphereLight = UI.get('showHemisphereLight', this.id).getValue();
    if (showHemisphereLight !== this.app.storage.get('showHemisphereLight')) {
        this.app.storage.set('showHemisphereLight', showHemisphereLight);
        this.app.call(`storageChanged`, this, 'showHemisphereLight', showHemisphereLight);
    }

    var showRectAreaLight = UI.get('showRectAreaLight', this.id).getValue();
    if (showRectAreaLight !== this.app.storage.get('showRectAreaLight')) {
        this.app.storage.set('showRectAreaLight', showRectAreaLight);
        this.app.call(`storageChanged`, this, 'showRectAreaLight', showRectAreaLight);
    }

    var showSkeleton = UI.get('showSkeleton', this.id).getValue();
    if (showSkeleton !== this.app.storage.get('showSkeleton')) {
        this.app.storage.set('showSkeleton', showSkeleton);
        this.app.call(`storageChanged`, this, 'showSkeleton', showSkeleton);
    }
};

export default SettingPanel;