import './css/ScriptPanel.css';
import { classNames, PropTypes } from '../../third_party';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={'ScriptPanel'}>
            <div className={'item'}>Add Object:Box</div>
            <div className={'item'}>Set Position</div>
            <div className={'item'}>Set Position</div>
            <div className={'item undo'}>Set Position</div>
        </div>;
    }
}

export default ScriptPanel;