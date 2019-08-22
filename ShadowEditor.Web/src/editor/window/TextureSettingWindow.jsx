import './css/TextureSettingWindow.css';
import { classNames, PropTypes, Window, Content, TabLayout, Buttons, Button, NumberProperty, SelectProperty, CheckBoxProperty, IntegerProperty, PropertyGrid, PropertyGroup, Input, Select, CheckBox, Form, FormControl, Label } from '../../third_party';

/**
 * 纹理设置窗口
 * @author tengge / https://github.com/tengge1
 */
class TextureSettingWindow extends React.Component {
    constructor(props) {
        super(props);

        this.wrapS = {
            [THREE.ClampToEdgeWrapping]: _t('Clamp To Edge'),
            [THREE.RepeatWrapping]: _t('Repeat'),
            [THREE.MirroredRepeatWrapping]: _t('Mirrored Repeat')
        };

        this.wrapT = {
            [THREE.ClampToEdgeWrapping]: _t('Clamp To Edge'),
            [THREE.RepeatWrapping]: _t('Repeat'),
            [THREE.MirroredRepeatWrapping]: _t('Mirrored Repeat')
        };

        this.magFilter = {
            [THREE.LinearFilter]: 'LinearFilter',
            [THREE.NearestFilter]: 'NearestFilter',
        };

        this.minFilter = {
            [THREE.LinearMipMapLinearFilter]: 'LinearMipMapLinearFilter',
            [THREE.NearestFilter]: 'NearestFilter',
            [THREE.NearestMipMapNearestFilter]: 'NearestMipMapNearestFilter',
            [THREE.NearestMipMapLinearFilter]: 'NearestMipMapLinearFilter',
            [THREE.LinearFilter]: 'LinearFilter',
            [THREE.LinearMipMapNearestFilter]: 'LinearMipMapNearestFilter',
        };

        this.type = {
            [THREE.UnsignedByteType]: 'UnsignedByteType',
            [THREE.ByteType]: 'ByteType',
            [THREE.ShortType]: 'ShortType',
            [THREE.UnsignedShortType]: 'UnsignedShortType',
            [THREE.IntType]: 'IntType',
            [THREE.UnsignedIntType]: 'UnsignedIntType',
            [THREE.FloatType]: 'FloatType',
            [THREE.HalfFloatType]: 'HalfFloatType',
            [THREE.UnsignedShort4444Type]: 'UnsignedShort4444Type',
            [THREE.UnsignedShort5551Type]: 'UnsignedShort5551Type',
            [THREE.UnsignedShort565Type]: 'UnsignedShort565Type',
            [THREE.UnsignedInt248Type]: 'UnsignedInt248Type'
        };

        this.encoding = {
            [THREE.LinearEncoding]: 'LinearEncoding',
            [THREE.sRGBEncoding]: 'sRGBEncoding',
            [THREE.GammaEncoding]: 'GammaEncoding',
            [THREE.RGBEEncoding]: 'RGBEEncoding',
            [THREE.LogLuvEncoding]: 'LogLuvEncoding',
            [THREE.RGBM7Encoding]: 'RGBM7Encoding',
            [THREE.RGBM16Encoding]: 'RGBM16Encoding',
            [THREE.RGBDEncoding]: 'RGBDEncoding',
            [THREE.BasicDepthPacking]: 'BasicDepthPacking',
            [THREE.RGBADepthPacking]: 'RGBADepthPacking',
        };

        this.format = {
            [THREE.RGBAFormat]: 'RGBAFormat',
            [THREE.AlphaFormat]: 'AlphaFormat',
            [THREE.RGBFormat]: 'RGBFormat',
            [THREE.LuminanceFormat]: 'LuminanceFormat',
            [THREE.LuminanceAlphaFormat]: 'LuminanceAlphaFormat',
            [THREE.RGBEFormat]: 'RGBEFormat',
            [THREE.DepthFormat]: 'DepthFormat',
            [THREE.DepthStencilFormat]: 'DepthStencilFormat',
        };

        this.mapping = {
            [THREE.UVMapping]: 'UVMapping',
            [THREE.CubeReflectionMapping]: 'CubeReflectionMapping',
            [THREE.CubeRefractionMapping]: 'CubeRefractionMapping',
            [THREE.EquirectangularReflectionMapping]: 'EquirectangularReflectionMapping',
            [THREE.EquirectangularRefractionMapping]: 'EquirectangularRefractionMapping',
            [THREE.SphericalReflectionMapping]: 'SphericalReflectionMapping',
            [THREE.CubeUVReflectionMapping]: 'CubeUVReflectionMapping',
            [THREE.CubeUVRefractionMapping]: 'CubeUVRefractionMapping',
        };

        this.unpackAlignment = {
            [4]: '4',
            [1]: '1',
            [2]: '2',
            [8]: '8',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { anisotropy, center, offset, repeat, rotation, type, encoding, flipY, format, generateMipmaps, magFilter, minFilter, mapping, premultiplyAlpha, unpackAlignment, wrapS, wrapT } = this.props.map;

        const centerX = center.x, centerY = center.y,
            offsetX = offset.x, offsetY = offset.y,
            repeatX = repeat.x, repeatY = repeat.y;

        return <Window
            className={'TextureSettingWindow'}
            title={_t('Texture Settings')}
            style={{ width: '360px', height: '400px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Center X')}</Label>
                        <Input name={'centerX'} value={centerX} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Center Y')}</Label>
                        <Input name={'centerY'} value={centerY} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Offset X')}</Label>
                        <Input name={'offsetX'} value={offsetX} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Offset Y')}</Label>
                        <Input name={'offsetY'} value={offsetY} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Repeat X')}</Label>
                        <Input name={'repeatX'} value={repeatX} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Repeat Y')}</Label>
                        <Input name={'repeatY'} value={repeatY} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Rotation')}</Label>
                        <Input name={'rotation'} value={rotation} type={'number'} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('WrapS')}</Label>
                        <Select options={this.wrapS} name={'wrapS'} value={wrapS} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('WrapT')}</Label>
                        <Select options={this.wrapT} name={'wrapT'} value={wrapT} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('FlipY')}</Label>
                        <CheckBox name={'flipY'} value={flipY} onChange={this.handleChange}></CheckBox>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Mag Filter')}</Label>
                        <Select options={this.magFilter} name={'magFilter'} value={magFilter} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Min Filter')}</Label>
                        <Select options={this.minFilter} name={'minFilter'} value={minFilter} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Type')}</Label>
                        <Select options={this.type} name={'type'} value={type} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Encoding')}</Label>
                        <Select options={this.encoding} name={'encoding'} value={encoding} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Format')}</Label>
                        <Select options={this.format} name={'format'} value={format} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Generate Mipmaps')}</Label>
                        <CheckBox name={'generateMipmaps'} value={generateMipmaps} onChange={this.handleChange}></CheckBox>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Mapping')}</Label>
                        <Select options={this.mapping} name={'mapping'} value={mapping} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Premultiply Alpha')}</Label>
                        <CheckBox name={'premultiplyAlpha'} value={premultiplyAlpha} onChange={this.handleChange}></CheckBox>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Unpack Alignment')}</Label>
                        <Select options={this.unpackAlignment} name={'unpackAlignment'} value={unpackAlignment} onChange={this.handleChange}></Select>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Anisotropy')}</Label>
                        <Input name={'anisotropy'} value={anisotropy} type={'number'} precision={0} onChange={this.handleChange}></Input>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(value, name) {
        if (value === null) {
            return;
        }

        const { anisotropy, center, offset, repeat, rotation, type, encoding, flipY, format, generateMipmaps, magFilter, minFilter, mapping, premultiplyAlpha, unpackAlignment, wrapS, wrapT } = Object.assign({}, this.props.map, {
            [name]: value,
        });

        const { centerX, centerY } = Object.assign({}, center, {
            [name]: value,
        });

        const { offsetX, offsetY } = Object.assign({}, offset, {
            [name]: value,
        });

        const { repeatX, repeatY } = Object.assign({}, repeat, {
            [name]: value,
        });

        let map = this.props.map;

        Object.assign(map, {
            anisotropy,
            rotation,
            type: parseInt(type),
            encoding: parseInt(encoding),
            flipY,
            format: parseInt(format),
            generateMipmaps,
            magFilter: parseInt(magFilter),
            minFilter: parseInt(minFilter),
            mapping: parseInt(mapping),
            premultiplyAlpha,
            unpackAlignment: parseInt(unpackAlignment),
            wrapS: parseInt(wrapS),
            wrapT: parseInt(wrapT),
        });

        map.center.set(centerX, centerY);
        map.offset.set(offsetX, offsetY);
        map.repeat.set(repeatX, repeatY);

        map.needsUpdate = true;
    }

    handleClose() {
        app.removeElement(this);
    }
}

TextureSettingWindow.propTypes = {
    map: (props, propName, componentName) => {
        const map = props[propName];
        if (!(map instanceof THREE.Texture)) {
            return new TypeError(`Invalid prop \`${propName}\` of type supplied to \`${componentName}\`, expected \`THREE.Texture\`.`);
        }
    },
};

TextureSettingWindow.defaultProps = {
    map: null,
};

export default TextureSettingWindow;