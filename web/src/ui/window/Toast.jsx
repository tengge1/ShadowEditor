/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Toast.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 提示窗
 */
class Toast extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children } = this.props;

        return <div className={'ToastMark'}>
            <div className={classNames('Toast', className)}
                style={style}
            >
                {children}
            </div>
        </div>;
    }
}

Toast.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

Toast.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default Toast;