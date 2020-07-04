/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Form.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表单
 * @author tengge / https://github.com/tengge1
 */
class Form extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        const { className, style, children, direction } = this.props;
        return <form
            className={classNames('Form', direction, className)}
            style={style}
            onSubmit={this.handleSubmit}
               >
            {children}
        </form>;
    }

    handleSubmit() {
        const { onSubmit } = this.props;
        event.preventDefault();
        onSubmit && onSubmit();
    }
}

Form.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    onSubmit: PropTypes.func
};

Form.defaultProps = {
    className: null,
    style: null,
    children: null,
    direction: 'horizontal',
    onSubmit: null
};

export default Form;