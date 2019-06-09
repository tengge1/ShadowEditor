import './css/TimelinePanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Timeline from '../../timeline/Timeline.jsx';

/**
 * 时间轴面板
 * @author tengge / https://github.com/tengge1
 */
class TimelinePanel extends React.Component {
    constructor(props) {
        super(props);

        this.animations = [{ 'id': null, 'uuid': 'CE0735C0-0DDB-4442-BA59-8E3F2CC9E8EB', 'layer': 0, 'layerName': 'AnimLayer1', 'animations': [{ 'id': null, 'uuid': 'D5694AFC-9865-4E10-89BC-75E9404ABBD9', 'name': 'Animation-1', 'target': null, 'type': 'Tween', 'beginTime': 6.3, 'endTime': 8.966666666666667, 'data': { 'beginStatus': 'Current', 'beginPositionX': 0, 'beginPositionY': 0, 'beginPositionZ': 0, 'beginRotationX': 0, 'beginRotationY': 0, 'beginRotationZ': 0, 'beginScaleLock': true, 'beginScaleX': 1, 'beginScaleY': 1, 'beginScaleZ': 1, 'ease': 'linear', 'endStatus': 'Current', 'endPositionX': 0, 'endPositionY': 0, 'endPositionZ': 0, 'endRotationX': 0, 'endRotationY': 0, 'endRotationZ': 0, 'endScaleLock': true, 'endScaleX': 1, 'endScaleY': 1, 'endScaleZ': 1 } }] }, { 'id': null, 'uuid': 'D485373E-A61A-4B86-8F7C-0AB0249BF8A4', 'layer': 1, 'layerName': 'AnimLayer2', 'animations': [{ 'id': null, 'uuid': 'DA28FB5D-0387-4005-BA4D-8FC56EEFBC77', 'name': 'Animation-2', 'target': null, 'type': 'Tween', 'beginTime': 14.066666666666666, 'endTime': 16.733333333333334, 'data': { 'beginStatus': 'Current', 'beginPositionX': 0, 'beginPositionY': 0, 'beginPositionZ': 0, 'beginRotationX': 0, 'beginRotationY': 0, 'beginRotationZ': 0, 'beginScaleLock': true, 'beginScaleX': 1, 'beginScaleY': 1, 'beginScaleZ': 1, 'ease': 'linear', 'endStatus': 'Current', 'endPositionX': 0, 'endPositionY': 0, 'endPositionZ': 0, 'endRotationX': 0, 'endRotationY': 0, 'endRotationZ': 0, 'endScaleLock': true, 'endScaleX': 1, 'endScaleY': 1, 'endScaleZ': 1 } }] }, { 'id': null, 'uuid': '953EE55F-0600-44F8-A321-C536653411FD', 'layer': 2, 'layerName': 'AnimLayer3', 'animations': [{ 'id': null, 'uuid': '25F98620-69DE-4938-A8DD-806DA7DA4206', 'name': 'Animation-3', 'target': null, 'type': 'Tween', 'beginTime': 25.533333333333335, 'endTime': 28.2, 'data': { 'beginStatus': 'Current', 'beginPositionX': 0, 'beginPositionY': 0, 'beginPositionZ': 0, 'beginRotationX': 0, 'beginRotationY': 0, 'beginRotationZ': 0, 'beginScaleLock': true, 'beginScaleX': 1, 'beginScaleY': 1, 'beginScaleZ': 1, 'ease': 'linear', 'endStatus': 'Current', 'endPositionX': 0, 'endPositionY': 0, 'endPositionZ': 0, 'endRotationX': 0, 'endRotationY': 0, 'endRotationZ': 0, 'endScaleLock': true, 'endScaleX': 1, 'endScaleY': 1, 'endScaleZ': 1 } }] }];
    }

    render() {
        return <Timeline className={'TimelinePanel'} animations={this.animations}></Timeline>;
    }
}

export default TimelinePanel;