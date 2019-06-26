import './css/HistoryPanel.css';
import { classNames, PropTypes } from '../../third_party';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class HistoryPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={'HistoryPanel'}>
            <div className={'item'}>Add Object:Box</div>
            <div className={'item'}>Set Position</div>
            <div className={'item'}>Set Position</div>
            <div className={'item undo'}>Set Position</div>
        </div>;
    }
}

export default HistoryPanel;