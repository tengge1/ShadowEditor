import './css/EditorStatusBar.css';
import { classNames, PropTypes, Toolbar, ToolbarSeparator, Label, CheckBox } from '../../third_party';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 */
class EditorStatusBar extends React.Component {
    render() {
        return <Toolbar className={'EditorStatusBar'}>
            <Label>Object</Label>
            <Label>198</Label>
            <Label>Vertex</Label>
            <Label>324,594</Label>
            <Label>Triangle</Label>
            <Label>108,198</Label>
            <ToolbarSeparator></ToolbarSeparator>
            <Label>Throw Ball</Label>
            <CheckBox></CheckBox>
        </Toolbar>;
    }
}

export default EditorStatusBar;