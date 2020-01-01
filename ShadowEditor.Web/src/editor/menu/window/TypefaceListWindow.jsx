import './css/TypefaceListWindow.css';
import { Window, Content, Buttons, Button, Label, Input, CheckBox, Form, FormControl, LinkButton } from '../../../third_party';

/**
 * 字体列表窗口
 * @author tengge / https://github.com/tengge1
 */
class TypefaceListWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'TypefaceListWindow'}
            title={_t('Typeface List')}
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

export default TypefaceListWindow;