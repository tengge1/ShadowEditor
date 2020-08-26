/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TextureProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import CheckBox from '../form/CheckBox.jsx';
import IconMenuButton from '../form/IconMenuButton.jsx';
import ContextMenu from '../menu/ContextMenu.jsx';
import MenuItem from '../menu/MenuItem.jsx';
import global from '../../global';

/**
 * 纹理属性
 * @author tengge / https://github.com/tengge1
 */
class TextureProperty extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.texture = null;

        this.handleSelect = this.handleSelect.bind(this);

        this.handleEnable = this.handleEnable.bind(this, props.onChange);
        this.handleDelete = this.handleDelete.bind(this, props.onChange);
        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, value } = this.props;

        if (!this.texture) {
            this.texture = value;
        } else if (value && value.uuid !== this.texture.uuid) { // a new texture
            this.texture = value;
        }

        return <div className={classNames('texture', className)}
            style={style}
               >
            <CheckBox checked={value !== null}
                onChange={this.handleEnable}
            />
            <canvas title={value ? value.sourceFile : ''}
                ref={this.canvasRef}
                onClick={this.handleSelect}
            />
            <IconMenuButton
                className={'menu'}
                icon={'setting-black'}
            >
                <ContextMenu>
                    <MenuItem title={_t('Delete')}
                        disabled={this.texture === null}
                        onClick={this.handleDelete}
                    />
                </ContextMenu>
            </IconMenuButton>
        </div>;
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        let texture = this.texture;

        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        if (texture !== null) {
            let image = texture.image;

            if (Array.isArray(image)) {
                image = image[0];
            }

            if (image !== undefined && image.width > 0) {
                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

        } else if (context !== null) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    handleSelect() {
        global.app.toast(_t('Please click the image in the MapPanel.'));
        global.app.on(`selectMap.TextureProperty`, this.handleChange);
    }

    handleEnable(onChange, enabled, name, event) {
        if (enabled) {
            onChange && onChange(this.texture, this.props.name, event);
        } else {
            onChange && onChange(null, this.props.name, event);
        }
    }

    handleDelete(onChange) {
        this.texture = null;
        onChange && onChange(null, this.props.name, event);
    }

    handleChange(onChange, data) {
        global.app.on(`selectMap.TextureProperty`, null);

        const name = data.Name;
        const type = data.Type;
        const url = data.Url;

        if (type === 'targa') {
            const loader = new THREE.TGALoader();
            loader.load(url, obj => {
                let texture = new THREE.CanvasTexture(obj, THREE.UVMglobal.apping);
                texture.sourceFile = name;
                onChange && onChange(texture, this.props.name, data);
            });
        } else if (type === 'video') {
            let video = document.createElement('video');
            video.setAttribute('src', data.Url);
            video.setAttribute('autoplay', 'autoplay');
            video.setAttribute('loop', 'loop');
            video.setAttribute('crossorigin', 'anonymous');

            let texture = new THREE.VideoTexture(video);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;

            onChange && onChange(texture, this.props.name, data);
        } else if (type === 'cube') {
            const loader = new THREE.CubeTextureLoader();
            loader.load(url.split(';'), obj => {
                obj.sourceFile = name;
                obj.format = url.endsWith('jpg') || url.endsWith('jpeg') ? THREE.RGBFormat : THREE.RGBAFormat;
                obj.needsUpdate = true;

                onChange && onChange(obj, this.props.name, data);
            });
        } else {
            const loader = new THREE.TextureLoader();
            loader.load(url, obj => {
                obj.sourceFile = name;
                obj.format = url.endsWith('jpg') || url.endsWith('jpeg') ? THREE.RGBFormat : THREE.RGBAFormat;
                obj.needsUpdate = true;

                onChange && onChange(obj, this.props.name, data);
            });
        }
    }
}

TextureProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: (props, propName, componentName) => {
        const value = props.value;
        if (value === null) {
            return;
        }
        if (!(value instanceof THREE.Texture)) {
            return new TypeError(`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`THREE.Texture\`.`);
        }
    },
    onChange: PropTypes.func
};

TextureProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: null,
    onChange: null
};

export default TextureProperty;