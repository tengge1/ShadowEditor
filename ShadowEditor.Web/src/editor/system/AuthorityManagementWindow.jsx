import './css/AuthorityManagementWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField, HBoxLayout } from '../../third_party';

/**
 * 权限管理窗口
 * @author tengge / https://github.com/tengge1
 */
class AuthorityManagementWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: [],
            data: [],
            selected: null,
            keyword: '',
            mask: false,
        };

        this.update = this.update.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.commitDelete = this.commitDelete.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    render() {
        const { roles, data, selected, mask } = this.state;

        return <Window
            className={'AuthorityManagementWindow'}
            title={_t('Authority Management')}
            style={{ width: '600px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Toolbar>
                    <Button onClick={this.handleAdd}>{_t('Create')}</Button>
                    <Button onClick={this.handleEdit}>{_t('Edit')}</Button>
                    <Button onClick={this.handleDelete}>{_t('Delete')}</Button>
                    <ToolbarFiller></ToolbarFiller>
                    <SearchField placeholder={_t('Search Content')} onInput={this.handleSearch}></SearchField>
                </Toolbar>
                <HBoxLayout className={'split'}>
                    <DataGrid
                        className={'roles'}
                        data={roles}
                        selected={selected}
                        mask={mask}
                        onSelect={this.handleSelect}
                        keyField={'ID'}>
                        <Column type={'number'} title={'#'}></Column>
                        <Column field={'Name'} title={_t('Name')}></Column>
                    </DataGrid>
                    <DataGrid
                        className={'authorities'}
                        data={data}
                        selected={selected}
                        mask={mask}
                        onSelect={this.handleSelect}
                        keyField={'ID'}>
                        <Column type={'number'} title={'#'}></Column>
                        <Column field={'Name'} title={_t('Name')}></Column>
                    </DataGrid>
                </HBoxLayout>
            </Content>
        </Window>;
    }

    componentDidMount() {
        this.setState({
            mask: true,
        });
        fetch(`${app.options.server}/api/Role/List?pageSize=10000`).then(response => {
            response.json().then(json => {
                this.setState({
                    roles: json.Data.rows,
                    mask: false,
                });
            });
        });
        this.handleRefresh();
    }

    update(keyword = '') {
        this.setState({
            mask: true,
        });
        fetch(`${app.options.server}/api/OperatingAuthority/List?keyword=${keyword}`).then(response => {
            response.json().then(json => {
                this.setState({
                    data: json.Data.rows,
                    keyword,
                    mask: false,
                });
            });
        });
    }

    handleAdd() {
        const win = app.createElement(EditRoleWindow, {
            callback: this.handleRefresh,
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

        const win = app.createElement(EditRoleWindow, {
            id: record.ID,
            name: record.Name,
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

        app.confirm({
            title: _t('Query'),
            content: _t('Delete the selected record?'),
            onOK: () => {
                this.commitDelete(selected);
            }
        });
    }

    commitDelete(id) {
        fetch(`${app.options.server}/api/Role/Delete?ID=${id}`, {
            method: 'POST'
        }).then(response => {
            response.json().then(json => {
                if (json.Code === 200) {
                    this.handleRefresh();
                }
                app.toast(_t(json.Msg));
            });
        });
    }

    handleRefresh() {
        this.update();
    }

    handleClose() {
        app.removeElement(this);
    }

    handleSearch(value) {
        const { pageSize, pageNum } = this.state;
        this.update(pageSize, pageNum, value);
    }

    handleSelect(selected) {
        this.setState({
            selected: selected.ID,
        });
    }
}

export default AuthorityManagementWindow;