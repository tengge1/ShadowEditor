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
import EditWindow from './window/EditWindow.jsx';

/**
 * 音频面板
 * @author tengge / https://github.com/tengge1
 */
class AudioPanel extends React.Component {
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
                icon: 'audio'
                // cornerText: n.Type,
            });
        });

        return <div className={classNames('AudioPanel', className)}
            style={style}
               >
            <SearchField
                data={categoryData}
                placeholder={_t('Search Content')}
                showAddButton={!enableAuthority || authorities.includes('ADD_AUDIO')}
                showFilterButton
                onAdd={this.handleAdd}
                onInput={this.handleSearch.bind(this)}
            />
            <ImageList
                data={imageListData}
                showEditButton={!enableAuthority || authorities.includes('EDIT_AUDIO')}
                showDeleteButton={!enableAuthority || authorities.includes('DELETE_AUDIO')}
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
        fetch(`${app.options.server}/api/Category/List?Type=Audio`).then(response => {
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
        fetch(`${app.options.server}/api/Audio/List`).then(response => {
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
        app.call(`selectAudio`, this, data);
    }

    // ------------------------------- 上传 ---------------------------------------

    handleAdd() {
        app.upload(`${app.options.server}/api/Audio/Add`, obj => {
            if (obj.Code === 200) {
                this.update();
            }
            app.toast(_t(obj.Msg));
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditWindow, {
            type: 'Audio',
            typeName: _t('Audio'),
            data,
            saveUrl: `${app.options.server}/api/Audio/Edit`,
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
                fetch(`${app.options.server}/api/Audio/Delete?ID=${data.id}`, {
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

AudioPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
};

AudioPanel.defaultProps = {
    className: null,
    style: null,
    show: false
};

export default AudioPanel;