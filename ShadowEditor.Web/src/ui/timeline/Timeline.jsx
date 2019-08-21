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

        this.state = {
            selectedLayer: null,
        };

        this.canvasRef = React.createRef();
        this.layersRef = React.createRef();
        this.sliderRef = React.createRef();

        this.handleAddLayer = this.handleAddLayer.bind(this);
        this.commitAddLayer = this.commitAddLayer.bind(this);

        this.handleEditLayer = this.handleEditLayer.bind(this);
        this.commitEditLayer = this.commitEditLayer.bind(this);

        this.handleDeleteLayer = this.handleDeleteLayer.bind(this);
        this.commitDeleteLayer = this.commitDeleteLayer.bind(this);

        this.handleSelectedLayerChange = this.handleSelectedLayerChange.bind(this);

        this.handleBackward = this.handleBackward.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleForward = this.handleForward.bind(this);
        this.handleStop = this.handleStop.bind(this);

        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    render() {
        const { className, style, animations, tip } = this.props;
        const { selectedLayer } = this.state;

        return <div className={classNames('Timeline', className)} style={style}>
            <Toolbar className={classNames('controls', className)} style={style}>
                <IconButton icon={'add'} title={_t('Add Layer')} onClick={this.handleAddLayer}></IconButton>
                <IconButton icon={'edit'} title={_t('Edit Layer')} onClick={this.handleEditLayer}></IconButton>
                <IconButton icon={'delete'} title={_t('Delete Layer')} onClick={this.handleDeleteLayer}></IconButton>
                <ToolbarSeparator></ToolbarSeparator>
                <IconButton icon={'backward'} title={_t('Slower')} onClick={this.handleBackward}></IconButton>
                <IconButton icon={'play'} title={_t('Play')} onClick={this.handlePlay}></IconButton>
                <IconButton icon={'pause'} title={_t('Pause')} onClick={this.handlePause}></IconButton>
                <IconButton icon={'forward'} title={_t('Faster')} onClick={this.handleForward}></IconButton>
                <IconButton icon={'stop'} title={_t('Stop')} onClick={this.handleStop}></IconButton>
                <ToolbarSeparator></ToolbarSeparator>
                <Label className={'time'}>{this.parseTime(this.time)}</Label>
                <Label className={'speed'}>{this.parseSpeed(this.speed)}</Label>
                <ToolbarFiller></ToolbarFiller>
                <Label>{tip}</Label>
            </Toolbar>
            <div className="box">
                <div className={'timeline'}>
                    <canvas ref={this.canvasRef}></canvas>
                </div>
                <div className={'layers'}>
                    {animations.map(layer => {
                        return <div className={'layer'} key={layer.uuid}>
                            <div className={'info'}>
                                <CheckBox name={layer.uuid} checked={selectedLayer === layer.uuid} onChange={this.handleSelectedLayerChange}></CheckBox>
                                <Label>{layer.layerName}</Label>
                            </div>
                            <div className={'animations'}>
                                {layer.animations.map(animation => {
                                    return <div
                                        className={'animation'}
                                        draggable={'true'}
                                        droppable={'false'}
                                        style={{
                                            left: animation.beginTime * this.scale + 'px',
                                            width: (animation.endTime - animation.beginTime) * this.scale + 'px',
                                        }}
                                        key={animation.uuid}>
                                        <span className={'smaller'}>{animation.name}</span>
                                    </div>;
                                })}
                            </div>
                        </div>;
                    })}
                    <div className="slider" ref={this.sliderRef}></div>
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        const { duration, scale } = this;

        const width = duration * scale; // 画布宽度
        const scale5 = scale / 5; // 0.2秒像素数
        const margin = 0; // 时间轴前后间距

        const canvas = this.canvasRef.current;

        canvas.style.width = (width + margin * 2) + 'px';
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
        context.fillStyle = '#888'

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

    handleAddLayer(event) {
        app.prompt({
            title: _t('Input Layer Name'),
            content: _t('Layer Name'),
            value: _t('New Layer'),
            onOK: this.commitAddLayer,
        });
    }

    commitAddLayer(layerName) {
        let animations = app.editor.animations;
        const layer = Math.max.apply(Math, animations.map(n => n.layer)) + 1;

        animations.push({
            id: null,
            layer,
            layerName: layerName,
            uuid: THREE.Math.generateUUID(),
            animations: [],
        });

        app.call(`animationChanged`, this);
    }

    handleEditLayer(event) {

    }

    commitEditLayer() {

    }

    handleDeleteLayer(event) {

    }

    commitDeleteLayer() {

    }

    handleSelectedLayerChange(value, name, event) {
        this.setState({
            selectedLayer: value ? name : null,
        });
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

    handleClick(event) {

    }

    handleDoubleClick(event) {

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
    tip: PropTypes.string,
};

Timeline.defaultProps = {
    className: null,
    style: null,
    animations: [],
    tip: undefined,
};

export default Timeline;