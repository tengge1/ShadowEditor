/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ButtonsProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 按钮组属性
 * @author tengge / https://github.com/tengge1
 */
class ButtonsProperty extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('buttons', className)}
            style={style}
               >{children}</div>;
    }
}

ButtonsProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

ButtonsProperty.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default ButtonsProperty;