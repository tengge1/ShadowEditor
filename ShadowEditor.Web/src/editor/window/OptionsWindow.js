import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 选项窗口
 * @param {*} options 
 */
function OptionsWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

OptionsWindow.prototype = Object.create(UI.Control.prototype);
OptionsWindow.prototype.constructor = OptionsWindow;

OptionsWindow.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'window',
        id: 'optionsWindow',
        parent: this.app.container,
        title: '选项窗口',
        width: '700px',
        height: '500px',
        bodyStyle: {
            paddingTop: 0
        },
        shade: false,
        children: [

        ]
    });
    container.render();
};

OptionsWindow.prototype.show = function () {
    UI.get('optionsWindow').show();
};

export default OptionsWindow;