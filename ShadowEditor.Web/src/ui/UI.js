import Boolean from './Boolean';
import Break from './Break';
import Button from './Button';
import Checkbox from './Checkbox';
import CloseButton from './CloseButton';
import Color from './Color';
import Container from './Container';
import Control from './Control';
import Div from './Div';
import HorizontalRule from './HorizontalRule';
import Html from './Html';
import IconButton from './IconButton';
import Input from './Input';
import Integer from './Integer';
import Label from './Label';
import Modal from './Modal';
import Number from './Number';
import Outliner from './Outliner';
import Row from './Row';
import Select from './Select';
import Span from './Span';
import Text from './Text';
import TextArea from './TextArea';
import Texture from './Texture';
import Window from './Window';
import Image from './Image';
import ImageList from './ImageList';
import MessageBox from './MessageBox';
import Table from './Table';
import TableHead from './TableHead';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableData from './TableData';
import Alert from './Alert';
import Confirm from './Confirm';
import Prompt from './Prompt';
import SearchField from './SearchField';
import ToolbarFiller from './ToolbarFiller';
import Canvas from './Canvas';

/**
 * UI类
 * @author tengge / https://github.com/tengge1
 */
function UICls() {
    this.xtypes = {};
    this.objects = {};
}

/**
 * 添加xtype
 * @param {*} name xtype字符串
 * @param {*} cls xtype对应类
 */
UICls.prototype.addXType = function (name, cls) {
    if (this.xtypes[name] === undefined) {
        this.xtypes[name] = cls;
    } else {
        console.warn(`UICls: xtype named ${name} has already been added.`);
    }
};

/**
 * 删除xtype
 * @param {*} name xtype字符串
 */
UICls.prototype.removeXType = function (name) {
    if (this.xtypes[name] !== undefined) {
        delete this.xtypes[name];
    } else {
        console.warn(`UICls: xtype named ${name} is not defined.`);
    }
};

/**
 * 获取xtype
 * @param {*} name xtype字符串
 */
UICls.prototype.getXType = function (name) {
    if (this.xtypes[name] === undefined) {
        console.warn(`UICls: xtype named ${name} is not defined.`);
    }
    return this.xtypes[name];
};

/**
 * 添加一个对象到缓存
 * @param {*} id 对象id
 * @param {*} obj 对象
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.add = function (id, obj, scope = "global") {
    var key = `${scope}:${id}`;
    if (this.objects[key] !== undefined) {
        console.warn(`UICls: object named ${id} has already been added.`);
    }
    this.objects[key] = obj;
};

/**
 * 从缓存中移除一个对象
 * @param {*} id 对象id
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.remove = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    if (this.objects[key] != undefined) {
        delete this.objects[key];
    } else {
        console.warn(`UICls: object named ${id} is not defined.`);
    }
};

/**
 * 从缓存中获取一个对象
 * @param {*} id 控件id
 * @param {*} scope 对象作用域（默认为global）
 */
UICls.prototype.get = function (id, scope = 'global') {
    var key = `${scope}:${id}`;
    // 经常需要通过该方法判断是否已经注册某个元素，所以不能产生警告。
    // if (this.objects[key] === undefined) {
    //     console.warn(`UICls: object named ${id} is not defined.`);
    // }
    return this.objects[key];
};

/**
 * 通过json配置创建UI实例，并自动将包含id的控件添加到缓存
 * @param {*} config xtype配置
 */
UICls.prototype.create = function (config) {
    if (config instanceof Control) { // config是Control实例
        return config;
    }

    // config是json配置
    if (config == null || config.xtype == null) {
        throw 'UICls: config is undefined.';
    }

    if (config.xtype === undefined) {
        throw 'UICls: config.xtype is undefined.';
    }

    var cls = this.xtypes[config.xtype];
    if (cls == null) {
        throw `UICls: xtype named ${config.xtype} is undefined.`;
    }

    return new cls(config);
};

/**
 * UICls唯一一个实例
 */
const UI = new UICls();

// 添加所有控件
Object.assign(UI, {
    Boolean: Boolean,
    Break: Break,
    Button: Button,
    Checkbox: Checkbox,
    CloseButton: CloseButton,
    Color: Color,
    Container: Container,
    Control: Control,
    Div: Div,
    HorizontalRule: HorizontalRule,
    Html: Html,
    IconButton: IconButton,
    Input: Input,
    Integer: Integer,
    Label: Label,
    Modal: Modal,
    Number: Number,
    Outliner: Outliner,
    Row: Row,
    Select: Select,
    Span: Span,
    Text: Text,
    TextArea: TextArea,
    Texture: Texture,
    Window: Window,
    Image: Image,
    ImageList: ImageList,
    MessageBox: MessageBox,
    Table: Table,
    TableHead: TableHead,
    TableBody: TableBody,
    TableRow: TableRow,
    TableData: TableData,
    Alert: Alert,
    Confirm: Confirm,
    Prompt: Prompt,
    SearchField: SearchField,
    ToolbarFiller: ToolbarFiller,
    Canvas: Canvas
});

// 添加所有控件的XType
UI.addXType('boolean', Boolean);
UI.addXType('br', Break);
UI.addXType('button', Button);
UI.addXType('checkbox', Checkbox);
UI.addXType('closebutton', CloseButton);
UI.addXType('color', Color);
UI.addXType('container', Container);
UI.addXType('control', Control);
UI.addXType('div', Div);
UI.addXType('hr', HorizontalRule);
UI.addXType('html', Html);
UI.addXType('iconbutton', IconButton);
UI.addXType('input', Input);
UI.addXType('int', Integer);
UI.addXType('label', Label);
UI.addXType('modal', Modal);
UI.addXType('number', Number);
UI.addXType('outliner', Outliner);
UI.addXType('row', Row);
UI.addXType('select', Select);
UI.addXType('span', Span);
UI.addXType('text', Text);
UI.addXType('textarea', TextArea);
UI.addXType('texture', Texture);
UI.addXType('window', Window);
UI.addXType('image', Image);
UI.addXType('imagelist', ImageList);
UI.addXType('msg', MessageBox);
UI.addXType('table', Table);
UI.addXType('thead', TableHead);
UI.addXType('tbody', TableBody);
UI.addXType('tr', TableRow);
UI.addXType('td', TableData);
UI.addXType('alert', Alert);
UI.addXType('confirm', Confirm);
UI.addXType('prompt', Prompt);
UI.addXType('searchfield', SearchField);
UI.addXType('toolbarfiller', ToolbarFiller);
UI.addXType('canvas', Canvas);

// 添加一些实用功能
Object.assign(UI, {
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