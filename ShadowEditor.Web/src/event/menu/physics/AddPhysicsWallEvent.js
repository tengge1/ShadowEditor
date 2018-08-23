import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = -1;

/**
 * 添加物理墙
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddPhysicsWallEvent(app) {
    MenuEvent.call(this, app);
}

AddPhysicsWallEvent.prototype = Object.create(MenuEvent.prototype);
AddPhysicsWallEvent.prototype.constructor = AddPhysicsWallEvent;

AddPhysicsWallEvent.prototype.start = function () {
    this.app.on(`mAddPhysicsWall.${this.id}`, this.onAddWall.bind(this));
};

AddPhysicsWallEvent.prototype.stop = function () {
    this.app.on(`mAddPhysicsWall.${this.id}`, null);
};

AddPhysicsWallEvent.prototype.onAddWall = function () {
    var editor = this.app.editor;

    var pos = new THREE.Vector3();
    var quat = new THREE.Quaternion();

    // Wall
    var brickMass = 0.5;
    var brickLength = 1.2;
    var brickDepth = 0.6;
    var brickHeight = brickLength * 0.5;
    var numBricksLength = 6;
    var numBricksHeight = 8;
    var z0 = - numBricksLength * brickLength * 0.5;
    pos.set(0, brickHeight * 0.5, z0);
    quat.set(0, 0, 0, 1);
    for (var j = 0; j < numBricksHeight; j++) {
        var oddRow = (j % 2) == 1;
        pos.z = z0;
        if (oddRow) {
            pos.z -= 0.25 * brickLength;
        }
        var nRow = oddRow ? numBricksLength + 1 : numBricksLength;
        for (var i = 0; i < nRow; i++) {
            var brickLengthCurrent = brickLength;
            var brickMassCurrent = brickMass;
            if (oddRow && (i == 0 || i == nRow - 1)) {
                brickLengthCurrent *= 0.5;
                brickMassCurrent *= 0.5;
            }
            var color = Math.floor(Math.random() * (1 << 24));
            var material = new THREE.MeshPhongMaterial({ color: color });
            var brick = this.app.physics.createParalellepiped(brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, material);
            brick.castShadow = true;
            brick.receiveShadow = true;
            editor.execute(new AddObjectCommand(brick));

            if (oddRow && (i == 0 || i == nRow - 2)) {
                pos.z += 0.75 * brickLength;
            }
            else {
                pos.z += brickLength;
            }
        }
        pos.y += brickHeight;
    }
};

export default AddPhysicsWallEvent;