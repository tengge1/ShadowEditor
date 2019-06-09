import './css/Timeline.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import TimelineControl from './private/TimelineControl.jsx';
import CheckBox from '../form/CheckBox.jsx';
import Label from '../form/Label.jsx';

/**
 * 时间轴
 * @author tengge / https://github.com/tengge1
 */
class Timeline extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();

        this.state = {
            animations: props.animations,
        };
    }

    render() {
        const { className, style } = this.props;

        const infos = this.state.animations.map(layer => {
            return <div className="info">
                <CheckBox value={layer.uuid}></CheckBox>
                <Label>{layer.layerName}</Label>
            </div>;
        });

        const groups = this.state.animations.map(group => {
            return <div className={'group'} key={group.uuid}>
                <div className={'label'}>{group.layerName}</div>
            </div>
        });

        return <div className={classNames('Timeline', className)} style={style}>
            <TimelineControl></TimelineControl>
            <div className="box">
                <div className="left">
                    {infos}
                </div>
                <div className="right">
                    <canvas className={'timeline'} ref={this.canvas}></canvas>
                    <div className="layers" style={{ width: '3600px' }}>
                        <div className="layer" droppable="true">
                            <div className="item" draggable="true" droppable="false" style={{ left: '235px', width: '80px', }}>Animation-1</div>
                        </div>
                    </div>
                </div>
                <div className="layer" droppable="true"></div>
                <div className="layer" droppable="true"></div>
            </div>
            <div className="slider"></div>
        </div>;
    }

    componentDidMount() {
        var duration = 120; // 持续时长(秒)
        var scale = 30; // 尺寸，1秒=30像素

        var width = duration * scale; // 画布宽度
        var scale5 = scale / 5; // 0.2秒像素数
        var margin = 0; // 时间轴前后间距

        var canvas = this.canvas.current;
        canvas.style.width = (width + margin * 2) + 'px';
        canvas.width = canvas.clientWidth;
        canvas.height = 32;

        var context = canvas.getContext('2d');

        // 时间轴背景
        context.fillStyle = '#fafafa';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 时间轴刻度
        context.strokeStyle = '#555';
        context.beginPath();

        for (var i = margin; i <= width + margin; i += scale) { // 绘制每一秒
            for (var j = 0; j < 5; j++) { // 绘制每个小格
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

        for (var i = 0; i <= duration; i += 2) { // 对于每两秒
            var minute = Math.floor(i / 60);
            var second = Math.floor(i % 60);

            var text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

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

    componentWillUnmount() {

    }
}

Timeline.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    animations: PropTypes.array,
};

Timeline.defaultProps = {
    className: null,
    style: null,
    animations: [],
};

export default Timeline;