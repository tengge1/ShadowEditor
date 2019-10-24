import './css/DepartmentManagementWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField, HBoxLayout, Tree } from '../../third_party';
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
            selected: null
        };

        this.handleRefresh = this.handleRefresh.bind(this);

        this.handleAdd = this.handleAdd.bind(this);
        this.handleAddChild = this.handleAddChild.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { data, selected } = this.state;

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
                    <Button onClick={this.handleEdit}>{_t('Edit')}</Button>
                    <Button onClick={this.handleDelete}>{_t('Delete')}</Button>
                    <ToolbarFiller />
                </Toolbar>
                <Tree className={'DepartmentTree'}
                    data={data}
                    selected={selected}
                    onSelect={this.handleSelect}
                    onExpand={this.handleExpand} />
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
        const { data, selected } = this.state;

        if (!selected) {
            app.toast(_t('Pleast select a department.'));
            return;
        }

        const record = data.filter(n => n.value === selected)[0];

        const win = app.createElement(EditDeptWindow, {
            pid: record.value,
            pname: record.text,
            callback: this.handleRefresh
        });
        app.addElement(win);
    }

    handleEdit() {
        const { data, selected } = this.state;

        if (!selected) {
            app.toast(_t('Pleast select a department.'));
            return;
        }

        const record = data.filter(n => n.value === selected)[0];

        const win = app.createElement(EditDeptWindow, {
            id: record.value,
            name: record.text,
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
        this.setState({
            selected,
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

    handleClose() {
        app.removeElement(this);
    }
}

export default DepartmentManagementWindow;