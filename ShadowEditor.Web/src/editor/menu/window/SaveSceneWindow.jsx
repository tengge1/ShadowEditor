import './css/SaveSceneWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../third_party';
import Converter from '../../../serialization/Converter';
import Ajax from '../../../utils/Ajax';

/**
 * 保存场景窗口
 * @author tengge / https://github.com/tengge1
 */
class SaveSceneWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sceneName: app.editor.sceneName || _t('New Scene')
        };

        this.handleChange = this.handleChange.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { sceneName } = this.state;

        return <Window
            className={'SaveSceneWindow'}
            title={_t('Save Scene')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
        >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input name={'sceneName'}
                            value={sceneName}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSave() {
        var editor = app.editor;

        const { sceneName } = this.state;

        app.mask(_t('Waiting...'));

        var obj = new Converter().toJSON({
            options: app.options,
            camera: editor.camera,
            renderer: editor.renderer,
            scripts: editor.scripts,
            animations: editor.animations,
            scene: editor.scene,
            visual: editor.visual
        });

        Ajax.post(`${app.options.server}/api/Scene/Save`, {
            Name: sceneName,
            Data: JSON.stringify(obj)
        }, result => {
            var obj = JSON.parse(result);

            if (obj.Code === 200) {
                editor.sceneID = obj.ID;
                editor.sceneName = sceneName;
                document.title = sceneName;
            }

            app.call(`sceneSaved`, this);

            app.unmask();

            this.handleClose();

            app.toast(_t(obj.Msg), 'success');
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default SaveSceneWindow;