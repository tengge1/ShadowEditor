import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import Sky from '../../object/component/Sky';
import Fire from '../../object/component/Fire';
import Water from '../../object/component/Water';
import Smoke from '../../object/component/Smoke';
import Cloth from '../../object/component/Cloth';
import ParticleEmitter from '../../object/component/ParticleEmitter';

/**
 * 组件菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ComponentMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ComponentMenu.prototype = Object.create(UI.Control.prototype);
ComponentMenu.prototype.constructor = ComponentMenu;

ComponentMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_COMPONENT
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: L_BACKGROUND_MUSIC,
                cls: 'option',
                onClick: this.onAddBackgroundMusic.bind(this)
            }, {
                xtype: 'div',
                html: L_PARTICLE_EMITTER,
                cls: 'option',
                onClick: this.ParticleEmitter.bind(this)
            }, {
                xtype: 'div',
                html: L_SKY,
                cls: 'option',
                onClick: this.onAddSky.bind(this)
            }, {
                xtype: 'div',
                html: L_FIRE,
                cls: 'option',
                onClick: this.onAddFire.bind(this)
            }, {
                xtype: 'div',
                html: L_WATER,
                cls: 'option',
                onClick: this.onAddWater.bind(this)
            }, {
                xtype: 'div',
                html: L_SMOKE,
                cls: 'option',
                onClick: this.onAddSmoke.bind(this)
            }, {
                xtype: 'div',
                html: L_CLOTH,
                cls: 'option',
                onClick: this.onAddCloth.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------- 添加背景音乐 ----------------------------------

ComponentMenu.prototype.onAddBackgroundMusic = function () {
    var editor = this.app.editor;
    var listener = editor.audioListener;

    var audio = new THREE.Audio(listener);
    audio.name = L_BACKGROUND_MUSIC;
    audio.autoplay = false;
    audio.setLoop(true);
    audio.setVolume(1.0);

    audio.userData.autoplay = true;

    this.app.editor.execute(new AddObjectCommand(audio));
};

// ---------------------------- 添加粒子发射器 --------------------------------------------

ComponentMenu.prototype.ParticleEmitter = function () {
    var emitter = new ParticleEmitter();
    this.app.editor.execute(new AddObjectCommand(emitter));
    emitter.userData.group.tick(0);
};

// ---------------------------- 天空 ----------------------------------------

ComponentMenu.prototype.onAddSky = function () {
    var obj = new Sky();
    obj.name = L_SKY;
    obj.userData.type = 'Sky';
    this.app.editor.execute(new AddObjectCommand(obj));
};

// ---------------------------- 添加火焰 -------------------------------------

ComponentMenu.prototype.onAddFire = function () {
    var editor = this.app.editor;

    var fire = new Fire(editor.camera);

    editor.execute(new AddObjectCommand(fire));

    fire.userData.fire.update(0);
};

// -------------------------- 添加水 ---------------------------------------

ComponentMenu.prototype.onAddWater = function () {
    var editor = this.app.editor;

    var water = new Water(editor.renderer);

    editor.execute(new AddObjectCommand(water));

    water.update();
};

// ------------------------------ 添加烟 ------------------------------------

ComponentMenu.prototype.onAddSmoke = function () {
    var editor = this.app.editor;
    var camera = editor.camera;
    var renderer = editor.renderer;

    var smoke = new Smoke(camera, renderer);

    smoke.position.y = 3;

    editor.execute(new AddObjectCommand(smoke));

    smoke.update(0);
};

// ----------------------------- 添加布 ------------------------------------

ComponentMenu.prototype.onAddCloth = function () {
    var editor = this.app.editor;

    var cloth = new Cloth();

    cloth.name = L_CLOTH;

    editor.execute(new AddObjectCommand(cloth));
};

export default ComponentMenu;