/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/FormControl.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表单项
 * @author tengge / https://github.com/tengge1
 */
class FormControl extends React.Component {
    render() {
        const { className, style, children, hidden } = this.props;

        return <div className={classNames('FormControl', className, hidden && 'hidden')}
            style={style}
               >
            {children}
        </div>;
    }
}

FormControl.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    hidden: PropTypes.bool
};

FormControl.defaultProps = {
    className: null,
    style: null,
    children: null,
    hidden: false
};

export default FormControl;