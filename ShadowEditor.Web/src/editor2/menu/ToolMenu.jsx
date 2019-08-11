import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import Converter from '../../serialization/Converter';
import Ajax from '../../utils/Ajax';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 */
class ToolMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleArrangeMap = this.handleArrangeMap.bind(this);
        this.handleArrangeMesh = this.handleArrangeMesh.bind(this);
        this.handleArrangeThumbnail = this.handleArrangeThumbnail.bind(this);
        this.handleExportEditor = this.handleExportEditor.bind(this);
    }

    render() {
        return <MenuItem title={L_TOOL}>
            <MenuItem title={L_ARRANGE_MAP} onClick={this.handleArrangeMap}></MenuItem>
            <MenuItem title={L_ARRANGE_MESH} onClick={this.handleArrangeMesh}></MenuItem>
            <MenuItem title={L_ARRANGE_THUMBNAIL} onClick={this.handleArrangeThumbnail}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_EXPORT_EDITOR} onClick={this.handleExportEditor}></MenuItem>
        </MenuItem>;
    }

    handleArrangeMap() {
        app.confirm({
            title: '询问',
            content: '整理贴图会去除名称后的数字和下划线，重新生成数据表和贴图目录，移除空文件夹和未引用贴图文件，系统会自动备份数据表和贴图目录，是否整理？',
            onOK: () => {
                fetch(`${app.options.server}/api/ArrangeMap/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(json.Msg);
                        });
                    }
                });
            }
        });
    }

    handleArrangeMesh() {
        app.confirm({
            title: '询问',
            content: '整理模型会去除名称后的数字和下划线，重新生成数据表、模型目录，移除空文件夹和未引用模型文件，系统会自动备份数据表、模型目录，是否整理？',
            onOK: () => {
                fetch(`${app.options.server}/api/ArrangeMesh/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(json.Msg);
                        });
                    }
                });
            }
        });
    }

    handleArrangeThumbnail() {
        app.confirm({
            title: '询问',
            content: '整理缩略图会重新生成缩略图目录，修改场景、模型、贴图、材质、音频、动画、粒子、预设体、人物的缩略图路径，请先手动备份数据库，是否整理？',
            onOK: () => {
                fetch(`${app.options.server}/api/ArrangeThumbnail/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(json.Msg);
                        });
                    }
                });
            }
        });
    }

    handleExportEditor() {
        app.confirm({
            title: '询问',
            content: '是否导出编辑器？',
            onOK: () => {
                fetch(`${app.options.server}/api/ExportEditor/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(json.Msg);
                            window.open(`${app.options.server}${json.Url}`, 'export');
                        });
                    }
                });
            }
        });
    }
}

export default ToolMenu;