import './css/CreateFontWindow.css';
import { Window, Content, Buttons, Button } from '../../../third_party';

/**
 * 创建字体窗口
 * @author tengge / https://github.com/tengge1
 */
class CreateFontWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'CreateFontWindow'}
            title={_t('Create Font')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content />
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default CreateFontWindow;