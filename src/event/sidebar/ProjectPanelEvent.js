import { System } from '../../third_party';
import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 工程面板事件
 * @param {*} app 
 */
function ProjectPanelEvent(app) {
    BaseEvent.call(this, app);
}

ProjectPanelEvent.prototype = Object.create(BaseEvent.prototype);
ProjectPanelEvent.prototype.constructor = ProjectPanelEvent;

ProjectPanelEvent.prototype.start = function () {
    this.app.on(`updateRenderer.${this.id}`, this.updateRenderer.bind(this));

    var config = this.app.editor.config;

    this.createRenderer(
        config.getKey('project/renderer'),
        config.getKey('project/renderer/antialias'),
        config.getKey('project/renderer/shadows'),
        config.getKey('project/renderer/gammaInput'),
        config.getKey('project/renderer/gammaOutput')
    );
};

ProjectPanelEvent.prototype.stop = function () {
    this.app.on(`updateRenderer.${this.id}`, null);
};

ProjectPanelEvent.prototype.updateRenderer = function () {
    var rendererType = UI.get('rendererType');
    var rendererAntialias = UI.get('rendererAntialias');
    var rendererShadows = UI.get('rendererShadows');
    var rendererGammaInput = UI.get('rendererGammaInput');
    var rendererGammaOutput = UI.get('rendererGammaOutput');

    this.createRenderer(
        rendererType.getValue(),
        rendererAntialias.getValue(),
        rendererShadows.getValue(),
        rendererGammaInput.getValue(),
        rendererGammaOutput.getValue()
    );
};

ProjectPanelEvent.prototype.createRenderer = function (type, antialias, shadows, gammaIn, gammaOut) {
    var rendererPropertiesRow = UI.get('rendererPropertiesRow');

    var rendererTypes = {
        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer
    };

    if (type === 'WebGLRenderer' && System.support.webgl === false) {
        type = 'CanvasRenderer';
    }

    rendererPropertiesRow.dom.style.display = type === 'WebGLRenderer' ? '' : 'none';

    var renderer = new rendererTypes[type]({ antialias: antialias });
    renderer.gammaInput = gammaIn;
    renderer.gammaOutput = gammaOut;
    if (shadows && renderer.shadowMap) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.app.call('rendererChanged', this, renderer);
}

export default ProjectPanelEvent;