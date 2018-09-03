import UI from '../../ui/UI';
import ObjectLoader from '../../loader/ObjectLoader';
import AddObjectCommand from '../../command/AddObjectCommand';

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

export default AnimationMenu;