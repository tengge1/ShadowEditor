/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TextArea.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 文本域
 * @author tengge / https://github.com/tengge1
 */
class TextArea extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    render() {
        const { className, style, value } = this.props;

        return <textarea
            className={classNames('TextArea', className)}
            style={style}
            value={value}
            onChange={this.handleChange}
            onInput={this.handleInput}
               />;
    }

    handleChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.target.value, this.props.name, event);
    }

    handleInput(event) {
        const { onInput } = this.props;
        onInput && onInput(event.target.value, this.props.name, event);
    }
}

TextArea.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func
};

TextArea.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: '',
    onChange: null,
    onInput: null
};

export default TextArea;