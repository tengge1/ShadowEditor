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
            authorities: [],
            roleID: null,
            mask: true
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { roles, authorities, roleID, mask } = this.state;

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
                </Toolbar>
                <HBoxLayout className={'hbox'}>
                    <DataGrid
                        className={'roles'}
                        data={roles}
                        selected={roleID}
                        mask={mask}
                        onSelect={this.handleSelect}
                        keyField={'ID'}
                    >
                        <Column type={'number'} title={'#'} />
                        <Column field={'Name'} title={_t('Name')} />
                    </DataGrid>
                    <DataGrid
                        className={'authorities'}
                        data={authorities}
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
    }

    handleSelect(selected) {
        this.setState({
            roleID: selected.ID
        });
        fetch(`${app.options.server}/api/OperatingAuthority/Get?roleID=${selected.ID}`).then(response => {
            response.json().then(json => {
                json.Data.rows.forEach(n => {
                    n.Name = _t(n.Name);
                });
                this.setState({
                    authorities: json.Data.rows,
                    mask: false
                });
            });
        });
    }

    handleSave() {
        debugger;
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default AuthorityManagementWindow;