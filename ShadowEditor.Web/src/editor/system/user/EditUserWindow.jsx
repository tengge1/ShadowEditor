import './css/EditUserWindow.css';
import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button, Select } from '../../../third_party';

/**
 * 用户编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditUserWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            username: props.username,
            password: props.password,
            name: props.name,
            roles: {},
            roleID: props.roleID
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { id, username, password, name, roles, roleID } = this.state;

        return <Window
            className={_t('EditUserWindow')}
            title={id ? _t('Edit User') : _t('Add User')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('User Name')}</Label>
                        <Input name={'username'}
                            value={username}
                            onChange={this.handleChange}
                        />
                        <input type={'text'}
                            className={'fake'}
                        />
                        <input type={'password'}
                            className={'fake'}
                        />
                    </FormControl>
                    <FormControl hidden={id !== ''}>
                        <Label>{_t('Password')}</Label>
                        <Input name={'password'}
                            type={'password'}
                            value={password}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('NickName')}</Label>
                        <Input name={'name'}
                            value={name}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Role')}</Label>
                        <Select name={'roleID'}
                            options={roles}
                            value={roleID}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        fetch(`${app.options.server}/api/Role/List?pageSize=10000`).then(response => {
            response.json().then(json => {
                const roles = {
                    '': _t('Please Select')
                };
                json.Data.rows.forEach(n => {
                    roles[n.ID] = this.renderRoleName(n.Name);
                });
                this.setState({
                    roles
                });
            });
        });
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSave(callback) {
        const { id, username, password, name, roleID } = this.state;

        if (!username || username.trim() === '') {
            app.toast(_t('Username is not allowed to be empty.'));
            return;
        }

        if (!id && (!password || password.trim() === '')) {
            app.toast(_t('Password is not allowed to be empty.'));
            return;
        }

        if (!name || name.trim() === '') {
            app.toast(_t('Nick name is not allowed to be empty.'));
            return;
        }

        const url = !id ? `/api/User/Add` : `/api/User/Edit`;

        fetch(`${app.options.server}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID=${id}&Username=${username}&Password=${password}&Name=${name}&RoleID=${roleID}`
        }).then(response => {
            response.json().then(json => {
                if (json.Code !== 200) {
                    app.toast(_t(json.Msg));
                    return;
                }
                this.handleClose();
                callback && callback();
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

EditUserWindow.propTypes = {
    id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
    roleID: PropTypes.string,
    callback: PropTypes.func
};

EditUserWindow.defaultProps = {
    id: '',
    username: '',
    name: '',
    roleID: '',
    callback: null
};

export default EditUserWindow;