import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加人事件
 * @param {*} app 
 */
function AddPersonEvent(app) {
    MenuEvent.call(this, app);
    this.persons = [];
}

AddPersonEvent.prototype = Object.create(MenuEvent.prototype);
AddPersonEvent.prototype.constructor = AddPersonEvent;

AddPersonEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddPerson.' + this.id, this.onAddPerson.bind(this));
    this.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
};

AddPersonEvent.prototype.stop = function () {
    this.app.on('mAddPerson.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
};

AddPersonEvent.prototype.onAddPerson = function () {
    var editor = this.app.editor;
    var camera = editor.camera;

    new THREE.ObjectLoader().load('assets/models/marine/marine_anims_core.json', function (loadedObject) {
        var mesh;

        loadedObject.traverse(function (child) {
            if (child instanceof THREE.SkinnedMesh) {
                mesh = child;
            }
        });

        if (mesh === undefined) {
            alert('Unable to find a SkinnedMesh in this place:\n\n' + url + '\n\n');
            return;
        }

        mesh.rotation.y = - 135 * Math.PI / 180;
        mesh.name = 'Fire ' + ID++;
        editor.execute(new AddObjectCommand(mesh));
        this.persons.push(mesh);

        mesh.mixer = new THREE.AnimationMixer(mesh);
        mesh.idleAction = mesh.mixer.clipAction('idle');
        mesh.walkAction = mesh.mixer.clipAction('walk');
        mesh.runAction = mesh.mixer.clipAction('run');
        mesh.actions = [mesh.idleAction, mesh.walkAction, mesh.runAction];
        mesh.walkAction.play();
    });

    this.app.on(`animate.` + this.id, this.onAnimate.bind(this));
};

AddPersonEvent.prototype.onObjectRemoved = function (object) {
    var index = this.persons.findIndex(function (n) {
        return n.mesh === object;
    });
    if (index > -1) {
        this.persons.splice(index, 1);
    }

    if (this.persons.length === 0) {
        this.app.on(`animate.` + this.id, null);
    }
};

AddPersonEvent.prototype.onAnimate = function (clock) {
    var elapsed = clock.getElapsedTime();

    this.persons.forEach(function (person) {
        person.mixer.update(elapsed);
    });
};

export default AddPersonEvent;