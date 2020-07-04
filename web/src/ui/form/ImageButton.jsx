/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ImageButton.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片按钮
 * @author tengge / https://github.com/tengge1
 */
class ImageButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { className, style, src, title, selected } = this.props;
        return <button
            className={classNames('ImageButton', selected && 'selected', className)}
            style={style}
            title={title}
            onClick={this.handleClick}
               >
            <img src={src} />
        </button>;
    }

    handleClick(event) {
        const { name, onClick } = this.props;

        onClick && onClick(name, event);
    }
}

ImageButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    src: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func
};

ImageButton.defaultProps = {
    className: null,
    style: null,
    src: null,
    name: null,
    title: null,
    selected: false,
    onClick: null
};

export default ImageButton;