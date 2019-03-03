import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';
import Ajax from '../../utils/Ajax';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ToolMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ToolMenu.prototype = Object.create(UI.Control.prototype);
ToolMenu.prototype.constructor = ToolMenu;

ToolMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '工具'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: '整理贴图',
                cls: 'option',
                onClick: this.onArrangeMap.bind(this)
            }, {
                xtype: 'div',
                html: '整理模型',
                cls: 'option',
                onClick: this.onArrangeMesh.bind(this)
            }]
        }]
    });

    container.render();
}

ToolMenu.prototype.onArrangeMap = function () {
    UI.confirm('询问', '整理贴图会去除名称后的数字和下划线，重新生成数据表和贴图目录，移除空文件夹和未引用贴图文件，系统会自动备份数据表和贴图目录，是否整理？', (event, btn) => {
        if (btn === 'ok') {
            fetch(`${this.app.options.server}/api/ArrangeMap/Run`, {
                method: 'POST'
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        UI.msg(json.Msg);
                    });
                }
            });
        }
    });
};

ToolMenu.prototype.onArrangeMesh = function () {
    UI.confirm('询问', '整理模型会去除名称后的数字和下划线，重新生成数据表、模型目录，移除空文件夹和未引用模型文件，系统会自动备份数据表、模型目录，是否整理？', (event, btn) => {
        if (btn === 'ok') {
            fetch(`${this.app.options.server}/api/ArrangeMesh/Run`, {
                method: 'POST'
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        UI.msg(json.Msg);
                    });
                }
            });
        }
    });
};

export default ToolMenu;