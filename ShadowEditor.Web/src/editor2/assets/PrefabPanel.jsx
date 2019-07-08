import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import EditWindow from './window/EditWindow.jsx';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 预设体面板
 * @author tengge / https://github.com/tengge1
 */
class PrefabPanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [];

        this.state = {
            data: [],
            categoryData: [],
        };

        this.handleClick = this.handleClick.bind(this);
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
                src: n.Thumbnail ? n.Thumbnail : null,
                title: n.Name,
                icon: 'model',
                cornerText: n.Type,
            });
        });

        return <div className={classNames('PrefabPanel', className)} style={style}>
            <SearchField
                data={categoryData}
                placeholder={L_SEARCH_CONTENT}
                addHidden={true}
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
        fetch(`/api/Category/List?type=Prefab`).then(response => {
            response.json().then(obj => {
                this.setState({
                    categoryData: obj.Data,
                });
            });
        });
        fetch(`/api/Prefab/List`).then(response => {
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

    handleClick(data) {
        Ajax.get(`/api/Prefab/Get?ID=${data.ID}`, result => {
            var obj = JSON.parse(result);
            if (obj.Code === 200) {
                //var material = (new MaterialsSerializer()).fromJSON(obj.Data.Data);
                //app.call(`selectMaterial`, this, material);
            }
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditWindow, {
            type: 'Prefab',
            typeName: L_PREFAB,
            data,
            saveUrl: `${app.options.server}/api/Prefab/Edit`,
            callback: this.update,
        });

        app.addElement(win);
    }

    // ------------------------------ 删除 ----------------------------------------

    handleDelete(data) {
        var server = app.options.server;

        app.confirm({
            title: L_CONFIRM,
            content: `${L_DELETE} ${data.title}?`,
            onOK: () => {
                fetch(`${server}/api/Prefab/Delete?ID=${data.id}`, {
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

PrefabPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

PrefabPanel.defaultProps = {
    className: null,
    style: null,
    show: false,
};

export default PrefabPanel;