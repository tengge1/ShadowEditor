import './css/Workspace.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

// form
import Button from '../form/Button.jsx';
import CheckBox from '../form/CheckBox.jsx';
import Form from '../form/Form.jsx';
import FormControl from '../form/FormControl.jsx';
import Input from '../form/Input.jsx';
import Label from '../form/Label.jsx';
import Radio from '../form/Radio.jsx';
import TextArea from '../form/TextArea.jsx';
import Toggle from '../form/Toggle.jsx';

// layout
import VBoxLayout from '../layout/VBoxLayout.jsx';

// panel
import Panel from '../panel/Panel.jsx';

/**
 * 工作区
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class Workspace extends React.Component {
    render() {
        const { className, style } = this.props;

        return <VBoxLayout className={classNames('Workspace', className)} style={style}>
            <Form>
                <FormControl>
                    <Label>First Name:</Label>
                    <Input />
                </FormControl>
                <FormControl>
                    <Label>Last Name:</Label>
                    <Input />
                </FormControl>
                <FormControl>
                    <Label>Password:</Label>
                    <Input />
                    <Label>Confirm Password:</Label>
                    <Input />
                </FormControl>
                <FormControl>
                    <Label>Description:</Label>
                    <TextArea></TextArea>
                </FormControl>
                <FormControl>
                    <Button>Default</Button>
                    <Button className={'primary'}>Primary</Button>
                    <Button className={'success'}>Success</Button>
                    <Button className={'warn'}>Warn</Button>
                    <Button className={'danger'}>Danger</Button>
                    <Button className={'disabled'}>Disabled</Button>
                </FormControl>
                <FormControl>
                    <CheckBox></CheckBox>
                    <CheckBox selected={true}></CheckBox>
                    <CheckBox disabled={true}></CheckBox>
                    <CheckBox selected={true} disabled={true}></CheckBox>
                </FormControl>
                <FormControl>
                    <Radio></Radio>
                    <Radio selected={true}></Radio>
                    <Radio disabled={true}></Radio>
                    <Radio selected={true} disabled={true}></Radio>
                </FormControl>
                <FormControl>
                    <Toggle></Toggle>
                    <Toggle selected={true}></Toggle>
                    <Toggle disabled={true}></Toggle>
                    <Toggle selected={true} disabled={true}></Toggle>
                </FormControl>
            </Form>
            <Panel title={'Panel'}></Panel>
        </VBoxLayout>;
    }
}

Workspace.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Workspace;