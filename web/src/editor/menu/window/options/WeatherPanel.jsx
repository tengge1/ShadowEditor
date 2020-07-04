/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/WeatherPanel.css';
import { Form, FormControl, Label, Select } from '../../../../ui/index';

/**
 * 天气选项窗口
 * @author tengge / https://github.com/tengge1
 */
class WeatherPanel extends React.Component {
    constructor(props) {
        super(props);

        this.weathers = {
            '': _t('None'),
            rain: _t('Rain'),
            snow: _t('Snow')
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const weather = app.options.weather;

        return <Form className={'WeatherPanel'}>
            <FormControl>
                <Label>{_t('Weather')}</Label>
                <Select className={'weather'}
                    name={'weather'}
                    value={weather}
                    options={this.weathers}
                    onChange={this.handleChange}
                />
            </FormControl>
        </Form>;
    }

    handleUpdate() {
        this.forceUpdate();
    }

    handleChange(value, name) {
        app.options.weather = value;

        app.call(`optionChange`, this, name, value);

        this.handleUpdate();
    }
}

export default WeatherPanel;