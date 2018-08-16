import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加初音未来事件
 * @param {*} app 
 */
function AddMikuEvent(app) {
    MenuEvent.call(this, app);
    this.persons = [];
}

AddMikuEvent.prototype = Object.create(MenuEvent.prototype);
AddMikuEvent.prototype.constructor = AddMikuEvent;

AddMikuEvent.prototype.start = function () {
    this.app.on(`mAddMiku.${this.id}`, this.onAddMiku.bind(this));
};

AddMikuEvent.prototype.stop = function () {
    this.app.on(`mAddMiku.${this.id}`, null);
};

AddMikuEvent.prototype.onAddMiku = function () {
    var editor = this.app.editor;
    var effect = new THREE.OutlineEffect(editor.renderer);

    this.effect = effect;

    var modelFile = 'assets/models/miku/miku_v2.pmd';
    var vmdFiles = ['assets/models/vmds/wavefile_v2.vmd'];

    var loader = new THREE.MMDLoader();
    loader.loadWithAnimation(modelFile, vmdFiles, (mmd) => {
        var mesh = mmd.mesh;
        mesh.position.y = - 10;

        editor.execute(new AddObjectCommand(mesh));

        var helper = new THREE.MMDAnimationHelper({
            afterglow: 2.0
        });

        this.helper = helper;

        helper.add(mesh, {
            animation: mmd.animation,
            physics: true
        });

        var ikHelper = helper.objects.get(mesh).ikSolver.createHelper();
        ikHelper.visible = false;

        editor.execute(new AddObjectCommand(ikHelper));

        var physicsHelper = helper.objects.get(mesh).physics.createHelper();
        physicsHelper.visible = false;

        editor.execute(new AddObjectCommand(physicsHelper));

        this.app.on(`animate.` + this.id, this.onAnimate.bind(this));
    });
};

AddMikuEvent.prototype.onAnimate = function (clock) {
    this.helper.update(clock.getDelta());
    this.effect.render(this.app.editor.scene, this.app.editor.camera);
};

export default AddMikuEvent;