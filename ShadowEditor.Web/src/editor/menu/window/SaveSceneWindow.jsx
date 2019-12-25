import './css/SaveSceneWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../third_party';

/**
 * 保存场景窗口
 * @author tengge / https://github.com/tengge1
 */
class SaveSceneWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'SaveSceneWindow'}
            title={_t('Save Scene')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl key={key}>
                        <Label>{_t('Name')}</Label>
                        <Input name={'name'}
                            value={''}
                            disabled
                        />
                    </FormControl>
                </Form>
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

export default SaveSceneWindow;