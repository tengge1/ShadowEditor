import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import PointLight from '../../object/light/PointLight';
import HemisphereLight from '../../object/light/HemisphereLight';

/**
 * 添加菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AddMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

AddMenu.prototype = Object.create(UI.Control.prototype);
AddMenu.prototype.constructor = AddMenu;

AddMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '添加'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mAddGroup',
                html: '组',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddGroup');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPlane',
                html: '平板',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPlane');
                }
            }, {
                xtype: 'div',
                id: 'mAddBox',
                html: '正方体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddBox');
                }
            }, {
                xtype: 'div',
                id: 'mAddCircle',
                html: '圆',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddCircle');
                }
            }, {
                xtype: 'div',
                id: 'mAddCylinder',
                html: '圆柱体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddCylinder');
                }
            }, {
                xtype: 'div',
                id: 'mAddSphere',
                html: '球体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSphere');
                }
            }, {
                xtype: 'div',
                id: 'mAddIcosahedron',
                html: '二十面体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddIcosahedron');
                }
            }, {
                xtype: 'div',
                id: 'mAddTorus',
                html: '轮胎',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTorus');
                }
            }, {
                xtype: 'div',
                id: 'mAddTorusKnot',
                html: '扭结',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTorusKnot');
                }
            }, {
                xtype: 'div',
                id: 'mAddTeaport',
                html: '茶壶',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTeaport');
                }
            }, {
                xtype: 'div',
                id: 'mAddLathe',
                html: '酒杯',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddLathe');
                }
            }, {
                xtype: 'div',
                id: 'mAddSprite',
                html: '精灵',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSprite');
                }
            }, {
                xtype: 'div',
                id: 'mAddText',
                html: '文本',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddText');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '环境光',
                cls: 'option',
                onClick: this.addAmbientLight.bind(this)
            }, {
                xtype: 'div',
                html: '平行光',
                cls: 'option',
                onClick: this.addDirectionalLight.bind(this)
            }, {
                xtype: 'div',
                html: '点光源',
                cls: 'option',
                onClick: this.addPointLight.bind(this)
            }, {
                xtype: 'div',
                html: '聚光灯',
                cls: 'option',
                onClick: this.addSpotLight.bind(this)
            }, {
                xtype: 'div',
                html: '半球光',
                cls: 'option',
                onClick: this.addHemisphereLight.bind(this)
            }, {
                xtype: 'div',
                html: '矩形光',
                cls: 'option',
                onClick: this.addRectAreaLight.bind(this)
            }]
        }]
    });

    container.render();
}

// ------------------------- 组 ---------------------------------

// ------------------------- 平板 -------------------------------

// ------------------------ 正方体 -----------------------------

// ------------------------ 圆 ----------------------------------

// ------------------------圆柱体 -------------------------------

// ------------------------ 球体 -------------------------------

// ----------------------- 二十面体 -----------------------------

// ----------------------- 轮胎 ---------------------------------

// ----------------------- 纽结 ---------------------------------

// ---------------------- 茶壶 ----------------------------------

// ---------------------- 酒杯 ----------------------------------

// ---------------------- 精灵 -----------------------------------

// ---------------------- 文本 ----------------------------------

// ------------------------- 环境光 ------------------------------

AddMenu.prototype.addAmbientLight = function () {
    var editor = this.app.editor;

    var color = 0xaaaaaa;

    var light = new THREE.AmbientLight(color);
    light.name = '环境光';

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 平行光 ------------------------------

AddMenu.prototype.addDirectionalLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;

    var light = new THREE.DirectionalLight(color, intensity);
    light.name = '平行光';
    light.castShadow = true;

    light.position.set(5, 10, 7.5);

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 点光源 ------------------------------

AddMenu.prototype.addPointLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var distance = 0;

    var light = new PointLight(color, intensity, distance);
    light.name = '点光源';
    light.position.y = 5;
    light.castShadow = true;

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 聚光灯 ------------------------------

AddMenu.prototype.addSpotLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var distance = 0;
    var angle = Math.PI * 0.1;
    var penumbra = 0;

    var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);

    light.name = '聚光灯';
    light.castShadow = true;

    light.position.set(5, 10, 7.5);

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 半球光 ------------------------------

AddMenu.prototype.addHemisphereLight = function () {

    var editor = this.app.editor;
    var skyColor = 0x00aaff;
    var groundColor = 0xffaa00;
    var intensity = 1;

    var light = new HemisphereLight(skyColor, groundColor, intensity);
    light.name = '半球光';

    light.position.set(0, 10, 0);

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 矩形光 ------------------------------

AddMenu.prototype.addRectAreaLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var width = 20;
    var height = 10;

    var light = new THREE.RectAreaLight(color, intensity, width, height);
    light.name = '矩形光';

    light.position.set(0, 6, 0);

    editor.execute(new AddObjectCommand(light));
};

export default AddMenu;