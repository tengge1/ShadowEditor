/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/DepartmentManagementWindow.css';
import { Window, Content, Toolbar, Button, ToolbarFiller, Input, HBoxLayout, Tree, Form, FormControl, Label } from '../../ui/index';
import EditDeptWindow from './dept/EditDeptWindow.jsx';
import SelectUserWindow from './user/SelectUserWindow.jsx';

/**
 * 组织机构管理窗口
 * @author tengge / https://github.com/tengge1
 */
class DepartmentManagementWindow extends React.Component {
    constructor(props) {
        super(props);

        this.list = [];
        this.expanded = {};

        this.state = {
            data: [],
            selected: null,
            deptName: '',
            adminID: '',
            adminName: ''
        };

        this.handleRefresh = this.handleRefresh.bind(this);

        this.handleAdd = this.handleAdd.bind(this);
        this.handleAddChild = this.handleAddChild.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleSelectUser = this.handleSelectUser.bind(this);
        this.commitSelectUser = this.commitSelectUser.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { data, selected, deptName, adminName } = this.state;

        return <Window
            className={'DepartmentManagementWindow'}
            title={_t('Department Management')}
            style={{ width: '520px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Toolbar>
                    <Button onClick={this.handleAdd}>{_t('Add')}</Button>
                    <Button onClick={this.handleAddChild}>{_t('Add Child Department')}</Button>
                    <Button onClick={this.handleDelete}>{_t('Delete')}</Button>
                    <ToolbarFiller />
                </Toolbar>
                <HBoxLayout className={'box'}>
                    <div className={'left'}>
                        <Tree className={'tree'}
                            data={data}
                            selected={selected}
                            onSelect={this.handleSelect}
                            onExpand={this.handleExpand}
                        />
                    </div>
                    <Form className={'right'}>
                        <FormControl>
                            <Label>{_t('Name')}</Label>
                            <Input name={'deptName'}
                                value={deptName}
                                disabled={selected === null}
                                onChange={this.handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <Label>{_t('Administrator')}</Label>
                            <Input className={'adminName'}
                                name={'adminName'}
                                value={this.renderAdminName(adminName)}
                                disabled
                            />
                            <Button className={'select'}
                                disabled={selected === null}
                                onClick={this.handleSelectUser}
                            >{_t('Select')}</Button>
                        </FormControl>
                        <FormControl className={'buttons'}>
                            <Label />
                            <Button disabled={selected === null}
                                onClick={this.handleSave}
                            >{_t('Save')}</Button>
                            <Button disabled={selected === null}
                                onClick={this.handleReset}
                            >{_t('Reset')}</Button>
                        </FormControl>
                    </Form>
                </HBoxLayout>
            </Content>
        </Window>;
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        fetch(`${app.options.server}/api/Department/List?pageSize=10000`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.list = obj.Data;
                this.refreshTree();
            });
        });
    }

    refreshTree() {
        var data = [];
        this.createTree(data, '', this.list);
        this.setState({
            data
        });
    }

    createTree(nodes, parentID, list) {
        var list1 = list.filter(n => n.ParentID === parentID);

        list1.forEach(obj1 => {
            var node1 = {
                value: obj1.ID,
                text: obj1.Name,
                children: [],
                expanded: !!this.expanded[obj1.ID]
            };
            this.createTree(node1.children, obj1.ID, list);
            nodes.push(node1);
        });
    }

    handleAdd() {
        const win = app.createElement(EditDeptWindow, {
            callback: this.handleRefresh
        });
        app.addElement(win);
    }

    handleAddChild() {
        const { selected } = this.state;

        if (!selected) {
            app.toast(_t('Pleast select a department.'));
            return;
        }

        const record = this.list.filter(n => n.ID === selected)[0];

        const win = app.createElement(EditDeptWindow, {
            pid: record.ID,
            pname: record.Name,
            callback: this.handleRefresh
        });
        app.addElement(win);
    }

    handleDelete() {
        const { selected } = this.state;

        if (!selected) {
            app.toast(_t('Pleast select a department.'));
            return;
        }

        app.confirm({
            title: _t('Query'),
            content: _t('Delete this department?'),
            onOK: () => {
                this.commitDelete(selected);
            }
        });
    }

    commitDelete(id) {
        fetch(`${app.options.server}/api/Department/Delete?ID=${id}`, {
            method: 'POST'
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.handleRefresh();
            });
        });
    }

    handleSelect(selected) {
        const data = this.list.filter(n => n.ID === selected)[0];

        this.setState({
            selected,
            deptName: data.Name,
            adminID: data.AdminID,
            adminName: data.AdminName
        });
    }

    handleExpand(value) {
        let expanded = this.expanded;

        if (expanded[value]) {
            expanded[value] = false;
        } else {
            expanded[value] = true;
        }

        this.refreshTree();
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSelectUser() {
        const win = app.createElement(SelectUserWindow, {
            callback: this.commitSelectUser
        });
        app.addElement(win);
    }

    commitSelectUser(adminID, adminName) {
        this.setState({
            adminID,
            adminName
        });
    }

    handleSave() {
        const { selected, deptName, adminID } = this.state;

        if (!deptName || deptName.trim() === '') {
            app.toast(_t('Name is not allowed to be empty.'), 'warn');
            return;
        }

        const item = this.list.filter(n => n.ID === selected)[0];

        fetch(`${app.options.server}/api/Department/Edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID=${selected}&ParentID=${item.ParentID}&Name=${deptName}&AdminID=${adminID}`
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                app.toast(_t(obj.Msg), 'success');
                this.handleRefresh();
            });
        });
    }

    handleReset() {
        const selected = this.state.selected;

        if (!selected) {
            this.setState({
                deptName: '',
                adminName: ''
            });
            return;
        }

        const data = this.list.filter(n => n.ID === selected)[0];

        this.setState({
            deptName: data.Name,
            adminID: data.AdminID,
            adminName: data.AdminName
        });
    }

    renderAdminName(value) {
        if (value === 'Administrator') {
            return _t(value);
        }
        return value;
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default DepartmentManagementWindow;