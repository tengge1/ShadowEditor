/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ToolbarSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏分割线
 * @author tengge / https://github.com/tengge1
 */
class ToolbarSeparator extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('ToolbarSeparator', className)}
            style={style}
               >
            <div className='separator' />
        </div>;
    }
}

ToolbarSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

ToolbarSeparator.defaultProps = {
    className: null,
    style: null
};

export default ToolbarSeparator;