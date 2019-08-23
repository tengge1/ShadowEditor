import './css/TextureGeneratorWindow.css';
import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button } from '../../../third_party';
import Ajax from '../../../utils/Ajax';

/**
 * 纹理生成器窗口
 * @author tengge / https://github.com/tengge1
 */
class TextureGeneratorWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'TextureGeneratorWindow'}
            title={_t('Texture Generator')}
            style={{ width: '800px', height: '400px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>

            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default TextureGeneratorWindow;