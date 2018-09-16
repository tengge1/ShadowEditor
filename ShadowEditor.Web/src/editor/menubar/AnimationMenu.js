import UI from '../../ui/UI';
import ObjectLoader from '../../loader/ObjectLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import LolModel from '../../lol/Model';
import Unity3DLoader from '../../loader/unity3d/Unity3DLoader';

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
            html: '测试'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
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
            }, {
                xtype: 'div',
                cls: 'option',
                html: 'Unity3D教室',
                onClick: this.onAddClassRoom.bind(this)
            }]
        }]
    });

    container.render();
}

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

AnimationMenu.prototype.onAddClassRoom = function () {
    var editor = this.app.editor;

    var loader = new Unity3DLoader();
    loader.load(this.app.options.server + '/Upload/JP_Classroom/Scene/Classroom.unity', scene => {
        if (scene) {
            editor.setScene(scene);
        }
    });
};

export default AnimationMenu;