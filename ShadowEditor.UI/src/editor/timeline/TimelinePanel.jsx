import './css/TimelinePanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Timeline from '../../timeline/Timeline.jsx';

/**
 * 时间轴面板
 * @author tengge / https://github.com/tengge1
 */
class TimelinePanel extends React.Component {
    render() {
        return <Timeline className={'TimelinePanel'}></Timeline>;
    }
}

export default TimelinePanel;