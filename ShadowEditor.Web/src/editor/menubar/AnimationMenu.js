import UI from '../../ui/UI';
import ObjectLoader from '../../loader/ObjectLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import LolModel from '../../lol/Model';

var ID = 1;

/**
 * 动画菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AnimationMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

AnimationMenu.prototype = Object.create(UI.Control.prototype);
AnimationMenu.prototype.constructor = AnimationMenu;

AnimationMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '动画'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: '人',
                onClick: this.onAddPerson.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '火焰',
                onClick: () => {
                    this.app.call('mAddFire', this);
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '烟',
                onClick: () => {
                    this.app.call('mAddSmoke', this);
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '初音未来',
                onClick: () => {
                    this.app.call('mAddMiku', this);
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '寒冰射手',
                onClick: this.onAddAshe.bind(this)
            }]
        }]
    });

    container.render();
}

/**
 * 添加人
 */
AnimationMenu.prototype.onAddPerson = function () {
    var editor = this.app.editor;

    var loader = new ObjectLoader();
    var url = this.app.options.server + '/assets/models/marine/marine_anims_core.json';
    loader.load(url).then(mesh => {
        mesh.scale.set(0.1, 0.1, 0.1);
        mesh.name = '人' + ID++;
        mesh.userData = {
            Server: true,
            Type: 'json',
            Url: '/assets/models/marine/marine_anims_core.json'
        };
        editor.execute(new AddObjectCommand(mesh));
        this.setPersonScript(mesh.name);
    });
};

AnimationMenu.prototype.setPersonScript = function (name) {
    var source = `
    var mesh = this.getObjectByName('${name}');
    var mixer = new THREE.AnimationMixer(mesh);
    var idleAction = mixer.clipAction('idle');
    var walkAction = mixer.clipAction('walk');
    var runAction = mixer.clipAction('run');
    var actions = [idleAction, walkAction, runAction];
    walkAction.play();

    function update(clock, deltaTime) {
        mixer.update(deltaTime);
    }
    `;

    var uuid = THREE.Math.generateUUID();
    this.app.editor.scripts[uuid] = {
        id: 0,
        name: `${name}动画`,
        type: 'javascript',
        source: source,
        uuid: uuid
    };
    this.app.call('scriptChanged', this);
};

/**
 * 添加寒冰射手
 */
AnimationMenu.prototype.onAddAshe = function () {
    var editor = this.app.editor;

    var model = new LolModel({
        champion: '22',
        skin: 0
    });
    model.load();
    model.on('load', () => {
        var geometry = model.geometry;
        var material = model.material;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = '寒冰射手';
        mesh.scale.set(0.1, 0.1, 0.1);
        model.setAnimation('idle');

        editor.execute(new AddObjectCommand(mesh));
        this.app.on('animate.Ashe', (clock, deltaTime) => {
            model.update(clock.getElapsedTime() * 1000);
        });
    });
};

export default AnimationMenu;