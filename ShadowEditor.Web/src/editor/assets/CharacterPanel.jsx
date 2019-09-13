import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import EditWindow from './window/EditWindow.jsx';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 角色面板
 * @author tengge / https://github.com/tengge1
 */
class CharacterPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryData: [],
            name: '',
            categories: [],
        };

        this.handleClick = this.handleClick.bind(this);
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
                icon: 'model',
                cornerText: n.Type,
            });
        });

        return <div className={classNames('CharacterPanel', className)} style={style}>
            <SearchField
                data={categoryData}
                placeholder={_t('Search Content')}
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
        fetch(`${app.options.server}/api/Category/List?type=Character`).then(response => {
            response.json().then(obj => {
                this.setState({
                    categoryData: obj.Data,
                });
            });
        });
        fetch(`${app.options.server}/api/Character/List`).then(response => {
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
        Ajax.get(`${app.options.server}/api/Character/Get?ID=${data.ID}`, result => {
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
            type: 'Character',
            typeName: _t('Character'),
            data,
            saveUrl: `${app.options.server}/api/Character/Edit`,
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
                fetch(`${app.options.server}/api/Character/Delete?ID=${data.id}`, {
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

CharacterPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

CharacterPanel.defaultProps = {
    className: null,
    style: null,
    show: false,
};

export default CharacterPanel;