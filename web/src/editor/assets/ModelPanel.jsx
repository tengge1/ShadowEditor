/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { classNames, PropTypes } from '../../third_party';
import { SearchField, ImageList } from '../../ui/index';
import EditModelWindow from './window/EditModelWindow.jsx';
import ModelLoader from '../../loader/ModelLoader';
import AddObjectCommand from '../../command/AddObjectCommand';

/**
 * 模型面板
 * @author tengge / https://github.com/tengge1
 */
class ModelPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryData: [],
            name: '',
            categories: []
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
                icon: 'model',
                cornerText: n.Type
            });
        });

        return <div className={classNames('ModelPanel', className)}
            style={style}
               >
            <SearchField
                data={categoryData}
                placeholder={_t('Search Content')}
                showAddButton={!enableAuthority || authorities.includes('ADD_MESH')}
                showFilterButton
                onAdd={this.handleAdd}
                onInput={this.handleSearch.bind(this)}
            />
            <ImageList
                data={imageListData}
                showEditButton={!enableAuthority || authorities.includes('EDIT_MESH')}
                showDeleteButton={!enableAuthority || authorities.includes('DELETE_MESH')}
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
        fetch(`${app.options.server}/api/Category/List?Type=Mesh`).then(response => {
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
        fetch(`${app.options.server}/api/Mesh/List`).then(response => {
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

    handleClick(model) {
        let loader = new ModelLoader(app);

        let url = model.Url;

        if (model.Url.indexOf(';') > -1) { // 包含多个入口文件
            url = url.split(';').map(n => app.options.server + n);
        } else {
            url = app.options.server + model.Url;
        }

        loader.load(url, model, {
            camera: app.editor.camera,
            renderer: app.editor.renderer,
            audioListener: app.editor.audioListener,
            clearChildren: true
        }).then(obj => {
            if (!obj) {
                return;
            }
            obj.name = model.Name;

            Object.assign(obj.userData, model, {
                Server: true
            });

            if (app.storage.addMode === 'click') {
                this.clickSceneToAdd(obj);
            } else {
                this.addToCenter(obj);
            }
        });
    }

    // 添加到场景中心
    addToCenter(obj) {
        var cmd = new AddObjectCommand(obj);
        cmd.execute();

        if (obj.userData.scripts) {
            obj.userData.scripts.forEach(n => {
                app.editor.scripts.push(n);
            });
            app.call('scriptChanged', this);
        }
    }

    // 点击场景添加
    clickSceneToAdd(obj) {
        let added = false;
        app.editor.gpuPickNum += 1;
        app.on(`gpuPick.ModelPanel`, intersect => { // 鼠标移动出现预览效果
            if (!intersect.point) {
                return;
            }
            if (!added) {
                added = true;
                app.editor.sceneHelpers.add(obj);
            }
            obj.position.copy(intersect.point);
        });
        app.on(`raycast.ModelPanel`, intersect => { // 点击鼠标放置模型
            app.on(`gpuPick.ModelPanel`, null);
            app.on(`raycast.ModelPanel`, null);
            obj.position.copy(intersect.point);
            this.addToCenter(obj);
            app.editor.gpuPickNum -= 1;
        });
    }

    // ------------------------------- 上传 ---------------------------------------

    handleAdd() {
        app.upload(`${app.options.server}/api/Mesh/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(_t(obj.Msg));
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditModelWindow, {
            data,
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
                fetch(`${app.options.server}/api/Mesh/Delete?ID=${data.id}`, {
                    method: 'POST'
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code !== 200) {
                            app.toast(_t(obj.Msg), 'warn');
                            return;
                        }
                        this.update();
                    });
                });
            }
        });
    }
}

ModelPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
};

ModelPanel.defaultProps = {
    className: null,
    style: null,
    show: false
};

export default ModelPanel;