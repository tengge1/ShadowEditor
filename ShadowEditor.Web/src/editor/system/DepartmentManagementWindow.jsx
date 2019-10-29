import './css/DepartmentManagementWindow.css';
import { Window, Content, Toolbar, Button, ToolbarFiller, Input, HBoxLayout, Tree, Form, FormControl, Label } from '../../third_party';
import EditDeptWindow from './dept/EditDeptWindow.jsx';

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
            adminName: ''
        };

        this.handleRefresh = this.handleRefresh.bind(this);

        this.handleAdd = this.handleAdd.bind(this);
        this.handleAddChild = this.handleAddChild.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { data, selected, deptName, adminName } = this.state;

        return <Window
            className={'DepartmentManagementWindow'}
            title={_t('Department Management')}
            style={{ width: '480px', height: '400px' }}
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
                            <Input name={'adminName'}
                                value={adminName}
                                disabled={selected === null}
                                onChange={this.handleChange}
                            />
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
            response.json().then(json => {
                this.list = json.Data;
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
            response.json().then(json => {
                if (json.Code !== 200) {
                    app.toast(_t(json.Msg));
                    return;
                }
                this.handleRefresh(json.Data);
            });
        });
    }

    handleSelect(selected) {
        const data = this.list.filter(n => n.ID === selected)[0];

        this.setState({
            selected,
            deptName: data.Name,
            adminName: ''
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

    handleSave() {
        const { selected, deptName, adminName } = this.state;

        if (!deptName || deptName.trim() === '') {
            app.toast(_t('Name is not allowed to be empty.'));
            return;
        }

        const item = this.list.filter(n => n.ID === selected)[0];

        fetch(`${app.options.server}/api/Department/Edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID=${selected}&ParentID=${item.ParentID}&Name=${deptName}&AdministratorID=`
        }).then(response => {
            response.json().then(json => {
                app.toast(_t(json.Msg));
                if (json.Code === 200) {
                    this.handleRefresh();
                }
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
            adminName: ''
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default DepartmentManagementWindow;