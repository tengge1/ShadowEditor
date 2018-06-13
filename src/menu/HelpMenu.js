import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function HelpMenu(editor) {

    var container = new Panel();
    container.setClass('menu');

    var title = new Panel();
    title.setClass('title');
    title.setTextContent('帮助');
    container.add(title);

    var options = new Panel();
    options.setClass('options');
    container.add(options);

    // Source code

    var option = new Row();
    option.setClass('option');
    option.setTextContent('源码');
    option.onClick(function () {

        window.open('https://github.com/mrdoob/three.js/tree/master/editor', '_blank')

    });
    options.add(option);

    // About

    var option = new Row();
    option.setClass('option');
    option.setTextContent('关于');
    option.onClick(function () {

        window.open('http://threejs.org', '_blank');

    });
    options.add(option);

    return container;

};

export default HelpMenu;