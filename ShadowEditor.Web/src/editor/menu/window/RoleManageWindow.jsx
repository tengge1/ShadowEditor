import './css/RoleManageWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField } from '../../../third_party';
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
            selected: null,
        };

        this.update = this.update.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.renderStatus = this.renderStatus.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
    }

    render() {
        const { data, pageSize, pageNum, total, selected } = this.state;

        return <Window
            className={'RoleManageWindow'}
            title={_t('Role Management')}
            style={{ width: '600px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Toolbar>
                    <Button onClick={this.handleAdd}>{_t('Create')}</Button>
                    <Button onClick={this.handleAdd}>{_t('Edit')}</Button>
                    <Button onClick={this.handleAdd}>{_t('Delete')}</Button>
                    <ToolbarFiller></ToolbarFiller>
                    <SearchField placeholder={_t('Search Content')}></SearchField>
                </Toolbar>
                <DataGrid data={data}
                    pages={true}
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    selected={selected}
                    onSelect={this.handleSelect}
                    keyField={'ID'}>
                    <Column type={'number'} title={'#'}></Column>
                    <Column field={'Name'} title={_t('Name')}></Column>
                    <Column field={'CreateTime'} title={_t('Create Date')} width={120} align={'center'} renderer={this.renderDate}></Column>
                    <Column field={'UpdateTime'} title={_t('Update Date')} width={120} align={'center'} renderer={this.renderDate}></Column>
                    <Column field={'Status'} title={_t('Status')} width={80} align={'center'} renderer={this.renderStatus}></Column>
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

    renderDate(value) {
        return value.split(' ')[0];
    }

    renderStatus(value) {
        return value === 0 ? '启用' : '禁用';
    }

    handleSelect(selected) {
        this.setState({
            selected: selected.ID,
        });
    }
}

export default RoleManageWindow;