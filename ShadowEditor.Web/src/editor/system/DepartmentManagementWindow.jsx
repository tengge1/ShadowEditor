import './css/DepartmentManagementWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField, HBoxLayout, Tree } from '../../third_party';

/**
 * 组织机构管理窗口
 * @author tengge / https://github.com/tengge1
 */
class DepartmentManagementWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selected: null,
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleAddChild = this.handleAddChild.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { data, selected } = this.state;

        return <Window
            className={'DepartmentManagementWindow'}
            title={_t('Department Management')}
            style={{ width: '600px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
        >
            <Content>
                <Toolbar>
                    <Button onClick={this.handleAdd}>{_t('Add')}</Button>
                    <Button onClick={this.handleAddChild}>{_t('Add Child')}</Button>
                    <Button onClick={this.handleEdit}>{_t('Edit')}</Button>
                    <Button onClick={this.handleDelete}>{_t('Delete')}</Button>
                    <ToolbarFiller />
                </Toolbar>
                <HBoxLayout className={'hbox'}>
                    <Tree data={data} selected={selected} />
                </HBoxLayout>
            </Content>
        </Window>;
    }

    componentDidMount() {
        fetch(`${app.options.server}/api/Department/List?pageSize=10000`).then(response => {
            response.json().then(json => {
            });
        });
    }

    handleAdd() {

    }

    handleAddChild() {

    }

    handleEdit() {

    }

    handleDelete() {

    }

    handleClose() {
        app.removeElement(this);
    }
}

export default DepartmentManagementWindow;