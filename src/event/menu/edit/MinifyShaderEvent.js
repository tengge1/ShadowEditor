import MenuEvent from '../MenuEvent';
import RemoveObjectCommand from '../../../command/RemoveObjectCommand';
import SetMaterialValueCommand from '../../../command/SetMaterialValueCommand';
import MultiCmdsCommand from '../../../command/MultiCmdsCommand';

/**
 * 缩小着色器事件
 * @param {*} app 
 */
function MinifyShaderEvent(app) {
    MenuEvent.call(this, app);
}

MinifyShaderEvent.prototype = Object.create(MenuEvent.prototype);
MinifyShaderEvent.prototype.constructor = MinifyShaderEvent;

MinifyShaderEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mMinifyShader.' + this.id, function () {
        _this.onMinifyShader();
    });
};

MinifyShaderEvent.prototype.stop = function () {
    this.app.on('mMinifyShader.' + this.id, null);
};

MinifyShaderEvent.prototype.onMinifyShader = function () {
    var editor = this.app.editor;

    var root = editor.selected || editor.scene;

    var errors = [];
    var nMaterialsChanged = 0;

    var path = [];

    function getPath(object) {
        path.length = 0;

        var parent = object.parent;
        if (parent !== undefined) getPath(parent);

        path.push(object.name || object.uuid);

        return path;
    }

    var cmds = [];
    root.traverse(function (object) {
        var material = object.material;

        if (material instanceof THREE.ShaderMaterial) {
            try {
                var shader = glslprep.minifyGlsl([
                    material.vertexShader, material.fragmentShader]);

                cmds.push(new SetMaterialValueCommand(object, 'vertexShader', shader[0]));
                cmds.push(new SetMaterialValueCommand(object, 'fragmentShader', shader[1]));

                ++nMaterialsChanged;
            } catch (e) {

                var path = getPath(object).join("/");

                if (e instanceof glslprep.SyntaxError)
                    errors.push(path + ":" +
                        e.line + ":" + e.column + ": " + e.message);
                else {
                    errors.push(path +
                        "： 未预料到的错误(详情请见控制台)。");

                    console.error(e.stack || e);
                }
            }
        }
    });

    if (nMaterialsChanged > 0) {
        editor.execute(new MultiCmdsCommand(cmds), 'Minify Shaders');
    }

    window.alert(nMaterialsChanged +
        "材质已经改变。\n" + errors.join("\n"));
};

export default MinifyShaderEvent;