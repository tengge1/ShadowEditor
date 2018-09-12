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
                text: '帮助器'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '网格'
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
                text: '相机'
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
                text: '点光源'
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
                text: '平行光'
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
                text: '聚光灯'
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
                text: '半球光'
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
                text: '矩形光'
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
                text: '骨骼'
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

    this.app.on(`selectTab.${this.id}`, this.onSelectTab.bind(this));
};

SettingPanel.prototype.onSelectTab = function (tabName) {
    if (tabName !== 'setting') {
        return;
    }

    // 帮助器
    var showGrid = UI.get('showGrid', this.id);
    showGrid.setValue(this.app.options.showGrid);

    var showCamera = UI.get('showCamera', this.id);
    showCamera.setValue(this.app.options.showCameraHelper);

    var showPointLight = UI.get('showPointLight', this.id);
    showPointLight.setValue(this.app.options.showPointLightHelper);

    var showDirectionalLight = UI.get('showDirectionalLight', this.id);
    showDirectionalLight.setValue(this.app.options.showDirectionalLightHelper);

    var showSpotLight = UI.get('showSpotLight', this.id);
    showSpotLight.setValue(this.app.options.showSpotLightHelper);

    var showHemisphereLight = UI.get('showHemisphereLight', this.id);
    showHemisphereLight.setValue(this.app.options.showHemisphereLightHelper);

    var showRectAreaLight = UI.get('showRectAreaLight', this.id);
    showRectAreaLight.setValue(this.app.options.showRectAreaLightHelper);

    var showSkeleton = UI.get('showSkeleton', this.id);
    showSkeleton.setValue(this.app.options.showSkeletonHelper);
};

SettingPanel.prototype.update = function () {
    // 帮助器
    var showGrid = UI.get('showGrid', this.id).getValue();
    this.app.options.showGrid = showGrid;
    this.app.editor.grid.visible = showGrid;

    var showCamera = UI.get('showCamera', this.id).getValue();
    this.app.options.showCameraHelper = showCamera;

    var showPointLight = UI.get('showPointLight', this.id).getValue();
    this.app.options.showPointLightHelper = showPointLight;

    var showDirectionalLight = UI.get('showDirectionalLight', this.id).getValue();
    this.app.options.showDirectionalLightHelper = showDirectionalLight;

    var showSpotLight = UI.get('showSpotLight', this.id).getValue();
    this.app.options.showSpotLightHelper = showSpotLight;

    var showHemisphereLight = UI.get('showHemisphereLight', this.id).getValue();
    this.app.options.showHemisphereLightHelper = showHemisphereLight;

    var showRectAreaLight = UI.get('showRectAreaLight', this.id).getValue();
    this.app.options.showRectAreaLightHelper = showRectAreaLight;

    var showSkeleton = UI.get('showSkeleton', this.id).getValue();
    this.app.options.showSkeletonHelper = showSkeleton;

    Object.values(this.app.editor.helpers).forEach(n => {
        if (n instanceof THREE.CameraHelper) {
            n.visible = showCamera;
        } else if (n instanceof THREE.PointLightHelper) {
            n.visible = showPointLight;
        } else if (n instanceof THREE.DirectionalLightHelper) {
            n.visible = showDirectionalLight;
        } else if (n instanceof THREE.SpotLightHelper) {
            n.visible = showSpotLight;
        } else if (n instanceof THREE.HemisphereLightHelper) {
            n.visible = showHemisphereLight;
        } else if (n instanceof THREE.RectAreaLightHelper) {
            n.visible = showRectAreaLight;
        } else if (n instanceof THREE.SkeletonHelper) {
            n.visible = showSkeleton;
        }
    });
};

export default SettingPanel;