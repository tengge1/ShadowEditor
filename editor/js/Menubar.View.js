/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.View = function (editor) {

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

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('VR模式');
    option.onClick(function () {

        if (WEBVR.isAvailable() === true) {

            editor.signals.enterVR.dispatch();

        } else {

            alert('WebVR不可用');

        }

    });
    options.add(option);

    return container;

};
