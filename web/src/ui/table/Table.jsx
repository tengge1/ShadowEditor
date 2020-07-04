/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Table.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表格
 * @author tengge / https://github.com/tengge1
 */
class Table extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <table
            className={classNames('Table', className)}
            style={style}
            {...others}
               >
            {children}
        </table>;
    }
}

Table.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

Table.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default Table;