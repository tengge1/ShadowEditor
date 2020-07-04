/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ImageUploader.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片上传控件
 * @author tengge / https://github.com/tengge1
 */
class ImageUploader extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { className, style, url, server, noImageText } = this.props;

        if (url && url !== 'null') {
            return <img
                className={classNames('ImageUploader', className)}
                style={style}
                src={server + url}
                onClick={this.handleSelect}
                   />;
        } else {
            return <div
                className={classNames('ImageUploader', 'empty', className)}
                onClick={this.handleSelect}
                   >
                {noImageText}
            </div>;
        }
    }

    componentDidMount() {
        var input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.addEventListener('change', this.handleChange);

        document.body.appendChild(input);

        this.input = input;
    }

    componentWillUnmount() {
        var input = this.input;
        input.removeEventListener('change', this.handleChange);

        document.body.removeChild(input);

        this.input = null;
    }

    handleSelect() {
        this.input.click();
    }

    handleChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.target.files[0], event);
    }
}

ImageUploader.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    url: PropTypes.string,
    server: PropTypes.string,
    noImageText: PropTypes.string,
    onChange: PropTypes.func
};

ImageUploader.defaultProps = {
    className: null,
    style: null,
    url: null,
    server: '',
    noImageText: 'No Image',
    onChange: null
};

export default ImageUploader;