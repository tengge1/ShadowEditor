import './css/TypefaceManagementWindow.css';
import { Window, Content, Buttons, Button } from '../../../third_party';

/**
 * 字体管理器窗口
 * @author tengge / https://github.com/tengge1
 */
class TypefaceManagementWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'TypefaceManagementWindow'}
            title={_t('Typeface Management')}
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

    componentDidMount() {
        app.require('opentype');
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default TypefaceManagementWindow;