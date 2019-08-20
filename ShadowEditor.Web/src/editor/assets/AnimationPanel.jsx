import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import EditWindow from './window/EditWindow.jsx';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 动画面板
 * @author tengge / https://github.com/tengge1
 */
class AnimationPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryData: [],
            name: '',
            categories: [],
        };

        this.handleClick = this.handleClick.bind(this);

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.update = this.update.bind(this);
    }

    render() {
        const { className, style } = this.props;
        const { data, categoryData, name, categories } = this.state;

        let list = data;

        if (name.trim() !== '') {
            name = name.toLowerCase();

            list = list.filter(n => {
                return n.Name.toLowerCase().indexOf(name) > -1 ||
                    n.FirstPinYin.toLowerCase().indexOf(name) > -1 ||
                    n.TotalPinYin.toLowerCase().indexOf(name) > -1;
            });
        }

        if (categories.length > 0) {
            list = list.filter(n => {
                return categories.indexOf(n.CategoryID) > -1;
            });
        }

        const imageListData = list.map(n => {
            return Object.assign({}, n, {
                id: n.ID,
                src: n.Thumbnail ? `${app.options.server}${n.Thumbnail}` : null,
                title: n.Name,
                icon: 'scenes',
                // cornerText: n.Type,
            });
        });

        return <div className={classNames('AnimationPanel', className)} style={style}>
            <SearchField
                data={categoryData}
                placeholder={_t('Search Content')}
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
        fetch(`${app.options.server}/api/Category/List?type=Animation`).then(response => {
            response.json().then(obj => {
                this.setState({
                    categoryData: obj.Data,
                });
            });
        });
        fetch(`${app.options.server}/api/Animation/List`).then(response => {
            response.json().then(obj => {
                this.setState({
                    data: obj.Data,
                });
            });
        });
    }

    handleSearch(name, categories, event) {
        this.setState({
            name,
            categories,
        });
    }

    handleClick(data) {
        app.call(`selectAnimation`, this, data);
    }

    // ------------------------------- 上传 ---------------------------------------

    handleAdd() {
        app.upload(`${app.options.server}/api/Animation/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(obj.Msg);
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditWindow, {
            type: 'Animation',
            typeName: _t('Animation'),
            data,
            saveUrl: `${app.options.server}/api/Animation/Edit`,
            callback: this.update,
        });

        app.addElement(win);
    }

    // ------------------------------ 删除 ----------------------------------------

    handleDelete(data) {
        app.confirm({
            title: _t('Confirm'),
            content: `${_t('Delete')} ${data.title}?`,
            onOK: () => {
                fetch(`${app.options.server}/api/Animation/Delete?ID=${data.id}`, {
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

AnimationPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

AnimationPanel.defaultProps = {
    className: null,
    style: null,
    show: false,
};

export default AnimationPanel;