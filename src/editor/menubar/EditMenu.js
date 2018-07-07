import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 编辑菜单
 * @param {*} options 
 */
function EditMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

EditMenu.prototype = Object.create(Control.prototype);
EditMenu.prototype.constructor = EditMenu;

EditMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '编辑'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mUndo',
                html: '撤销(Ctrl+Z)',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mUndo');
                }
            }, {
                xtype: 'div',
                id: 'mRedo',
                html: '重做(Ctrl+Shift+Z)',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mRedo');
                }
            }, {
                xtype: 'div',
                id: 'mClearHistory',
                html: '清空历史记录',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mClearHistory');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mClone',
                html: '复制',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mClone');
                }
            }, {
                xtype: 'div',
                id: 'mDelete',
                html: '删除(Del)',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mDelete');
                }
            }, {
                xtype: 'div',
                id: 'mMinifyShader',
                html: '压缩着色器程序',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mMinifyShader');
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default EditMenu;