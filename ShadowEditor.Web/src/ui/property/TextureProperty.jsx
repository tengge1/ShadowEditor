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
        const { className, style, value } = this.props;

        return <canvas
            className={classNames('texture', className)}
            style={style}
            title={value ? value.sourceFile : ''}
            ref={this.canvasRef}
            onClick={this.handleSelect}></canvas>;
    }

    componentDidMount() {
        let input = document.createElement(`input`);
        input.type = 'file';
        input.addEventListener(`change`, this.handleChange);
        this.input = input;
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        let texture = this.props.value;

        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        if (texture !== null) {
            let image = texture.image;

            if (image !== undefined && image.width > 0) {
                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

        } else if (context !== null) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
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
    value: null,
    onChange: null,
};

export default TextureProperty;