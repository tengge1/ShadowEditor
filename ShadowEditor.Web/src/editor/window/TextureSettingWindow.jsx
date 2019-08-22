import './css/OptionsWindow.css';
import { classNames, PropTypes, Window, Content, TabLayout, Buttons, Button } from '../../third_party';
import RendererPanel from './options/RendererPanel.jsx';
import HelperPanel from './options/HelperPanel.jsx';
import FilterPanel from './options/FilterPanel.jsx';
import Ajax from '../../utils/Ajax';

/**
 * 纹理设置窗口
 * @author tengge / https://github.com/tengge1
 */
class TextureSettingWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'TextureSettingWindow'}
            title={_t('Texture Settings')}
            style={{ width: '300px', height: '400px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {

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