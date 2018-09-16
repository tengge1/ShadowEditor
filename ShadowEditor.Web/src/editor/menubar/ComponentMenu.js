import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';

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
                html: '刚体',
                cls: 'option',
                onClick: this.addRigidBody.bind(this)
            }, {
                xtype: 'div',
                html: '碰撞体',
                cls: 'option',
                onClick: this.addCollision.bind(this)
            }, {
                xtype: 'hr'
            }, {
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
                html: '火焰',
                cls: 'option',
                onClick: this.onAddFire.bind(this)
            }, {
                xtype: 'div',
                html: '烟',
                cls: 'option',
                onClick: this.onAddSmoke.bind(this)
            }]
        }]
    });

    container.render();
}

// --------------------------- 添加刚体 ------------------------------------

ComponentMenu.prototype.addRigidBody = function () {

};

// ---------------------------- 添加碰撞体 -----------------------------------

ComponentMenu.prototype.addCollision = function () {

};

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

// ---------------------------- 添加火焰 -------------------------------------

ComponentMenu.prototype.onAddFire = function () {

};

// ------------------------------ 添加烟 ------------------------------------

ComponentMenu.prototype.onAddSmoke = function () {

};

export default ComponentMenu;