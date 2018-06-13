import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';
import AddObjectCommand from '../command/AddObjectCommand';
import RemoveObjectCommand from '../command/RemoveObjectCommand';
import SetMaterialValueCommand from '../command/SetMaterialValueCommand';
import MultiCmdsCommand from '../command/MultiCmdsCommand';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function EditMenu(editor) {

    var container = new Panel();
    container.setClass('menu');

    var title = new Panel();
    title.setClass('title');
    title.setTextContent('编辑');
    container.add(title);

    var options = new Panel();
    options.setClass('options');
    container.add(options);

    // Undo

    var undo = new Row();
    undo.setClass('option');
    undo.setTextContent('撤销(Ctrl+Z)');
    undo.onClick(function () {

        editor.undo();

    });
    options.add(undo);

    // Redo

    var redo = new Row();
    redo.setClass('option');
    redo.setTextContent('重做(Ctrl+Shift+Z)');
    redo.onClick(function () {

        editor.redo();

    });
    options.add(redo);

    // Clear History

    var option = new Row();
    option.setClass('option');
    option.setTextContent('清空历史记录');
    option.onClick(function () {

        if (confirm('撤销/重做历史纪录将被清空。确定吗？')) {

            editor.history.clear();

        }

    });
    options.add(option);


    editor.signals.historyChanged.add(function () {

        var history = editor.history;

        undo.setClass('option');
        redo.setClass('option');

        if (history.undos.length == 0) {

            undo.setClass('inactive');

        }

        if (history.redos.length == 0) {

            redo.setClass('inactive');

        }

    });

    // ---

    options.add(new HorizontalRule());

    // Clone

    var option = new Row();
    option.setClass('option');
    option.setTextContent('复制');
    option.onClick(function () {

        var object = editor.selected;

        if (object.parent === null) return; // avoid cloning the camera or scene

        object = object.clone();

        editor.execute(new AddObjectCommand(object));

    });
    options.add(option);

    // Delete

    var option = new Row();
    option.setClass('option');
    option.setTextContent('删除(Del)');
    option.onClick(function () {

        var object = editor.selected;

        if (confirm('Delete ' + object.name + '?') === false) return;

        var parent = object.parent;
        if (parent === undefined) return; // avoid deleting the camera or scene

        editor.execute(new RemoveObjectCommand(object));

    });
    options.add(option);

    // Minify shaders

    var option = new Row();
    option.setClass('option');
    option.setTextContent('清除着色');
    option.onClick(function () {

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

    });
    options.add(option);


    return container;

};

export default EditMenu;