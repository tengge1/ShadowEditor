import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../../third_party';

/**
 * 角色编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditRoleWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { username, password } = this.state;

        return <Window
            className={_t('EditRoleWindow')}
            title={_t('Role Management')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Username')}</Label>
                        <Input name={'username'} value={username} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Password')}</Label>
                        <Input name={'password'} value={password} onChange={this.handleChange}></Input>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(name, value) {
        this.setState({
            [name]: value,
        });
    }

    handleSave() {
        this.handleClose();
        app.toast(_t('Login successfully!'));
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default EditRoleWindow;