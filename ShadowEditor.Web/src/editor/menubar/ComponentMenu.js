import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import Sky from '../../object/component/Sky';
import Fire from '../../object/component/Fire';
import Water from '../../object/component/Water';
import Smoke from '../../object/component/Smoke';
import ParticleEmitter from '../../object/component/ParticleEmitter';
import PlysicsUtils from '../../physics/PlysicsUtils';

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
            html: '组件'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: '背景音乐',
                cls: 'option',
                onClick: this.onAddBackgroundMusic.bind(this)
            }, {
                xtype: 'div',
                html: '粒子发射器',
                cls: 'option',
                onClick: this.ParticleEmitter.bind(this)
            }, {
                xtype: 'div',
                html: '天空',
                cls: 'option',
                onClick: this.onAddSky.bind(this)
            }, {
                xtype: 'div',
                html: '火焰',
                cls: 'option',
                onClick: this.onAddFire.bind(this)
            }, {
                xtype: 'div',
                html: '水',
                cls: 'option',
                onClick: this.onAddWater.bind(this)
            }, {
                xtype: 'div',
                html: '烟',
                cls: 'option',
                onClick: this.onAddSmoke.bind(this)
            }, {
                xtype: 'div',
                html: '布',
                cls: 'option',
                onClick: this.onAddCloth.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '刚体',
                cls: 'option',
                onClick: this.addRigidBody.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '曲线编辑器',
                cls: 'option',
                onClick: this.curveEditor.bind(this)
            }, {
                xtype: 'div',
                html: '发型编辑器',
                cls: 'option',
                onClick: this.hairEditor.bind(this)
            }, {
                xtype: 'div',
                html: '服装编辑器',
                cls: 'option',
                onClick: this.clothingEditor.bind(this)
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
    audio.name = `背景音乐`;
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
    obj.name = '天空';
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

    // this.app.on(`animate.${this.id}`, () => {

    // });
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
    this.app.packageManager.load('Cloth').then(() => {
        debugger
    });
};

// --------------------------- 添加刚体 ------------------------------------

ComponentMenu.prototype.addRigidBody = function () {
    var selected = this.app.editor.selected;
    if (!selected) {
        UI.msg('请选择几何体！');
        return;
    }

    if (PlysicsUtils.addRigidBodyData(selected) !== false) {
        this.app.call('objectChanged', this, selected);
        UI.msg('添加刚体组件成功！');
    }
};

// --------------------------- 曲线编辑器 -------------------------------------

ComponentMenu.prototype.curveEditor = function () {
    UI.msg('待开发');
};

// --------------------------- 发型编辑器 --------------------------------------

ComponentMenu.prototype.hairEditor = function () {
    UI.msg('待开发');
};

// --------------------------- 服装编辑器 --------------------------------------

ComponentMenu.prototype.clothingEditor = function () {
    UI.msg('待开发');
};

export default ComponentMenu;