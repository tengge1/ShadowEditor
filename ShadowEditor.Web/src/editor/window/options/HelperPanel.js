import UI from '../../../ui/UI';

/**
 * 帮助选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HelperPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

HelperPanel.prototype = Object.create(UI.Control.prototype);
HelperPanel.prototype.constructor = HelperPanel;

HelperPanel.prototype.render = function () {
    UI.create({
        xtype: 'div',
        id: 'panel',
        scope: this.id,
        parent: this.parent,
        html: '帮助面板'
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

HelperPanel.prototype.update = function () {

};

HelperPanel.prototype.save = function () {

};

export default HelperPanel;