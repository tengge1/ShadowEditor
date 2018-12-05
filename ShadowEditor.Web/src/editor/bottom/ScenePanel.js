import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
function ScenePanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

ScenePanel.prototype = Object.create(UI.Control.prototype);
ScenePanel.prototype.constructor = ScenePanel;

ScenePanel.prototype.render = function () {

};

export default ScenePanel;