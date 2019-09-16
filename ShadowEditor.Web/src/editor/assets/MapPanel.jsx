import './css/MapPanel.css';
import { classNames, PropTypes, SearchField, ImageList, IconButton, ContextMenu, MenuItem, IconMenuButton } from '../../third_party';
import EditWindow from './window/EditWindow.jsx';

/**
 * 贴图面板
 * @author tengge / https://github.com/tengge1
 */
class MapPanel extends React.Component {
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
            list = list.filter(n => {
                return n.Name.toLowerCase().indexOf(name.toLowerCase()) > -1 ||
                    n.FirstPinYin.toLowerCase().indexOf(name.toLowerCase()) > -1 ||
                    n.TotalPinYin.toLowerCase().indexOf(name.toLowerCase()) > -1;
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
            });
        });

        return <div className={classNames('MapPanel', className)} style={style}>
            <div className="toolbar">
                <IconMenuButton
                    className={'add'}
                    icon={'add'}>
                    <ContextMenu>
                        <MenuItem title={_t('Upload Image')} onClick={this.handleAdd}></MenuItem>
                        <MenuItem title={_t('Upload Sky Box')}></MenuItem>
                        <MenuItem title={_t('Upload Video')}></MenuItem>
                    </ContextMenu>
                </IconMenuButton>
                <SearchField
                    className={'search'}
                    data={categoryData}
                    placeholder={_t('Search Content')}
                    addHidden={true}
                    onInput={this.handleSearch.bind(this)}></SearchField>
            </div>
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
        fetch(`${app.options.server}/api/Category/List?type=Map`).then(response => {
            response.json().then(obj => {
                this.setState({
                    categoryData: obj.Data,
                });
            });
        });
        fetch(`${app.options.server}/api/Map/List`).then(response => {
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
        app.call(`selectMap`, this, data);
    }

    // ------------------------------- 上传 ---------------------------------------

    handleAdd() {
        app.upload(`${app.options.server}/api/Map/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(_t(obj.Msg));
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditWindow, {
            type: 'Map',
            typeName: _t('Map'),
            data,
            saveUrl: `${app.options.server}/api/Map/Edit`,
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
                fetch(`${app.options.server}/api/Map/Delete?ID=${data.id}`, {
                    method: 'POST',
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code === 200) {
                            this.update();
                        }
                        app.toast(_t(obj.Msg));
                    });
                });
            }
        });
    }
}

MapPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

MapPanel.defaultProps = {
    className: null,
    style: null,
    show: false,
};

export default MapPanel;