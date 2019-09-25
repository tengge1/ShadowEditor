import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../../third_party';

/**
 * 用户编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditUserWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            name: props.name,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { name } = this.state;

        return <Window
            className={_t('EditUserWindow')}
            title={_t('Role Management')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input name={'name'} value={name} onChange={this.handleChange}></Input>
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
            [name]: value,
        });
    }

    handleSave(callback) {
        const { id, name } = this.state;

        if (!name || name.trim() === '') {
            app.toast(_t('Name is not allowed to be empty.'));
            return;
        }

        const url = !id ? `/api/User/Add` : `/api/User/Edit`;

        fetch(`${app.options.server}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `ID=${id}&Name=${name}`,
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
    name: PropTypes.string,
    callback: PropTypes.func,
};

EditUserWindow.defaultProps = {
    id: '',
    name: '',
    callback: null,
};

export default EditUserWindow;