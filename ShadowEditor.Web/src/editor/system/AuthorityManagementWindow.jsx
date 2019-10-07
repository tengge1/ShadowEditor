import './css/AuthorityManagementWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField, HBoxLayout, Form, FormControl, Label, CheckBox } from '../../third_party';

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
            mask: true
        };

        this.update = this.update.bind(this);
        this.handleSave = this.handleSave.bind(this);
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
            onClose={this.handleClose}
               >
            <Content>
                <Toolbar>
                    <Button onClick={this.handleSave}>{_t('Save')}</Button>
                    <ToolbarFiller />
                    <SearchField placeholder={_t('Search Content')} onInput={this.handleSearch} />
                </Toolbar>
                <HBoxLayout className={'hbox'}>
                    <DataGrid
                        className={'roles'}
                        data={roles}
                        selected={selected}
                        mask={mask}
                        onSelect={this.handleSelect}
                        keyField={'ID'}
                    >
                        <Column type={'number'} title={'#'} />
                        <Column field={'Name'} title={_t('Name')} />
                    </DataGrid>
                    <DataGrid
                        className={'authorities'}
                        data={data}
                        mask={mask}
                        keyField={'ID'}
                    >
                        <Column type={'checkbox'} field={'Enabled'} title={'#'} />
                        <Column field={'Name'} title={_t('Authority')} />
                    </DataGrid>
                </HBoxLayout>
            </Content>
        </Window>;
    }

    componentDidMount() {
        fetch(`${app.options.server}/api/Role/List?pageSize=10000`).then(response => {
            response.json().then(json => {
                this.setState({
                    roles: json.Data.rows,
                    mask: false
                });
            });
        });
        this.handleRefresh();
    }

    update(keyword = '') {
        this.setState({
            mask: true
        });
        fetch(`${app.options.server}/api/OperatingAuthority/List?keyword=${keyword}`).then(response => {
            response.json().then(json => {
                this.setState({
                    data: json.Data.rows,
                    keyword,
                    mask: false
                });
            });
        });
    }

    handleSave() {
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
            selected: selected.ID
        });
    }
}

export default AuthorityManagementWindow;