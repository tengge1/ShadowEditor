/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Icon.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标
 * @author tengge / https://github.com/tengge1
 */
class Icon extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { className, style, name, value, icon, title } = this.props;

        return <i className={classNames('Icon', 'iconfont',
            icon && 'icon-' + icon,
            className)}
            style={style}
            name={name}
            value={value}
            title={title}
            onClick={this.handleClick}
               />;
    }

    handleClick(event) {
        const { onClick } = this.props;

        const name = event.target.getAttribute('name');
        onClick && onClick(name, event);
    }
}

Icon.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func
};

Icon.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: null,
    icon: null,
    title: null,
    onClick: null
};

export default Icon;