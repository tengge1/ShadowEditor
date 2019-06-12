import './css/HistoryPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Content from '../../layout/Content.jsx';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class HistoryPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Content className={'HistoryPanel'}>
            <div className={'item'}>Add Object:Box</div>
            <div className={'item'}>Set Position</div>
            <div className={'item'}>Set Position</div>
            <div className={'item undo'}>Set Position</div>
        </Content>;
    }
}

export default HistoryPanel;