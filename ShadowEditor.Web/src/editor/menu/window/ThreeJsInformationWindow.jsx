import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button } from '../../../third_party';

/**
 * Three.js信息窗口
 * @author tengge / https://github.com/tengge1
 */
class ThreeJsInformationWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const state = this.state;

        return <Window
            className={'ThreeJsInformationWindow'}
            title={_t('Three.js Information')}
            style={{ width: '320px', height: '160px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Version')}</Label>
                        <Input value={THREE.REVISION} disabled={true}></Input>
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

export default ThreeJsInformationWindow;