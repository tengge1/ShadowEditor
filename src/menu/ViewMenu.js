import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ViewMenu(editor) {

    this.app = editor.app;

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('视图');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // VR mode
    var _this = this;

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('VR模式');
    option.onClick(function () {

        if (_this.app.renderer.vr.enabled) {
            _this.app.call('enterVR', _this);
        } else {

            alert('WebVR不可用');

        }

    });
    options.add(option);

    return container;

};

export default ViewMenu;