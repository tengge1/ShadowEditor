import UI from './Manager';

import Control from './Control';
import SvgControl from './SvgControl';

// 使用非侵入式开发方式重构UI类库
import './Boolean';
import './Break';
import './Button';
import './Checkbox';
import './CloseButton';
import './Color';
import './Container';
import './Div';
import './HorizontalRule';
import './Html';
import './IconButton';
import './Input';
import './Integer';
import './Label';
import './Modal';
import './Number';
import './Row';
import './Select';
import './Span';
import './Text';
import './TextArea';
import './Texture';
import './Window';
import './Image';
import './ImageList';
import './MessageBox';
import './Alert';
import './Confirm';
import './Prompt';
import './SearchField';
import './ToolbarFiller';
import './Canvas';
import './Timeline';
import './ImageUploader';
import './LinkButton';
import './Category';
import './DataTable';
import './Tree';
import './Icon';
import './ProgressBar';

// 添加一些实用功能
Object.assign(UI, {
    Control: Control,
    SvgControl: SvgControl,

    msg: function (text) { // 简洁消息提示框，5秒自动消息并销毁dom
        var msg = UI.create({ xtype: 'msg' });
        msg.render();
        msg.show(text);
    },

    alert: function (title, content, callback) { // 消息框，点击确认/关闭窗口后自动销毁dom
        var alert = UI.create({
            xtype: 'alert',
            title: title,
            content: content,
            callback: function (event) {
                var result = true;

                if (callback) {
                    result = callback(event);
                }

                if (result !== false) {
                    this.destroy(); // 销毁dom
                }

                return result; // 返回true关闭窗口，返回false不关闭窗口
            }
        });
        alert.render();
        alert.show();
    },

    confirm: function (title, content, callback) { // 询问对话框，点击确认/取消/关闭后自动销毁dom
        var confirm = UI.create({
            xtype: 'confirm',
            title: title,
            content: content,
            callback: function (event, btn) {
                var result = true;

                if (callback) {
                    result = callback(event, btn);
                }

                if (result !== false) {
                    this.destroy(); // 销毁dom
                }

                return result; // 返回true关闭窗口，返回false不关闭窗口
            }
        });
        confirm.render();
        confirm.show();
    },

    prompt: function (title, label, value, callback) {
        var prompt = UI.create({
            xtype: 'prompt',
            title: title,
            label: label,
            value: value,
            callback: function (event, value) {
                var result = true;

                if (callback) {
                    result = callback(event, value);
                }

                if (result !== false) {
                    this.destroy(); // 销毁dom
                }

                return result; // 返回true关闭窗口，返回false不关闭窗口
            }
        });
        prompt.render();
        prompt.show();
    }
});

window.UI = UI;

export default UI;