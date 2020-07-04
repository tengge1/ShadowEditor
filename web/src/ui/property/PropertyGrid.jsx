/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/PropertyGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 属性表
 * @author tengge / https://github.com/tengge1
 */
class PropertyGrid extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('PropertyGrid', className)}
            style={style}
               >
            {children}
        </div>;
    }
}

PropertyGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

PropertyGrid.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default PropertyGrid;