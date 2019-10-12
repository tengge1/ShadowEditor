import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../third_party';

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
            name: props.name
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { username, password, name } = this.state;

        return <Window
            className={_t('EditUserWindow')}
            title={_t('Edit User')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('User Name')}</Label>
                        <Input name={'username'} value={username} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Password')}</Label>
                        <Input name={'password'} type={'password'} value={password} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('NickName')}</Label>
                        <Input name={'name'} value={name} onChange={this.handleChange} />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSave(callback) {
        const { id, username, password, name } = this.state;

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
            body: `ID=${id}&Username=${username}&Password=${password}&Name=${name}`
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
}

EditUserWindow.propTypes = {
    id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
    callback: PropTypes.func
};

EditUserWindow.defaultProps = {
    id: '',
    username: '',
    name: '',
    callback: null
};

export default EditUserWindow;