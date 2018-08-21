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
    this.ready = false;
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

    var modelFile = 'assets/models/miku/miku_v2.pmd';
    var vmdFiles = ['assets/models/vmds/wavefile_v2.vmd'];

    var audioFile = 'assets/audios/wavefile_short.mp3';
    var audioParams = { delayTime: 160 * 1 / 30 };

    var loader = new THREE.MMDLoader();
    loader.loadWithAnimation(modelFile, vmdFiles, (mmd) => {
        var mesh = mmd.mesh;
        mesh.name = '初音未来';

        editor.execute(new AddObjectCommand(mesh));

        var helper = new THREE.MMDAnimationHelper({
            afterglow: 2.0
        });

        this.helper = helper;

        helper.add(mesh, {
            animation: mmd.animation,
            physics: true
        });

        new THREE.AudioLoader().load(audioFile, (buffer) => {
            var listener = new THREE.AudioListener();
            var audio = new THREE.Audio(listener).setBuffer(buffer);
            listener.position.z = 1;
            helper.add(audio, audioParams);
            editor.execute(new AddObjectCommand(audio));
            editor.execute(new AddObjectCommand(listener));
            this.ready = true;
        });

        this.app.on(`animate.` + this.id, this.onAnimate.bind(this));
    });
};

AddMikuEvent.prototype.onAnimate = function (clock, deltaTime) {
    if (this.ready) {
        this.helper.update(deltaTime);
    }
};

export default AddMikuEvent;