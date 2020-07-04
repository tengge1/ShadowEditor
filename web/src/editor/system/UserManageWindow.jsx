/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/UserManageWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField, ToolbarSeparator } from '../../ui/index';
import EditUserWindow from './user/EditUserWindow.jsx';
import ResetPasswordWindow from './user/ResetPasswordWindow.jsx';

/**
 * 用户管理窗口
 * @author tengge / https://github.com/tengge1
 */
class UserManageWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pageSize: 10,
            pageNum: 1,
            total: 0,
            selected: null,
            keyword: '',
            mask: false
        };

        this.update = this.update.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.commitDelete = this.commitDelete.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.renderStatus = this.renderStatus.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleChangePageSize = this.handleChangePageSize.bind(this);
        this.handleFirstPage = this.handleFirstPage.bind(this);
        this.handlePreviousPage = this.handlePreviousPage.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handleLastPage = this.handleLastPage.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    render() {
        const { data, pageSize, pageNum, total, selected, mask } = this.state;

        return <Window
            className={'UserManageWindow'}
            title={_t('User Management')}
            style={{ width: '900px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Toolbar>
                    <Button onClick={this.handleAdd}>{_t('Create')}</Button>
                    <Button onClick={this.handleEdit}>{_t('Edit')}</Button>
                    <Button onClick={this.handleDelete}>{_t('Delete')}</Button>
                    <ToolbarSeparator />
                    <Button onClick={this.handleResetPassword}>{_t('Reset Password')}</Button>
                    <ToolbarFiller />
                    <SearchField placeholder={_t('Search Content')}
                        onInput={this.handleSearch}
                    />
                </Toolbar>
                <DataGrid data={data}
                    pages
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    selected={selected}
                    mask={mask}
                    onSelect={this.handleSelect}
                    onChangePageSize={this.handleChangePageSize}
                    onFirstPage={this.handleFirstPage}
                    onPreviousPage={this.handlePreviousPage}
                    onNextPage={this.handleNextPage}
                    onLastPage={this.handleLastPage}
                    onRefresh={this.handleRefresh}
                    keyField={'ID'}
                >
                    <Column type={'number'}
                        title={'#'}
                    />
                    <Column field={'Username'}
                        title={_t('Username')}
                        width={120}
                    />
                    <Column field={'Name'}
                        title={_t('NickName')}
                        align={'center'}
                        renderer={this.renderName}
                    />
                    <Column field={'RoleName'}
                        title={_t('Role')}
                        width={120}
                        align={'center'}
                        renderer={this.renderRoleName}
                    />
                    <Column field={'DeptName'}
                        title={_t('Department')}
                        width={180}
                        align={'center'}
                        renderer={this.renderRoleName}
                    />
                    <Column field={'CreateTime'}
                        title={_t('Create Date')}
                        width={120}
                        align={'center'}
                        renderer={this.renderDate}
                    />
                    <Column field={'Status'}
                        title={_t('Status')}
                        width={80}
                        align={'center'}
                        renderer={this.renderStatus}
                    />
                </DataGrid>
            </Content>
        </Window>;
    }

    componentDidMount() {
        this.handleRefresh();
    }

    update(pageSize, pageNum, keyword = '') {
        this.setState({
            mask: true
        });
        fetch(`${app.options.server}/api/User/List?pageSize=${pageSize}&pageNum=${pageNum}&keyword=${keyword}`).then(response => {
            response.json().then(obj => {
                app.unmask();
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.setState({
                    pageSize,
                    pageNum,
                    total: obj.Data.total,
                    data: obj.Data.rows,
                    keyword: keyword,
                    mask: false
                });
            });
        });
    }

    handleAdd() {
        const win = app.createElement(EditUserWindow, {
            callback: this.handleRefresh
        });
        app.addElement(win);
    }

    handleEdit() {
        const { data, selected } = this.state;

        if (!selected) {
            app.toast(_t('Please select a record.'));
            return;
        }

        const record = data.filter(n => n.ID === selected)[0];

        if (record.Username === 'admin') {
            app.toast(_t('Modifying system built-in users is not allowed.'), 'warn');
            return;
        }

        const win = app.createElement(EditUserWindow, {
            id: record.ID,
            username: record.Username,
            name: record.Name,
            roleID: record.RoleID,
            deptID: record.DeptID,
            deptName: record.DeptName,
            callback: this.handleRefresh
        });
        app.addElement(win);
    }

    handleDelete() {
        const selected = this.state.selected;

        if (!selected) {
            app.toast(_t('Please select a record.'));
            return;
        }

        const record = this.state.data.filter(n => n.ID === selected)[0];

        if (record.Username === 'admin') {
            app.toast(_t('It is not allowed to delete system built-in users.'), 'warn');
            return;
        }

        app.confirm({
            title: _t('Query'),
            content: _t('Delete the selected record?'),
            onOK: () => {
                this.commitDelete(selected);
            }
        });
    }

    handleResetPassword() {
        const { selected } = this.state;

        if (!selected) {
            app.toast(_t('Please select a record.'));
            return;
        }

        const win = app.createElement(ResetPasswordWindow, {
            id: selected
        });
        app.addElement(win);
    }

    commitDelete(id) {
        fetch(`${app.options.server}/api/User/Delete?ID=${id}`, {
            method: 'POST'
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.handleRefresh();
                app.toast(_t(obj.Msg), 'success');
            });
        });
    }

    handleClose() {
        app.removeElement(this);
    }

    handleSearch(value) {
        const { pageSize, pageNum } = this.state;
        this.update(pageSize, pageNum, value);
    }

    renderName(value) {
        if(value === 'Administrator') {
            return `${_t(value)} (${value})`;
        }
        return value;
    }

    renderRoleName(value) {
        if (value === 'Administrator' ||
            value === 'User' ||
            value === 'Guest') {
            return _t(value);
        }
        return value;
    }

    renderDate(value) {
        return value.split(' ')[0];
    }

    renderStatus(value) {
        return value === 0 ? _t('Enabled') : _t('Disabled');
    }

    handleSelect(selected) {
        this.setState({
            selected: selected.ID
        });
    }

    handleChangePageSize(value) {
        const { pageNum, keyword } = this.state;
        this.update(value, pageNum, keyword);
    }

    handleFirstPage() {
        const { pageSize, keyword } = this.state;

        this.update(pageSize, 1, keyword);
    }

    handlePreviousPage() {
        const { pageSize, pageNum, keyword } = this.state;
        const newPageNum = pageNum > 1 ? pageNum - 1 : pageNum;

        this.update(pageSize, newPageNum, keyword);
    }

    handleNextPage() {
        const { pageSize, pageNum, total, keyword } = this.state;
        const totalPage = total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
        const newPageNum = pageNum < totalPage ? pageNum + 1 : pageNum;

        this.update(pageSize, newPageNum, keyword);
    }

    handleLastPage() {
        const { pageSize, total, keyword } = this.state;
        const totalPage = total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
        const newPageNum = totalPage;

        this.update(pageSize, newPageNum, keyword);
    }

    handleRefresh() {
        const { pageSize, pageNum, keyword } = this.state;
        this.update(pageSize, pageNum, keyword);
    }
}

export default UserManageWindow;