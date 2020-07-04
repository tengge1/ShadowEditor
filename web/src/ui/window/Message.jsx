/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Message.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 提示窗
 */
class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children, type } = this.props;

        return <div className={classNames('Message', type, className)}
            style={style}
               >
            <i className={classNames('iconfont', `icon-${type}`)} />
            <p className={'content'}>{children}</p>
        </div>;
    }
}

Message.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    type: PropTypes.oneOf(['info', 'success', 'warn', 'error'])
};

Message.defaultProps = {
    className: null,
    style: null,
    children: null,
    type: 'info'
};

export default Message;