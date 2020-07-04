/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ToolbarFiller.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏填充
 * @author tengge / https://github.com/tengge1
 */
class ToolbarFiller extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('ToolbarFiller', className)}
            style={style}
               />;
    }
}

ToolbarFiller.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

ToolbarFiller.defaultProps = {
    className: null,
    style: null
};

export default ToolbarFiller;