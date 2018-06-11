import Command from './Command';

/**
 * 保存场景
 */
class SaveSceneCommand extends Command {

    constructor(editor) {

        super(editor);

        this.editor = editor;

        this.type = 'SaveSceneCommand';
        this.name = 'Save Scene';

    }

    execute() {
        var scene = this.editor.scene;
        debugger
    }

    undo() {
        alert('不支持');
    }

    toJSON() {

    }

    fromJSON(json) {

    }

}

export default SaveSceneCommand;