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
import Content from '../layout/Content.jsx';
import HBoxLayout from '../layout/HBoxLayout.jsx';
import TabLayout from '../layout/TabLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

// panel
import Panel from '../panel/Panel.jsx';

import MenuBar from './MenuBar.jsx';
import Toolbar from './Toolbar.jsx';

const Style = {
    container: {
        width: '100%',
        height: '100%',
    },
    dropDown: {
        display: 'none',
    },
    main: {
        flex: 1,
    },
    workspace: {
        flex: 1,
    },
    sideBar: {
        width: '240px',
    },
    halfSideBar: {
        height: '50%',
    }
};

/**
 * 编辑器
 */
class Editor {
    render(container) {
        const component = (
            <VBoxLayout style={Style.container}>
                <MenuBar></MenuBar>
                <HBoxLayout style={Style.main}>
                    <Toolbar></Toolbar>
                    <VBoxLayout style={Style.workspace}>
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
                    </VBoxLayout>
                    {/* 右侧边栏 */}
                    <VBoxLayout style={Style.sideBar}>
                        <TabLayout style={Style.halfSideBar}>
                            <Panel title={'Hierarchy'} header={false}></Panel>
                            <Panel title={'History'} header={false}></Panel>
                        </TabLayout>
                        <TabLayout style={Style.halfSideBar}>
                            <Panel title={'Property'} header={false}></Panel>
                            <Panel title={'Animation'} header={false}></Panel>
                        </TabLayout>
                    </VBoxLayout>
                </HBoxLayout>
            </VBoxLayout>
        );

        ReactDOM.render(component, container);
    }
}

export default Editor;