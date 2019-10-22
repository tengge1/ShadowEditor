import './css/DepartmentManagementWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, SearchField, HBoxLayout, Form, FormControl, Label, CheckBox } from '../../third_party';

/**
 * 组织机构管理窗口
 * @author tengge / https://github.com/tengge1
 */
class DepartmentManagementWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: [],
            authorities: [],
            roleID: null,
            mask: true
        };

        this.handleSelectRole = this.handleSelectRole.bind(this);
        this.handleSelectAuthority = this.handleSelectAuthority.bind(this);
        this.handleSelectAllAuthority = this.handleSelectAllAuthority.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { roles, authorities, roleID, mask } = this.state;

        return <Window
            className={'DepartmentManagementWindow'}
            title={_t('Department Management')}
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
                        onSelect={this.handleSelectRole}
                        keyField={'ID'}
                    >
                        <Column type={'number'} />
                        <Column field={'Name'} title={_t('Role')} renderer={this.renderRoleName} />
                    </DataGrid>
                    <DataGrid
                        className={'authorities'}
                        data={authorities}
                        mask={mask}
                        onSelect={this.handleSelectAuthority}
                        onSelectAll={this.handleSelectAllAuthority}
                        keyField={'ID'}
                    >
                        <Column type={'checkbox'} field={'Enabled'} />
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

    handleSelectRole(selected) {
        this.setState({
            roleID: selected.ID,
            mask: true
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

    handleSelectAuthority(selected) {
        let authorities = this.state.authorities;
        let authority = authorities.filter(n => n.ID === selected.ID)[0];

        if (authority) {
            authority.Enabled = !authority.Enabled;
        }

        this.setState({
            authorities
        });
    }

    handleSelectAllAuthority(value, name, event) {
        let authorities = this.state.authorities;

        authorities.forEach(n => {
            n.Enabled = value;
        });

        this.setState({
            authorities
        });
    }

    handleSave() {
        const { roleID, authorities } = this.state;

        let body = `RoleID=${roleID}`;

        authorities.forEach(n => {
            if(n.Enabled) {
                body +=  `&Authorities[]=${n.ID}`;
            }
        });

        fetch(`${app.options.server}/api/OperatingAuthority/Save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        }).then(response => {
            response.json().then(json => {
                app.toast(_t(json.Msg));
                if (json.Code === 200) {
                    this.handleSelectRole({
                        ID: roleID
                    });
                }
            });
        });
    }

    handleClose() {
        app.removeElement(this);
    }

    renderRoleName(value) {
        if (value === 'Administrator' ||
            value === 'User' ||
            value === 'Guest') {
            return _t(value);
        }
        return value;
    }
}

export default DepartmentManagementWindow;