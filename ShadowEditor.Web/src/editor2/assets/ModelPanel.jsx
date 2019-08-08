import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import EditWindow from './window/EditWindow.jsx';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 模型面板
 * @author tengge / https://github.com/tengge1
 */
class ModelPanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [];

        this.state = {
            data: [],
            categoryData: [],
        };

        this.handleClick = this.handleClick.bind(this);

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.update = this.update.bind(this);
    }

    render() {
        const { className, style } = this.props;
        const { data, categoryData } = this.state;

        const imageListData = data.map(n => {
            return Object.assign({}, n, {
                id: n.ID,
                src: n.Thumbnail ? `${app.options.server}${n.Thumbnail}` : null,
                title: n.Name,
                icon: 'model',
                cornerText: n.Type,
            });
        });

        return <div className={classNames('ModelPanel', className)} style={style}>
            <SearchField
                data={categoryData}
                placeholder={L_SEARCH_CONTENT}
                onAdd={this.handleAdd}
                onInput={this.handleSearch.bind(this)}></SearchField>
            <ImageList
                data={imageListData}
                onClick={this.handleClick}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}></ImageList>
        </div>;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.init === undefined && this.props.show === true) {
            this.init = true;
            this.update();
        }
    }

    update() {
        fetch(`${app.options.server}/api/Category/List?type=Mesh`).then(response => {
            response.json().then(obj => {
                this.setState({
                    categoryData: obj.Data,
                });
            });
        });
        fetch(`${app.options.server}/api/Mesh/List`).then(response => {
            response.json().then(obj => {
                this.data = obj.Data;
                this.setState({
                    data: this.data,
                });
            });
        });
    }

    handleSearch(name, categories, event) {
        var list = this.data;

        if (name.trim() !== '') {
            name = name.toLowerCase();

            list = list.filter(n => {
                return n.Name.indexOf(name) > -1 ||
                    n.FirstPinYin.indexOf(name) > -1 ||
                    n.TotalPinYin.indexOf(name) > -1;
            });
        }

        if (categories.length > 0) {
            list = list.filter(n => {
                return categories.indexOf(n.CategoryID) > -1;
            });
        }

        this.setState({
            data: list,
        });
    }

    handleClick(model) {
        var loader = new ModelLoader(app);

        var url = model.Url;

        if (model.Url.indexOf(';') > -1) { // 包含多个入口文件
            url = url.split(';').map(n => app.options.server + n);
        } else {
            url = app.options.server + model.Url;
        }

        loader.load(url, model, {
            camera: app.editor.camera,
            renderer: app.editor.renderer,
            audioListener: app.editor.audioListener
        }).then(obj => {
            if (!obj) {
                return;
            }
            obj.name = model.Name;

            Object.assign(obj.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj);
            cmd.execute();

            if (obj.userData.scripts) {
                obj.userData.scripts.forEach(n => {
                    app.editor.scripts[n.uuid] = n;
                });
                app.call('scriptChanged', this);
            }
        });
    }

    // ------------------------------- 上传 ---------------------------------------

    handleAdd() {
        app.upload(`${app.options.server}/api/Mesh/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(obj.Msg);
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditWindow, {
            type: 'Mesh',
            typeName: L_MODEL,
            data,
            saveUrl: `${app.options.server}/api/Mesh/Edit`,
            callback: this.update,
        });

        app.addElement(win);
    }

    // ------------------------------ 删除 ----------------------------------------

    handleDelete(data) {
        app.confirm({
            title: L_CONFIRM,
            content: `${L_DELETE} ${data.title}?`,
            onOK: () => {
                fetch(`${app.options.server}/api/Mesh/Delete?ID=${data.id}`, {
                    method: 'POST',
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code === 200) {
                            this.update();
                        }
                        app.toast(obj.Msg);
                    });
                });
            }
        });
    }
}

ModelPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

ModelPanel.defaultProps = {
    className: null,
    style: null,
    show: false,
};

export default ModelPanel;