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

        this.handleAdd = this.handleAdd.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
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
                <DataGrid url={`${app.options.server}/api/Role/List`}>
                    <Columns>
                        <Column type={'number'} title={'#'}></Column>
                        <Column field={'Name'} title={_t('Name')}></Column>
                    </Columns>
                </DataGrid>
            </Content>
        </Window>;
    }

    handleAdd() {
        const win = app.createElement(EditRoleWindow);
        app.addElement(win);
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default RoleManageWindow;