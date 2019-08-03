import './css/TimelineControl.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Toolbar from '../../toolbar/Toolbar.jsx';
import ToolbarFiller from '../../toolbar/ToolbarFiller.jsx';
import ToolbarSeparator from '../../toolbar/ToolbarSeparator.jsx';
import IconButton from '../../form/IconButton.jsx';
import Label from '../../form/Label.jsx';

/**
 * 时间轴控制
 * @author tengge / https://github.com/tengge1
 */
class TimelineControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 0,
        };

        this.handleAddLayer = this.handleAddLayer.bind(this, props.onAddLayer);
        this.handleDeleteLayer = this.handleDeleteLayer.bind(this, props.onDeleteLayer);
        this.handleBackward = this.handleBackward.bind(this, this.onBackward);
        this.handlePlay = this.handlePlay.bind(this, props.onPlay);
        this.handlePause = this.handlePause.bind(this, props.onPause);
        this.handleForward = this.handleForward.bind(this, props.onForward);
        this.handleStop = this.handleStop.bind(this, props.onStop);
    }

    render() {
        const { className, style, time, speed, tip } = this.props;

        return <Toolbar className={classNames('TimelineControl', className)} style={style}>
            <IconButton icon={'add'} title={'Add Layer'} onClick={this.handleAddLayer}></IconButton>
            <IconButton icon={'delete'} title={'Delete Layer'} onClick={this.handleDeleteLayer}></IconButton>
            <ToolbarSeparator></ToolbarSeparator>
            <IconButton icon={'backward'} title={'Slower'} onClick={this.handleBackward}></IconButton>
            <IconButton icon={'play'} title={'Play'} onClick={this.handlePlay}></IconButton>
            <IconButton icon={'pause'} title={'Pause'} onClick={this.handlePause}></IconButton>
            <IconButton icon={'forward'} title={'Faster'} onClick={this.handleForward}></IconButton>
            <IconButton icon={'stop'} title={'Stop'} onClick={this.handleStop}></IconButton>
            <ToolbarSeparator></ToolbarSeparator>
            <Label className={'time'}>{this.parseTime(time)}</Label>
            <Label className={'speed'}>{this.parseSpeed(speed)}</Label>
            <ToolbarFiller></ToolbarFiller>
            <Label>{tip}</Label>
        </Toolbar>;
    }

    parseTime(time) {
        let minute = `0${parseInt(time / 60)}`;
        let second = `0${parseInt(time % 60)}`;
        return `${minute.substr(minute.length - 2, 2)}:${second.substr(second.length - 2, 2)}`;
    }

    parseSpeed(speed) {

    }

    handleAddLayer(onAddLayer, event) {
        onAddLayer && onAddLayer(event);
    }

    handleDeleteLayer(onDeleteLayer, event) {
        onDeleteLayer && onDeleteLayer(event);
    }

    handleBackward(onBackward, event) {
        onBackward && onBackward(event);
    }

    handlePlay(onPlay, event) {
        onPlay && onPlay(event);
    }

    handlePause(onPause, event) {
        onPause && onPause(event);
    }

    handleForward(onForward, event) {
        onForward && onForward(event);
    }

    handleStop(onStop, event) {
        onStop && onStop(event);
    }
}

TimelineControl.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    time: PropTypes.number,
    speed: PropTypes.number,
    tip: PropTypes.string,

    onAddLayer: PropTypes.func,
    onDeleteLayer: PropTypes.func,
    onBackward: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onForward: PropTypes.func,
    onStop: PropTypes.func,
};

TimelineControl.defaultProps = {
    className: null,
    style: null,
    time: 0,
    speed: 1,
    tip: 'Double click the area below to add animation.',

    onAddLayer: null,
    onDeleteLayer: null,
    onBackward: null,
    onPlay: null,
    onPause: null,
    onForward: null,
    onStop: null,
};

export default TimelineControl;