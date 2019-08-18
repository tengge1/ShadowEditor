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
        return <MenuItem title={_t('Tool')}>
            <MenuItem title={_t('Arrange Map')} onClick={this.handleArrangeMap}></MenuItem>
            <MenuItem title={_t('Arrange Mesh')} onClick={this.handleArrangeMesh}></MenuItem>
            <MenuItem title={_t('Arrange Thumbnail')} onClick={this.handleArrangeThumbnail}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={_t('Export Editor')} onClick={this.handleExportEditor}></MenuItem>
        </MenuItem>;
    }

    handleArrangeMap() {
        app.confirm({
            title: _t('Query'),
            content: _t('Organizing the texture will remove the number and underscore after the name, regenerate the data table and texture catalog, remove the empty folder and unreferenced texture file, the system will automatically back up the data table and texture catalog, is it organized?'),
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
            title: _t('Query'),
            content: _t('Organizing the model will remove the number and underscore after the name, regenerate the data table, model catalog, remove empty folders and unreferenced model files, the system will automatically back up the data table, model catalog, whether to sort?'),
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
            title: _t('Query'),
            content: _t('Organizing the thumbnails will regenerate the thumbnail directory, modify the scene, model, texture, material, audio, animation, particles, preset body, and the thumbnail path of the characters. Please manually back up the database first.'),
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
            title: _t('Query'),
            content: _t('Are you sure to export the editor?'),
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