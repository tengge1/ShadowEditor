/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Label.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 标签
 * @author tengge / https://github.com/tengge1
 */
class Label extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children, id } = this.props;

        return <label className={classNames('Label', className)}
            style={style}
            id={id}
               >
            {children}
        </label>;
    }
}

Label.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    id: PropTypes.string
};

Label.defaultProps = {
    className: null,
    style: null,
    children: null,
    id: null
};

export default Label;