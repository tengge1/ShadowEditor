/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/CategoryWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, Content, Buttons, Button, DataGrid, Column, VBoxLayout, Toolbar } from '../../../ui/index';
import Ajax from '../../../utils/Ajax';
import CategoryEditWindow from './CategoryEditWindow.jsx';

/**
 * 类别窗口
 * @author tengge / https://github.com/tengge1
 */
class CategoryWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selected: null
        };

        this.updateUI = this.updateUI.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { typeName } = this.props;
        const { data, selected } = this.state;
        const { enableAuthority, authorities } = app.server;

        return <Window
            className={'CategoryWindow'}
            title={`${typeName} ${_t('Category Edit')}`}
            style={{ width: '280px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <VBoxLayout className={'box'}>
                    <Toolbar className={'toolbar'}>
                        <Button show={!enableAuthority || authorities.includes('SAVE_CATEGORY')}
                            onClick={this.handleAdd}
                        >{_t('Create')}</Button>
                        <Button show={!enableAuthority || authorities.includes('SAVE_CATEGORY')}
                            onClick={this.handleEdit}
                        >{_t('Edit')}</Button>
                        <Button show={!enableAuthority || authorities.includes('DELETE_CATEGORY')}
                            onClick={this.handleDelete}
                        >{_t('Delete')}</Button>
                    </Toolbar>
                    <DataGrid className={'list'}
                        data={data}
                        selected={selected ? selected.ID : null}
                        onSelect={this.handleSelect}
                    >
                        <Column type={'number'}
                            title={_t('#')}
                        />
                        <Column field={'Name'}
                            title={_t('Name')}
                        />
                    </DataGrid>
                </VBoxLayout>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    updateUI() {
        Ajax.getJson(`${app.options.server}/api/Category/List?Type=${this.props.type}`, json => {
            this.setState({
                data: json.Data.map(n => {
                    return {
                        id: n.ID,
                        ID: n.ID,
                        Name: n.Name
                    };
                })
            });
        });
    }

    handleAdd() {
        const { type, typeName } = this.props;

        let window = app.createElement(CategoryEditWindow, {
            type,
            typeName,
            id: null,
            name: '',
            callback: this.updateUI
        });

        app.addElement(window);
    }

    handleEdit() {
        const { type, typeName } = this.props;
        const { selected } = this.state;

        if (!selected) {
            app.toast(_t('Please select a record.'), 'warn');
            return;
        }

        let window = app.createElement(CategoryEditWindow, {
            type,
            typeName,
            id: selected.ID,
            name: selected.Name,
            callback: this.updateUI
        });

        app.addElement(window);
    }

    handleDelete() {
        const { selected } = this.state;

        if (!selected) {
            app.toast(_t('Please select a record.'), 'warn');
            return;
        }

        app.confirm({
            title: _t('Query'),
            content: _t('Delete this category?'),
            onOK: () => {
                fetch(`${app.options.server}/api/Category/Delete?ID=${selected.ID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code !== 200) {
                            app.toast(_t(obj.Msg), 'warn');
                            return;
                        }
                        this.updateUI();
                    });
                });
            }
        });
    }

    handleSelect(obj) {
        this.setState({
            selected: obj
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

CategoryWindow.propTypes = {
    type: PropTypes.oneOf(['Scene', 'Mesh', 'Map', 'Texture', 'Material', 'Audio', 'Animation', 'Particle', 'Screenshot', 'Video']),
    typeName: PropTypes.string,
    callback: PropTypes.func
};

CategoryWindow.defaultProps = {
    type: 'Scene',
    typeName: 'Scene',
    callback: null
};

export default CategoryWindow;