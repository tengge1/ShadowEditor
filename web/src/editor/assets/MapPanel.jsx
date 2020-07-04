/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/MapPanel.css';
import { classNames, PropTypes } from '../../third_party';
import { SearchField, ImageList, ContextMenu, MenuItem, IconMenuButton } from '../../ui/index';
import EditWindow from './window/EditWindow.jsx';
import AddSkyBoxWindow from './window/AddSkyBoxWindow.jsx';

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
            categories: []
        };

        this.handleClick = this.handleClick.bind(this);

        this.handleAddImage = this.handleAddImage.bind(this);
        this.handleAddSkyBox = this.handleAddSkyBox.bind(this);
        this.handleAddSkyBall = this.handleAddSkyBall.bind(this);
        this.handleAddVideo = this.handleAddVideo.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.update = this.update.bind(this);
    }

    render() {
        const { className, style } = this.props;
        const { data, categoryData, name, categories } = this.state;
        const { enableAuthority, authorities } = app.server;

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
                icon: 'scenes'
            });
        });

        return <div className={classNames('MapPanel', className)}
            style={style}
               >
            <div className="toolbar">
                <IconMenuButton
                    className={'add'}
                    icon={'add'}
                    show={!enableAuthority || authorities.includes('ADD_MAP')}
                >
                    <ContextMenu>
                        <MenuItem title={_t('Upload Image')}
                            onClick={this.handleAddImage}
                        />
                        <MenuItem title={_t('Upload Sky Box')}
                            onClick={this.handleAddSkyBox}
                        />
                        <MenuItem title={_t('Upload Sky Ball')}
                            onClick={this.handleAddSkyBall}
                        />
                        <MenuItem title={_t('Upload Video')}
                            onClick={this.handleAddVideo}
                        />
                    </ContextMenu>
                </IconMenuButton>
                <SearchField
                    className={'search'}
                    data={categoryData}
                    placeholder={_t('Search Content')}
                    showFilterButton
                    onInput={this.handleSearch.bind(this)}
                />
            </div>
            <ImageList
                data={imageListData}
                showEditButton={!enableAuthority || authorities.includes('EDIT_MAP')}
                showDeleteButton={!enableAuthority || authorities.includes('DELETE_MAP')}
                onClick={this.handleClick}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
            />
        </div>;
    }

    componentDidUpdate() {
        if (this.init === undefined && this.props.show === true) {
            this.init = true;
            this.update();
        }
    }

    update() {
        fetch(`${app.options.server}/api/Category/List?Type=Map`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.setState({
                    categoryData: obj.Data
                });
            });
        });
        fetch(`${app.options.server}/api/Map/List`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.setState({
                    data: obj.Data
                });
            });
        });
    }

    handleSearch(name, categories) {
        this.setState({
            name,
            categories
        });
    }

    handleClick(data) {
        app.call(`selectMap`, this, data);
    }

    // ------------------------------- 上传图片 ---------------------------------------

    handleAddImage() {
        app.upload(`${app.options.server}/api/Map/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(_t(obj.Msg));
        });
    }

    // ---------------------------- 上传天空盒 --------------------------------------

    handleAddSkyBox() {
        const win = app.createElement(AddSkyBoxWindow, {
            callback: this.update
        });

        app.addElement(win);
    }

    // ---------------------------- 上传天空球 ---------------------------------------

    handleAddSkyBall() {
        app.upload(`${app.options.server}/api/Map/Add?type=skyBall`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(_t(obj.Msg));
        });
    }

    // ------------------------------ 上传视频 --------------------------------------

    handleAddVideo() {
        app.upload(`${app.options.server}/api/Map/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(_t(obj.Msg));
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        const win = app.createElement(EditWindow, {
            type: 'Map',
            typeName: _t('Map'),
            data,
            saveUrl: `${app.options.server}/api/Map/Edit`,
            callback: this.update
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
                    method: 'POST'
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
    show: PropTypes.bool
};

MapPanel.defaultProps = {
    className: null,
    style: null,
    show: false
};

export default MapPanel;