import './css/EditorStatusBar.css';
import { classNames, PropTypes, Toolbar, ToolbarSeparator, Label, CheckBox, Button } from '../../third_party';

/**
 * 状态栏
 * @author tengge / https://github.com/tengge1
 */
class EditorStatusBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Toolbar className={'EditorStatusBar'}>
            <Label>{_t('Object')}</Label>
        </Toolbar>;
    }
}

export default EditorStatusBar;