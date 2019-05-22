import './css/EWorkspace.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Button from '../form/Button.jsx';
import CheckBox from '../form/CheckBox.jsx';
import Form from '../form/Form.jsx';
import FormControl from '../form/FormControl.jsx';
import Input from '../form/Input.jsx';
import Label from '../form/Label.jsx';
import Radio from '../form/Radio.jsx';
import TextArea from '../form/TextArea.jsx';
import Toggle from '../form/Toggle.jsx';

import Icon from '../icon/Icon.jsx';

import VBoxLayout from '../layout/VBoxLayout.jsx';
import Panel from '../panel/Panel.jsx';
import Alert from '../window/Alert.jsx';

/**
 * 工作区
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 */
class EWorkspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: '',
        };

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(value) {
        this.setState({
            inputValue: value,
        });
    }

    render() {
        const { className, ...others } = this.props;

        return <VBoxLayout className={classNames('EWorkspace', className)} {...others}>
            <Panel title={'Panel'} style={{ width: '480px', marginTop: '320px' }}>
                <Form>
                    <FormControl>
                        <Label>Button</Label>
                        <Button onClick={() => { alert('Default!'); }}>Default</Button>
                        <Button color={'primary'}>Primary</Button>
                        <Button color={'success'}>Success</Button>
                        <Button color={'warn'}>Warn</Button>
                        <Button color={'danger'}>Danger</Button>
                        <Button disabled={true}>Disabled</Button>
                    </FormControl>
                    <FormControl>
                        <Label>Input</Label>
                        <Input value={this.state.inputValue} placeholder={'Input something here.'} onChange={this.handleInput} />
                        <Label>{this.state.inputValue}</Label>
                    </FormControl>
                    <FormControl>
                        <Label>CheckBox</Label>
                        <CheckBox onChange={value => { alert(value); }} />
                        <CheckBox selected={true} />
                        <CheckBox disabled={true} />
                        <CheckBox selected={true} disabled={true} />
                    </FormControl>
                    <FormControl>
                        <Label>Radio</Label>
                        <Radio name={'radio'} onChange={value => { alert(value); }} />
                        <Radio name={'radio'} selected={true} />
                        <Radio name={'radio'} disabled={true} />
                        <Radio name={'radio'} selected={true} disabled={true} />
                    </FormControl>
                    <FormControl>
                        <Label>Toggle</Label>
                        <Toggle />
                        <Toggle selected={true} />
                        <Toggle disabled={true} />
                        <Toggle selected={true} disabled={true} />
                    </FormControl>
                    <FormControl>
                        <Label>TextArea</Label>
                        <TextArea onChange={value => { alert(value); }}></TextArea>
                    </FormControl>
                    <FormControl>
                        <Icon icon={'translate'} />
                        <Icon icon={'rotate'} />
                        <Icon icon={'scale'} />
                    </FormControl>
                </Form>
            </Panel>
            <Alert>Hello, world!</Alert>
        </VBoxLayout>;
    }
}

EWorkspace.propTypes = {
    className: PropTypes.string,
};

export default EWorkspace;