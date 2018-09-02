import MenuEvent from '../../../event/menu/MenuEvent';
import UI from '../../../ui/UI';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加初音未来事件
 * @author tengge / https://github.com/tengge1
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
    var camera = editor.camera;

    var modelFile = 'assets/models/miku/miku_v2.pmd';
    var vmdFiles = ['assets/models/vmds/wavefile_v2.vmd'];
    var cameraFiles = ['assets/models/vmds/wavefile_camera.vmd'];
    var audioFile = 'assets/audios/wavefile_short.mp3';
    var audioParams = { delayTime: 160 * 1 / 30 };

    var helper = new THREE.MMDHelper();
    this.helper = helper;

    var loader = new THREE.MMDLoader();

    loader.load(modelFile, vmdFiles, mesh => {
        mesh.name = '初音未来';

        helper.add(mesh);
        helper.setAnimation(mesh);
        helper.setPhysics(mesh);

        loader.loadVmds(cameraFiles, vmd => {
            helper.setCamera(camera);

            loader.pourVmdIntoCamera(camera, vmd);
            helper.setCameraAnimation(camera);

            loader.loadAudio(audioFile, (audio, listener) => {
                listener.position.z = 1;

                helper.setAudio(audio, listener, audioParams);

                audio.name = '音频';
                listener.name = '监听器';

                /*
                 * Note: call this method after you set all animations
                 *       including camera and audio.
                 */
                helper.unifyAnimationDuration();

                editor.execute(new AddObjectCommand(audio));
                editor.execute(new AddObjectCommand(listener));
                editor.execute(new AddObjectCommand(mesh));

                this.ready = true;

                this.app.on(`animate.` + this.id, this.onAnimate.bind(this));
            });
        });
    });
};

AddMikuEvent.prototype.onAnimate = function (clock, deltaTime) {
    if (this.ready) {
        this.helper.animate(deltaTime);
    }
};

export default AddMikuEvent;