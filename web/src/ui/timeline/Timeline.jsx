/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Timeline.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import CheckBox from '../form/CheckBox.jsx';
import Label from '../form/Label.jsx';
import IconButton from '../form/IconButton.jsx';
import Toolbar from '../toolbar/Toolbar.jsx';
import ToolbarSeparator from '../toolbar/ToolbarSeparator.jsx';
import ToolbarFiller from '../toolbar/ToolbarFiller.jsx';

/**
 * 时间轴
 * @author tengge / https://github.com/tengge1
 */
class Timeline extends React.Component {
    constructor(props) {
        super(props);

        this.duration = 120; // 持续时长(秒)
        this.scale = 30; // 尺寸，1秒=30像素
        this.time = 0; // 当前时间
        this.speed = 16; // 当前速度

        this.canvasRef = React.createRef();
        this.layersRef = React.createRef();
        this.leftRef = React.createRef();
        this.rightRef = React.createRef();
        this.sliderRef = React.createRef();

        this.handleAddLayer = this.handleAddLayer.bind(this, props.onAddLayer);
        this.handleEditLayer = this.handleEditLayer.bind(this, props.onEditLayer);
        this.handleDeleteLayer = this.handleDeleteLayer.bind(this, props.onDeleteLayer);
        this.commitDeleteLayer = this.commitDeleteLayer.bind(this);

        this.handleSelectedLayerChange = this.handleSelectedLayerChange.bind(this, props.onSelectedLayerChange);

        this.handleBackward = this.handleBackward.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleForward = this.handleForward.bind(this);
        this.handleStop = this.handleStop.bind(this);

        this.handleClick = this.handleClick.bind(this, props.onClickAnimation);
        this.handleDoubleClick = this.handleDoubleClick.bind(this, props.onAddAnimation);
        this.handleRightScroll = this.handleRightScroll.bind(this);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this, props.onDropAnimation);
    }

    render() {
        const { className, style, animations, selectedLayer, selected } = this.props;

        return <div className={classNames('Timeline', className)}
            style={style}
               >
            <Toolbar className={classNames('controls', className)}
                style={style}
            >
                <IconButton icon={'add'}
                    title={_t('Add Layer')}
                    onClick={this.handleAddLayer}
                />
                <IconButton icon={'edit'}
                    title={_t('Edit Layer')}
                    onClick={this.handleEditLayer}
                />
                <IconButton icon={'delete'}
                    title={_t('Delete Layer')}
                    onClick={this.handleDeleteLayer}
                />
                <ToolbarSeparator />
                <IconButton icon={'backward'}
                    title={_t('Slower')}
                    onClick={this.handleBackward}
                />
                <IconButton icon={'play'}
                    title={_t('Play')}
                    onClick={this.handlePlay}
                />
                <IconButton icon={'pause'}
                    title={_t('Pause')}
                    onClick={this.handlePause}
                />
                <IconButton icon={'forward'}
                    title={_t('Faster')}
                    onClick={this.handleForward}
                />
                <IconButton icon={'stop'}
                    title={_t('Stop')}
                    onClick={this.handleStop}
                />
                <ToolbarSeparator />
                <Label className={'time'}>{this.parseTime(this.time)}</Label>
                <Label className={'speed'}>{this.parseSpeed(this.speed)}</Label>
                <ToolbarFiller />
                <Label>{_t('Illustrate: Double-click the area below the timeline to add an animation.')}</Label>
            </Toolbar>
            <div className="box">
                <div className={'timeline'}>
                    <div className="mask" />
                    <canvas ref={this.canvasRef} />
                </div>
                <div className={'layers'}>
                    <div className={'left'}
                        ref={this.leftRef}
                    >
                        {animations.map(layer => {
                            return <div className={'info'}
                                key={layer.uuid}
                                   >
                                <CheckBox name={layer.uuid}
                                    checked={selectedLayer === layer.uuid}
                                    onChange={this.handleSelectedLayerChange}
                                />
                                <Label>{layer.layerName}</Label>
                            </div>;
                        })}
                    </div>
                    <div className={'right'}
                        ref={this.rightRef}
                        onScroll={this.handleRightScroll}
                    >
                        {animations.map(layer => {
                            return <div
                                className={'layer'}
                                droppable={'true'}
                                data-type={'layer'}
                                data-id={layer.uuid}
                                onDoubleClick={this.handleDoubleClick}
                                onDragEnter={this.handleDragEnter}
                                onDragOver={this.handleDragOver}
                                onDragLeave={this.handleDragLeave}
                                onDrop={this.handleDrop}
                                key={layer.uuid}
                                   >
                                {layer.animations.map(animation => {
                                    return <div
                                        className={classNames('animation', selected === animation.uuid && 'selected')}
                                        title={animation.name}
                                        draggable={'true'}
                                        droppable={'false'}
                                        data-type={'animation'}
                                        data-id={animation.uuid}
                                        data-pid={layer.uuid}
                                        style={{
                                            left: animation.beginTime * this.scale + 'px',
                                            width: (animation.endTime - animation.beginTime) * this.scale + 'px'
                                        }}
                                        onClick={this.handleClick}
                                        onDragStart={this.handleDragStart}
                                        onDragEnd={this.handleDragEnd}
                                        key={animation.uuid}
                                           >{animation.name}</div>;
                                })}
                            </div>;
                        })}
                    </div>
                    <div className="slider"
                        ref={this.sliderRef}
                    />
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        this.renderTimeline();
    }

    renderTimeline() {
        const { duration, scale } = this;

        const width = duration * scale; // 画布宽度
        const scale5 = scale / 5; // 0.2秒像素数
        const margin = 0; // 时间轴前后间距

        const canvas = this.canvasRef.current;

        canvas.style.width = width + margin * 2 + 'px';
        canvas.width = canvas.clientWidth;
        canvas.height = 32;

        const context = canvas.getContext('2d');

        // 时间轴背景
        context.fillStyle = '#fafafa';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 时间轴刻度
        context.strokeStyle = '#555';
        context.beginPath();

        for (let i = margin; i <= width + margin; i += scale) { // 绘制每一秒
            for (let j = 0; j < 5; j++) { // 绘制每个小格
                if (j === 0) { // 长刻度
                    context.moveTo(i + scale5 * j, 22);
                    context.lineTo(i + scale5 * j, 30);
                } else { // 短刻度
                    context.moveTo(i + scale5 * j, 26);
                    context.lineTo(i + scale5 * j, 30);
                }
            }
        }

        context.stroke();

        // 时间轴文字
        context.font = '12px Arial';
        context.fillStyle = '#888';

        for (let i = 0; i <= duration; i += 2) { // 对于每两秒
            let minute = Math.floor(i / 60);
            let second = Math.floor(i % 60);

            let text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

            if (i === 0) {
                context.textAlign = 'left';
            } else if (i === duration) {
                context.textAlign = 'right';
            } else {
                context.textAlign = 'center';
            }

            context.fillText(text, margin + i * scale, 16);
        }
    }

    handleAddLayer(onAddLayer, event) {
        onAddLayer && onAddLayer(event);
    }

    handleEditLayer(onEditLayer, event) {
        const { selectedLayer } = this.props;

        onEditLayer && onEditLayer(selectedLayer, event);
    }

    handleDeleteLayer(onDeleteLayer, event) {
        const { selectedLayer } = this.props;

        onDeleteLayer && onDeleteLayer(selectedLayer, event);
    }

    commitDeleteLayer() {

    }

    handleSelectedLayerChange(onSelectedLayerChange, value, name, event) {
        onSelectedLayerChange && onSelectedLayerChange(value ? name : null, event);
    }

    handleBackward(event) {

    }

    handlePlay(event) {

    }

    handlePause(event) {

    }

    handleForward(event) {

    }

    handleStop(event) {

    }

    handleClick(onClickAnimation, event) {
        const type = event.target.getAttribute('data-type');

        if (type !== 'animation') {
            return;
        }

        const pid = event.target.getAttribute('data-pid');
        const id = event.target.getAttribute('data-id');

        onClickAnimation && onClickAnimation(id, pid, event);
    }

    handleDoubleClick(onAddAnimation, event) {
        const type = event.target.getAttribute('data-type');

        if (type !== 'layer') {
            return;
        }

        const layerID = event.target.getAttribute('data-id');

        const beginTime = event.nativeEvent.offsetX / this.scale;
        const endTime = beginTime + 2;

        onAddAnimation && onAddAnimation(layerID, beginTime, endTime, event);
    }

    handleRightScroll(scroll) {
        let left = this.leftRef.current;
        let canvas = this.canvasRef.current;

        left.scrollTop = event.target.scrollTop;
        canvas.style.left = `${100 - event.target.scrollLeft}px`;
    }

    handleDragStart(event) {
        const type = event.target.getAttribute('data-type');

        if (type !== 'animation') {
            return;
        }

        const id = event.target.getAttribute('data-id');
        const pid = event.target.getAttribute('data-pid');

        event.nativeEvent.dataTransfer.setData('id', id);
        event.nativeEvent.dataTransfer.setData('pid', pid);
        event.nativeEvent.dataTransfer.setData('offsetX', event.nativeEvent.offsetX);
    }

    handleDragEnd(event) {
        event.nativeEvent.dataTransfer.clearData();
    }

    handleDragEnter(event) {
        event.preventDefault();
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDragLeave(event) {
        event.preventDefault();
    }

    handleDrop(onDropAnimation, event) {
        const type = event.target.getAttribute('data-type');

        if (type !== 'layer') {
            return;
        }

        const id = event.nativeEvent.dataTransfer.getData('id');
        const oldLayerID = event.nativeEvent.dataTransfer.getData('pid');
        const offsetX = event.nativeEvent.dataTransfer.getData('offsetX');

        const newLayerID = event.target.getAttribute('data-id');

        const beginTime = (event.nativeEvent.offsetX - offsetX) / this.scale;

        onDropAnimation && onDropAnimation(id, oldLayerID, newLayerID, beginTime, event);
    }

    parseTime(time) {
        let minute = `0${parseInt(time / 60)}`;
        let second = `0${parseInt(time % 60)}`;
        return `${minute.substr(minute.length - 2, 2)}:${second.substr(second.length - 2, 2)}`;
    }

    parseSpeed(speed) {
        return speed;
    }
}

Timeline.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    animations: PropTypes.array,
    selectedLayer: PropTypes.string,
    selected: PropTypes.string,

    onAddLayer: PropTypes.func,
    onEditLayer: PropTypes.func,
    onDeleteLayer: PropTypes.func,
    onSelectedLayerChange: PropTypes.func,

    onAddAnimation: PropTypes.func,
    onDropAnimation: PropTypes.func,
    onClickAnimation: PropTypes.func
};

Timeline.defaultProps = {
    className: null,
    style: null,
    animations: [],
    selectedLayer: null,
    selected: null,

    onAddLayer: null,
    onEditLayer: null,
    onDeleteLayer: null,
    onSelectedLayerChange: null,

    onAddAnimation: null,
    onDropAnimation: null,
    onClickAnimation: null
};

export default Timeline;