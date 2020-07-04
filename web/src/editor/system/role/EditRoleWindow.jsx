/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropTypes } from '../../../third_party';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../ui/index';

/**
 * 角色编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditRoleWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            name: props.name
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { name } = this.state;

        return <Window
            className={_t('EditRoleWindow')}
            title={_t('Edit Role')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input name={'name'}
                            value={name}
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

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSave(callback) {
        const { id, name } = this.state;

        if (!name || name.trim() === '') {
            app.toast(_t('Name is not allowed to be empty.'), 'warn');
            return;
        }

        const url = !id ? `/api/Role/Add` : `/api/Role/Edit`;

        fetch(`${app.options.server}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID=${id}&Name=${name}`
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
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

EditRoleWindow.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    callback: PropTypes.func
};

EditRoleWindow.defaultProps = {
    id: '',
    name: '',
    callback: null
};

export default EditRoleWindow;