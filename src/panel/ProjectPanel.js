import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ProjectPanel(editor) {

    this.app = editor.app;

    var config = editor.config;
    var signals = editor.signals;

    var rendererTypes = {

        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer

    };

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // class

    var options = {};

    for (var key in rendererTypes) {

        if (key.indexOf('WebGL') >= 0 && System.support.webgl === false) continue;

        options[key] = key;

    }

    var rendererTypeRow = new UI.Row();
    var rendererType = new UI.Select().setOptions(options).setWidth('150px').onChange(function () {

        var value = this.getValue();

        config.setKey('project/renderer', value);

        updateRenderer();

    });

    rendererTypeRow.add(new UI.Text('渲染器').setWidth('90px'));
    rendererTypeRow.add(rendererType);

    container.add(rendererTypeRow);

    if (config.getKey('project/renderer') !== undefined) {

        rendererType.setValue(config.getKey('project/renderer'));

    }

    // antialiasing

    var rendererPropertiesRow = new UI.Row().setMarginLeft('90px');

    var rendererAntialias = new UI.Boolean(config.getKey('project/renderer/antialias'), '抗锯齿').onChange(function () {

        config.setKey('project/renderer/antialias', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererAntialias);

    // shadow

    var rendererShadows = new UI.Boolean(config.getKey('project/renderer/shadows'), '阴影').onChange(function () {

        config.setKey('project/renderer/shadows', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererShadows);

    rendererPropertiesRow.add(new UI.Break());

    // gamma input

    var rendererGammaInput = new UI.Boolean(config.getKey('project/renderer/gammaInput'), 'γ输入').onChange(function () {

        config.setKey('project/renderer/gammaInput', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererGammaInput);

    // gamma output

    var rendererGammaOutput = new UI.Boolean(config.getKey('project/renderer/gammaOutput'), 'γ输出').onChange(function () {

        config.setKey('project/renderer/gammaOutput', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererGammaOutput);

    container.add(rendererPropertiesRow);

    // VR

    var vrRow = new UI.Row();
    var vr = new UI.Checkbox(config.getKey('project/vr')).setLeft('100px').onChange(function () {

        config.setKey('project/vr', this.getValue());
        // updateRenderer();

    });

    vrRow.add(new UI.Text('虚拟现实').setWidth('90px'));
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

        rendererPropertiesRow.setDisplay(type === 'WebGLRenderer' ? '' : 'none');

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