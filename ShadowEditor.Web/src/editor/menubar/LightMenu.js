import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';

import PointLight from '../../object/light/PointLight';
import HemisphereLight from '../../object/light/HemisphereLight';
import RectAreaLight from '../../object/light/RectAreaLight';

/**
 * 光源菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function LightMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

LightMenu.prototype = Object.create(UI.Control.prototype);
LightMenu.prototype.constructor = LightMenu;

LightMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_LIGHT
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: L_AMBIENT_LIGHT,
                cls: 'option',
                onClick: this.addAmbientLight.bind(this)
            }, {
                xtype: 'div',
                html: L_DIRECTIONAL_LIGHT,
                cls: 'option',
                onClick: this.addDirectionalLight.bind(this)
            }, {
                xtype: 'div',
                html: L_POINT_LIGHT,
                cls: 'option',
                onClick: this.addPointLight.bind(this)
            }, {
                xtype: 'div',
                html: L_SPOT_LIGHT,
                cls: 'option',
                onClick: this.addSpotLight.bind(this)
            }, {
                xtype: 'div',
                html: L_HEMISPHERE_LIGHT,
                cls: 'option',
                onClick: this.addHemisphereLight.bind(this)
            }, {
                xtype: 'div',
                html: L_RECT_AREA_LIGHT,
                cls: 'option',
                onClick: this.addRectAreaLight.bind(this)
            }]
        }]
    });

    container.render();
}

// ------------------------- 环境光 ------------------------------

LightMenu.prototype.addAmbientLight = function () {
    var editor = this.app.editor;

    var color = 0xaaaaaa;

    var light = new THREE.AmbientLight(color);
    light.name = L_AMBIENT_LIGHT;

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 平行光 ------------------------------

LightMenu.prototype.addDirectionalLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;

    var light = new THREE.DirectionalLight(color, intensity);
    light.name = L_DIRECTIONAL_LIGHT;
    light.castShadow = true;
    light.shadow.mapSize.x = 2048;
    light.shadow.mapSize.y = 2048;
    light.shadow.camera.left = -100;
    light.shadow.camera.right = 100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    light.position.set(5, 10, 7.5);

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 点光源 ------------------------------

LightMenu.prototype.addPointLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var distance = 0;

    var light = new PointLight(color, intensity, distance);
    light.name = L_POINT_LIGHT;
    light.position.y = 5;
    light.castShadow = true;

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 聚光灯 ------------------------------

LightMenu.prototype.addSpotLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var distance = 0;
    var angle = Math.PI * 0.1;
    var penumbra = 0;

    var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);

    light.name = L_SPOT_LIGHT;
    light.castShadow = true;

    light.position.set(5, 10, 7.5);

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 半球光 ------------------------------

LightMenu.prototype.addHemisphereLight = function () {
    var editor = this.app.editor;
    var skyColor = 0x00aaff;
    var groundColor = 0xffaa00;
    var intensity = 1;

    var light = new HemisphereLight(skyColor, groundColor, intensity);
    light.name = L_HEMISPHERE_LIGHT;

    light.position.set(0, 10, 0);

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 矩形光 ------------------------------

LightMenu.prototype.addRectAreaLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var width = 20;
    var height = 10;

    var light = new RectAreaLight(color, intensity, width, height);
    light.name = L_RECT_AREA_LIGHT;

    light.position.set(0, 6, 0);

    editor.execute(new AddObjectCommand(light));
};

export default LightMenu;