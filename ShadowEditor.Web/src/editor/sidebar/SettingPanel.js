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
                text: '背景'
            }, {
                xtype: 'color',
                id: 'backgroundColor',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '雾'
            }, {
                xtype: 'select',
                id: 'fogType',
                scope: this.id,
                options: {
                    'None': '无',
                    'Fog': '线性',
                    'FogExp2': '指数型'
                },
                onChange: this.onChangeFogType.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '雾颜色'
            }, {
                xtype: 'color',
                id: 'fogColor',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogNearRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '雾近点'
            }, {
                xtype: 'number',
                id: 'fogNear',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogFarRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '雾远点'
            }, {
                xtype: 'number',
                id: 'fogFar',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogDensityRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '雾浓度'
            }, {
                xtype: 'number',
                id: 'fogDensity',
                scope: this.id,
                range: [0, 0.1],
                precision: 3,
                onChange: this.update.bind(this)
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

    var scene = this.app.editor.scene;

    // 背景
    var backgroundColor = UI.get('backgroundColor', this.id);
    backgroundColor.setValue(`#${scene.background.getHexString()}`);

    // 雾效
    var fogColorRow = UI.get('fogColorRow', this.id);
    var fogNearRow = UI.get('fogNearRow', this.id);
    var fogFarRow = UI.get('fogFarRow', this.id);
    var fogDensityRow = UI.get('fogDensityRow', this.id);

    var fogType = UI.get('fogType', this.id);
    var fogColor = UI.get('fogColor', this.id);
    var fogNear = UI.get('fogNear', this.id);
    var fogFar = UI.get('fogFar', this.id);
    var fogDensity = UI.get('fogDensity', this.id);

    fogType.setValue(scene.fog == null ? 'None' : ((scene.fog instanceof THREE.FogExp2) ? 'FogExp2' : 'Fog'));

    fogColorRow.dom.style.display = scene.fog == null ? 'none' : '';
    fogColor.setValue(`#${scene.fog == null ? 'aaaaaa' : scene.fog.color.getHexString()}`);

    fogNearRow.dom.style.display = (scene.fog && scene.fog instanceof THREE.Fog) ? '' : 'none';
    fogNear.setValue((scene.fog && scene.fog instanceof THREE.Fog) ? scene.fog.near : 0.1);

    fogFarRow.dom.style.display = (scene.fog && scene.fog instanceof THREE.Fog) ? '' : 'none';
    fogFar.setValue((scene.fog && scene.fog instanceof THREE.Fog) ? scene.fog.far : 50);

    fogDensityRow.dom.style.display = (scene.fog && scene.fog instanceof THREE.FogExp2) ? '' : 'none';
    fogDensity.setValue((scene.fog && scene.fog instanceof THREE.FogExp2) ? fog.density : 0.05);

    // 网格
    var showGrid = UI.get('showGrid', this.id);
    showGrid.setValue(this.app.editor.grid.visible);
};

SettingPanel.prototype.onChangeFogType = function () {
    var fogType = UI.get('fogType', this.id).getValue();
    var fogColorRow = UI.get('fogColorRow', this.id).dom;
    var fogNearRow = UI.get('fogNearRow', this.id).dom;
    var fogFarRow = UI.get('fogFarRow', this.id).dom;
    var fogDensityRow = UI.get('fogDensityRow', this.id).dom;

    switch (fogType) {
        case 'None':
            fogColorRow.style.display = 'none';
            fogNearRow.style.display = 'none';
            fogFarRow.style.display = 'none';
            fogDensityRow.style.display = 'none';
            break;
        case 'Fog':
            fogColorRow.style.display = '';
            fogNearRow.style.display = '';
            fogFarRow.style.display = '';
            fogDensityRow.style.display = 'none';
            break;
        case 'FogExp2':
            fogColorRow.style.display = '';
            fogNearRow.style.display = 'none';
            fogFarRow.style.display = 'none';
            fogDensityRow.style.display = '';
            break;
    }

    this.update();
};

SettingPanel.prototype.update = function () {
    var scene = this.app.editor.scene;

    var backgroundColor = UI.get('backgroundColor', this.id).getHexValue();
    scene.background = new THREE.Color(backgroundColor);

    var fogType = UI.get('fogType', this.id).getValue();
    var fogColor = UI.get('fogColor', this.id).getHexValue();
    var fogNear = UI.get('fogNear', this.id).getValue();
    var fogFar = UI.get('fogFar', this.id).getValue();
    var fogDensity = UI.get('fogDensity', this.id).getValue();

    switch (fogType) {
        case 'None':
            scene.fog = null;
            break;
        case 'Fog':
            scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
            break;
        case 'FogExp2':
            scene.fog = new THREE.FogExp2(fogColor, fogDensity);
            break;
    }

    var showGrid = UI.get('showGrid', this.id).getValue();
    this.app.editor.grid.visible = showGrid;
};

export default SettingPanel;