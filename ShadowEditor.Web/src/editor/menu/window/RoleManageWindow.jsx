import './css/RoleManageWindow.css';
import { Window, Content, Toolbar, Label, Input, Button, DataGrid, Columns, Column } from '../../../third_party';
import EditRoleWindow from './role/EditRoleWindow.jsx';

/**
 * 角色管理窗口
 * @author tengge / https://github.com/tengge1
 */
class RoleManageWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pageSize: 20,
            pageNum: 1,
            total: 0,
        };

        this.update = this.update.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { data } = this.state;

        return <Window
            className={'RoleManageWindow'}
            title={_t('Role Management')}
            style={{ width: '600px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Toolbar>
                    <Button onClick={this.handleAdd}>{_t('Create')}</Button>
                </Toolbar>
                <DataGrid data={data} keyField={'ID'}>
                    <Columns>
                        <Column type={'number'} title={'#'}></Column>
                        <Column field={'Name'} title={_t('Name')}></Column>
                    </Columns>
                </DataGrid>
            </Content>
        </Window>;
    }

    componentDidMount() {
        this.update();
    }

    update() {
        fetch(`${app.options.server}/api/Role/List`).then(response => {
            response.json().then(json => {
                this.setState({
                    total: json.Data.total,
                    data: json.Data.rows,
                });
            });
        });
    }

    handleAdd() {
        const win = app.createElement(EditRoleWindow, {
            callback: this.update,
        });
        app.addElement(win);
    }

    handleEdit() {
        const win = app.createElement(EditRoleWindow);
        app.addElement(win);
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default RoleManageWindow;