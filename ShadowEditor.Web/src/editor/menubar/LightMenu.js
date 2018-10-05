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
            html: '光源'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
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

// ------------------------- 环境光 ------------------------------

LightMenu.prototype.addAmbientLight = function () {
    var editor = this.app.editor;

    var color = 0xaaaaaa;

    var light = new THREE.AmbientLight(color);
    light.name = '环境光';

    editor.execute(new AddObjectCommand(light));
};

// ------------------------- 平行光 ------------------------------

LightMenu.prototype.addDirectionalLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;

    var light = new THREE.DirectionalLight(color, intensity);
    light.name = '平行光';
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
    light.name = '点光源';
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

    light.name = '聚光灯';
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
    light.name = '半球光';

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
    light.name = '矩形光';

    light.position.set(0, 6, 0);

    editor.execute(new AddObjectCommand(light));
};

export default LightMenu;