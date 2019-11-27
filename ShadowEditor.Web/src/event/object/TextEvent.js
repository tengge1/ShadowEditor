import BaseEvent from '../BaseEvent';
import PointText from '../../object/geometry/PointText';

/**
 * 文字事件
 * @author tengge / https://github.com/tengge1
 */
class TextEvent extends BaseEvent {
    constructor() {
        super();
        this.onAddText = this.onAddText.bind(this);
        this.onRemoveText = this.onRemoveText.bind(this);
    }

    start() {
        app.on(`addText.${this.id}`, this.onAddText);
        app.on(`removeText.${this.id}`, this.onRemoveText);
    }

    stop() {
        app.on(`addText.${this.id}`, null);
        app.on(`removeText.${this.id}`, null);
    }

    onAddText(obj) {
        debugger;
    }

    onRemoveText(obj) {
        debugger;
    }
}

export default TextEvent;