/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/AuthorityManagementWindow.css';
import { Window, Content, Toolbar, Button, DataGrid, Column, ToolbarFiller, HBoxLayout } from '../../ui/index';

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

        this.handleSelectRole = this.handleSelectRole.bind(this);
        this.handleSelectAuthority = this.handleSelectAuthority.bind(this);
        this.handleSelectAllAuthority = this.handleSelectAllAuthority.bind(this);
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
                        onSelect={this.handleSelectRole}
                        keyField={'ID'}
                    >
                        <Column type={'number'} />
                        <Column field={'Name'}
                            title={_t('Role')}
                            renderer={this.renderRoleName}
                        />
                    </DataGrid>
                    <DataGrid
                        className={'authorities'}
                        data={authorities}
                        mask={mask}
                        onSelect={this.handleSelectAuthority}
                        onSelectAll={this.handleSelectAllAuthority}
                        keyField={'ID'}
                    >
                        <Column type={'checkbox'}
                            field={'Enabled'}
                        />
                        <Column field={'Name'}
                            title={_t('Authority')}
                        />
                    </DataGrid>
                </HBoxLayout>
            </Content>
        </Window>;
    }

    componentDidMount() {
        fetch(`${app.options.server}/api/Role/List?pageSize=10000`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.setState({
                    roles: obj.Data.rows,
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
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                obj.Data.rows.forEach(n => {
                    n.Name = _t(n.Name);
                });
                this.setState({
                    authorities: obj.Data.rows,
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

    handleSelectAllAuthority(value) {
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
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                app.toast(_t(obj.Msg), 'success');
                this.handleSelectRole({
                    ID: roleID
                });
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

export default AuthorityManagementWindow;