/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/CategoryEditWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../ui/index';

/**
 * 类别编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class CategoryEditWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name
        };

        this.handleOK = this.handleOK.bind(this, props.callback);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        const { typeName, id } = this.props;
        const { name } = this.state;

        return <Window
            className={'CategoryEditWindow'}
            title={id ? `${typeName} ${_t('Category Edit')}` : `${typeName} ${_t('Category Add')}`}
            style={{ width: '380px', height: '200px' }}
            mask={false}
            onClose={this.handleCancel}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input value={name}
                            onChange={this.handleNameChange}
                        />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleCancel}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleNameChange(value) {
        this.setState({
            name: value
        });
    }

    handleOK(callback) {
        const { id, type } = this.props;
        const { name } = this.state;

        let body = `type=${type}&name=${name}`;

        if (id) {
            body += `&id=${id}`;
        }

        fetch(`${app.options.server}/api/Category/Save`, {
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
                this.handleCancel();
                callback && callback();
            });
        });
    }

    handleCancel() {
        app.removeElement(this);
    }
}

CategoryEditWindow.propTypes = {
    type: PropTypes.string,
    typeName: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    callback: PropTypes.func
};

CategoryEditWindow.defaultProps = {
    type: 'Scene',
    typeName: 'Scene',
    id: null,
    name: '',
    callback: null
};

export default CategoryEditWindow;