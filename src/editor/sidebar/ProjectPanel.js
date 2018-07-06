import UI from '../../ui/UI';

/**
 * 工程面板
 * @author mrdoob / http://mrdoob.com/
 */
function ProjectPanel(app) {
    this.app = app;
    var editor = this.app.editor;

    var config = editor.config;

    var rendererTypes = {
        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer
    };

    var container = new UI.Div({
        style: 'border-top: 0; padding-top: 20px;',
        cls: 'Panel'
    });

    // class

    var options = {};

    for (var key in rendererTypes) {

        if (key.indexOf('WebGL') >= 0 && System.support.webgl === false) continue;

        options[key] = key;

    }

    var rendererTypeRow = new UI.Row();

    var rendererType = new UI.Select({
        options: options,
        value: config.getKey('project/renderer'),
        style: 'width: 150px; ',
        onChange: function () {
            var value = this.getValue();
            config.setKey('project/renderer', value);
            updateRenderer();
        }
    });

    rendererTypeRow.add(new UI.Label({
        text: '渲染器',
        style: 'width: 90px;'
    }));

    rendererTypeRow.add(rendererType);

    container.add(rendererTypeRow);

    // antialiasing

    var rendererPropertiesRow = new UI.Row({
        style: 'margin-left: 90px'
    });

    var rendererAntialias = new UI.Boolean({
        value: config.getKey('project/renderer/antialias'),
        text: '抗锯齿',
        onChange: function () {
            config.setKey('project/renderer/antialias', this.getValue());
            updateRenderer();
        }
    });

    rendererPropertiesRow.add(rendererAntialias);

    // shadow

    var rendererShadows = new UI.Boolean({
        value: config.getKey('project/renderer/shadows'),
        text: '阴影',
        onChange: function () {
            config.setKey('project/renderer/shadows', this.getValue());
            updateRenderer();
        }
    });

    rendererPropertiesRow.add(rendererShadows);

    rendererPropertiesRow.add(new UI.Break());

    // gamma input

    var rendererGammaInput = new UI.Boolean({
        value: config.getKey('project/renderer/gammaInput'),
        text: 'γ输入',
        onChange: function () {
            config.setKey('project/renderer/gammaInput', this.getValue());
            updateRenderer();
        }
    });

    rendererPropertiesRow.add(rendererGammaInput);

    // gamma output

    var rendererGammaOutput = new UI.Boolean({
        value: config.getKey('project/renderer/gammaOutput'),
        text: 'γ输出',
        onChange: function () {
            config.setKey('project/renderer/gammaOutput', this.getValue());
            updateRenderer();
        }
    });

    rendererPropertiesRow.add(rendererGammaOutput);

    container.add(rendererPropertiesRow);

    container.render();

    // VR

    var vrRow = new UI.Row();
    var vr = new UI.Checkbox({
        value: config.getKey('project/vr'),
        style: 'left: 100px;',
        onChange: function () {
            config.setKey('project/vr', this.getValue());
            // updateRenderer();
        }
    });

    vrRow.add(new UI.Label({
        text: '虚拟现实',
        style: 'width: 90px;'
    }));

    vrRow.add(vr);

    container.add(vrRow);

    //

    function updateRenderer() {
        createRenderer(rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue());
    }

    var _this = this;

    function createRenderer(type, antialias, shadows, gammaIn, gammaOut) {
        if (type === 'WebGLRenderer' && System.support.webgl === false) {
            type = 'CanvasRenderer';
        }

        rendererPropertiesRow.dom.style.display = type === 'WebGLRenderer' ? '' : 'none';

        var renderer = new rendererTypes[type]({ antialias: antialias });
        renderer.gammaInput = gammaIn;
        renderer.gammaOutput = gammaOut;
        if (shadows && renderer.shadowMap) {

            renderer.shadowMap.enabled = true;
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        }

        _this.app.call('rendererChanged', _this, renderer);
    }

    createRenderer(config.getKey('project/renderer'), config.getKey('project/renderer/antialias'), config.getKey('project/renderer/shadows'), config.getKey('project/renderer/gammaInput'), config.getKey('project/renderer/gammaOutput'));

    return container;

};

export default ProjectPanel;