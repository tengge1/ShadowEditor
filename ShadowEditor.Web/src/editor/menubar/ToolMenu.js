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
            html: L_TOOL
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: L_ARRANGE_MAP,
                cls: 'option',
                onClick: this.onArrangeMap.bind(this)
            }, {
                xtype: 'div',
                html: L_ARRANGE_MESH,
                cls: 'option',
                onClick: this.onArrangeMesh.bind(this)
            }, {
                xtype: 'div',
                html: L_ARRANGE_THUMBNAIL,
                cls: 'option',
                onClick: this.onArrangeThumbnail.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: L_EXPORT_EDITOR,
                cls: 'option',
                onClick: this.onExportEditor.bind(this)
            }]
        }]
    });

    container.render();
}

ToolMenu.prototype.onArrangeMap = function () {
    UI.confirm('询问', '整理贴图会去除名称后的数字和下划线，重新生成数据表和贴图目录，移除空文件夹和未引用贴图文件，系统会自动备份数据表和贴图目录，是否整理？', (event, btn) => {
        if (btn === 'ok') {
            fetch(`${app.options.server}/api/ArrangeMap/Run`, {
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
            fetch(`${app.options.server}/api/ArrangeMesh/Run`, {
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

ToolMenu.prototype.onArrangeThumbnail = function () {
    UI.confirm('询问', '整理缩略图会重新生成缩略图目录，修改场景、模型、贴图、材质、音频、动画、粒子、预设体、人物的缩略图路径，请先手动备份数据库，是否整理？', (event, btn) => {
        if (btn === 'ok') {
            fetch(`${app.options.server}/api/ArrangeThumbnail/Run`, {
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

ToolMenu.prototype.onExportEditor = function () {
    UI.confirm('询问', '是否导出编辑器？', (event, btn) => {
        if (btn === 'ok') {
            fetch(`${app.options.server}/api/ExportEditor/Run`, {
                method: 'POST'
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        UI.msg(json.Msg);
                        window.open(`${app.options.server}${json.Url}`, 'export');
                    });
                }
            });
        }
    });
};

export default ToolMenu;