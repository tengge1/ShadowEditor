import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import Sky from '../../object/Sky';
import Smoke from '../../particle/Smoke';
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
                html: '烟',
                cls: 'option',
                onClick: this.onAddSmoke.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '刚体',
                cls: 'option',
                onClick: this.addRigidBody.bind(this)
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
    var group = new SPE.Group({
        texture: {
            value: new THREE.TextureLoader().load('assets/textures/SPE/smokeparticle.png')
        },
        maxParticleCount: 2000
    });

    var emitter = new SPE.Emitter({
        maxAge: {
            value: 2
        },
        position: {
            value: new THREE.Vector3(0, 0, 0),
            spread: new THREE.Vector3(0, 0, 0)
        },

        acceleration: {
            value: new THREE.Vector3(0, -10, 0),
            spread: new THREE.Vector3(10, 0, 10)
        },

        velocity: {
            value: new THREE.Vector3(0, 25, 0),
            spread: new THREE.Vector3(10, 7.5, 10)
        },

        color: {
            value: [new THREE.Color('white'), new THREE.Color('red')]
        },

        size: {
            value: 1
        },

        particleCount: 2000
    });

    group.addEmitter(emitter);

    group.mesh.name = '粒子发射器';

    group.mesh.userData.type = 'ParticleEmitter';
    group.mesh.userData.group = group;
    group.mesh.userData.emitter = emitter;

    this.app.editor.execute(new AddObjectCommand(group.mesh));

    // 稍微喷一点，让纹理正常加载
    group.tick(0);
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
    var camera = editor.camera;

    VolumetricFire.texturePath = 'assets/textures/VolumetricFire/';

    var fireWidth = 2;
    var fireHeight = 4;
    var fireDepth = 2;
    var sliceSpacing = 0.5;

    var fire = new VolumetricFire(
        fireWidth,
        fireHeight,
        fireDepth,
        sliceSpacing,
        camera
    );

    fire.mesh.name = '火焰';
    fire.mesh.position.y = 2;
    fire.mesh.userData.type = 'Fire';
    fire.mesh.userData.fire = fire;
    fire.mesh.userData.width = fireWidth;
    fire.mesh.userData.height = fireHeight;
    fire.mesh.userData.depth = fireDepth;
    fire.mesh.userData.sliceSpacing = sliceSpacing;

    editor.execute(new AddObjectCommand(fire.mesh));

    // 烧一下，在场景中留下痕迹
    fire.update(0);

    var source = `var mesh = this.getObjectByName('${fire.mesh.name}');\n\n` +
        `function update(clock, deltaTime) {\n` +
        `    var elapsed = clock.getElapsedTime();\n` +
        `    mesh.userData.fire.update(elapsed);\n` +
        `}`;

    var uuid = THREE.Math.generateUUID();

    editor.scripts[uuid] = {
        id: null,
        name: `${fire.mesh.name}动画`,
        type: 'javascript',
        source: source,
        uuid: uuid
    };

    this.app.call('scriptChanged', this);
};

// ------------------------------ 添加烟 ------------------------------------

ComponentMenu.prototype.onAddSmoke = function () {
    var editor = this.app.editor;
    var camera = editor.camera;
    var renderer = editor.renderer;

    var smoke = new Smoke(camera, renderer);

    smoke.mesh.name = '烟';
    smoke.mesh.position.y = 3;

    smoke.mesh.userData.type = 'Smoke';
    smoke.mesh.userData.smoke = smoke;

    editor.execute(new AddObjectCommand(smoke.mesh));

    smoke.update(0);
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

export default ComponentMenu;