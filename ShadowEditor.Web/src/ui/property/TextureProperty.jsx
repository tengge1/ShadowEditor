import './css/TextureProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../form/Input.jsx';

/**
 * 纹理属性
 * @author tengge / https://github.com/tengge1
 */
class TextureProperty extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();

        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, fileName } = this.props;

        return <canvas
            className={classNames('TextureProperty', className)}
            style={style}
            ref={this.canvasRef}
            onClick={this.handleSelect}></canvas>;
    }

    componentDidMount() {
        let fileName = this.props.fileName;
        let texture = this.props.value;

        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        if (texture !== null) {
            let image = texture.image;

            if (image !== undefined && image.width > 0) {
                if (texture.sourceFile) {
                    fileName = texture.sourceFile;
                } else {
                    fileName = '';
                }

                let scale = canvas.width / image.width;
                context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
            } else {
                fileName = (texture.sourceFile == null ? '' : texture.sourceFile) + L_ERROR;
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

        } else {
            fileName = '';

            if (context !== null) {
                // Seems like context can be null if the canvas is not visible
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        let input = document.createElement(`input`);
        input.type = 'file';
        input.addEventListener(`change`, this.handleChange);
        this.input = input;
    }

    handleSelect(event) {
        this.input.click();
    }

    handleChange(onChange, event) {
        const file = event.target.files[0];

        if (!file.type.match('image.*')) {
            console.warn(`TextureProperty: File Type Error.`);
            return;
        }

        let reader = new FileReader();

        if (file.type === 'image/targa') {
            reader.addEventListener('load', event => {
                let result = new THREE.TGALoader().parse(event.target.result);
                let texture = new THREE.CanvasTexture(result, THREE.UVMapping);

                texture.sourceFile = file.name;

                onChange && onChange(texture, this.props.name, event);
            }, false);

            reader.readAsArrayBuffer(file);
        } else {
            reader.addEventListener('load', event => {
                let image = document.createElement('img');

                image.addEventListener('load', () => {
                    let texture = new THREE.Texture(image, THREE.UVMapping);

                    texture.sourceFile = file.name;
                    texture.format = file.type === 'image/jpeg' ? THREE.RGBFormat : THREE.RGBAFormat;
                    texture.needsUpdate = true;

                    onChange && onChange(texture, this.props.name, event);
                }, false);

                image.src = event.target.result;
            }, false);

            reader.readAsDataURL(file);
        }
    }
}

TextureProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    fileName: PropTypes.string,
    value: (props, propName, componentName) => {
        const value = props.value;
        if (value === null) {
            return;
        }
        if (!(value instanceof THREE.Texture)) {
            return new TypeError(`Invalid prop \`${propName}\` of type \`${typeof (value)}\` supplied to \`${componentName}\`, expected \`THREE.Texture\`.`);
        }
    },
    onChange: PropTypes.func,
};

TextureProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    fileName: null,
    value: null,
    onChange: null,
};

export default TextureProperty;