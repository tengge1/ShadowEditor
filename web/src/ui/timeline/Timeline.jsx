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
import global from '../../global';
import { Input } from '../index';
import TimeUtils from '../../utils/TimeUtils';
import { throttle } from '../../utils/functionalUtils';

/**
 * 时间轴
 * @author tengge / https://github.com/tengge1
 */
class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 动画时长
      duration: 120,
      // 每秒钟像素数
      scale: 30,
      // 当前动画时间
      time: 0,
      // 速度
      speed: 16,
      // 是否处于修改结束时间状态
      isEditorTime: false,
      // 最长的动画时长
      maxAnimationTime: 3600,
      // 是否处于播放动画状态
      isPlay: false,
    };

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
    this.editorEndTime = this.editorEndTime.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.scrollTimeLine = this.scrollTimeLine.bind(this);
    this.playEndCallback = this.playEndCallback.bind(this);
  }

  render() {
    const { className, style, animations, selectedLayer, selected } = this.props;

    return (
      <div className={classNames('Timeline', className)} style={style}>
        <Toolbar className={classNames('controls', className)} style={style}>
          <IconButton icon={'add'} title={_t('Add Layer')} onClick={this.handleAddLayer} />
          <IconButton icon={'edit'} title={_t('Edit Layer')} onClick={this.handleEditLayer} />
          <IconButton icon={'delete'} title={_t('Delete Layer')} onClick={this.handleDeleteLayer} />
          <ToolbarSeparator />
          <IconButton icon={'backward'} title={_t('Slower')} onClick={this.handleBackward} />
          {this.state.isPlay ? <IconButton icon={'pause'} title={_t('Pause')} onClick={this.handlePause} /> : <IconButton icon={'play'} title={_t('Play')} onClick={this.handlePlay} />}
          <IconButton icon={'forward'} title={_t('Faster')} onClick={this.handleForward} />
          <IconButton icon={'stop'} title={_t('Stop')} onClick={this.handleStop} />
          <ToolbarSeparator />
          <Label className={'time'}>{this.parseTime(this.state.time)}</Label>
          <ToolbarSeparator />
          <div style={{ display: 'flex', alignItems: this.state.isEditorTime ? 'center' : 'flex-end' }} onClick={this.editorEndTime}>
            {_t('EndTime')}:{this.state.isEditorTime ? <Input autoFocus={true} value={TimeUtils.formatSeconds(this.state.duration)} onChange={this.handleChange} onBlur={this.handleBlur} /> : <span>{TimeUtils.formatSeconds(this.state.duration)}</span>}
          </div>
          {/* <Label className={'speed'}>{this.parseSpeed(this.speed)}</Label> */}
          <ToolbarFiller />
          <Label>{_t('Illustrate: Double-click the area below the timeline to add an animation.')}</Label>
        </Toolbar>
        <div className="box">
          <div className={'timeline'}>
            <div className="mask" />
            <canvas ref={this.canvasRef} />
          </div>
          <div className={'layers'}>
            <div className={'left'} ref={this.leftRef}>
              {animations.map(layer => {
                return (
                  <div className={'info'} key={layer.uuid}>
                    <CheckBox name={layer.uuid} checked={selectedLayer === layer.uuid} onChange={this.handleSelectedLayerChange} />
                    <Label>{layer.layerName}</Label>
                  </div>
                );
              })}
            </div>
            <div className={'right'} ref={this.rightRef} onScroll={this.handleRightScroll}>
              {animations.map(layer => {
                return (
                  <div className={'layer'} droppable={'true'} data-type={'layer'} data-id={layer.uuid} onDoubleClick={this.handleDoubleClick} onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop} key={layer.uuid}>
                    {layer.animations.map(animation => {
                      return (
                        <div
                          className={classNames('animation', selected === animation.uuid && 'selected')}
                          title={animation.name}
                          draggable={'true'}
                          droppable={'false'}
                          data-type={'animation'}
                          data-id={animation.uuid}
                          data-pid={layer.uuid}
                          style={{
                            left: animation.beginTime * this.state.scale + 'px',
                            width: (animation.endTime - animation.beginTime) * this.state.scale + 'px',
                          }}
                          onClick={this.handleClick}
                          onDragStart={this.handleDragStart}
                          onDragEnd={this.handleDragEnd}
                          key={animation.uuid}
                        >
                          {animation.name}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/* 开始分界线 */}
            <div className="slider" />

            {/* 动画进度条 */}
            <div className="slider" ref={this.sliderRef} />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // 渲染时间轴
    this.renderTimeline();
  }

  /**
   * 渲染时间轴
   * @param {number} durationEdit 指定的时间轴时长
   * @param {number} scaleEdit 指定的每秒钟跨度px
   */
  renderTimeline(durationEdit, scaleEdit) {
    // 获取默认的duration和scale
    let { duration, scale } = this.state;

    // 如果接收到的了自定义的duration就使用自定义的
    if (durationEdit) {
      duration = durationEdit;
    }

    // 如果接收到的了自定义的scale就使用自定义的
    if (scaleEdit) {
      scale = scaleEdit;
    }

    const width = duration * scale; // 画布宽度
    const scale5 = scale / 5;
    const margin = 0; // 时间轴前后间距

    // 时间轴画布实例
    const canvas = this.canvasRef.current;

    // 计算画布宽度(3600)
    canvas.style.width = width + margin * 2 + 'px';
    canvas.width = canvas.clientWidth;
    canvas.height = 32;

    const context = canvas.getContext('2d');

    // 时间轴背景
    context.fillStyle = '#fafafa';

    // 清空时间轴
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 时间轴刻度
    context.strokeStyle = '#555';
    context.beginPath();

    for (let i = margin; i <= width + margin; i += scale) {
      for (let j = 0; j < 5; j++) {
        // 绘制每个小格
        if (j === 0) {
          // 长刻度
          context.moveTo(i + scale5 * j, 22);
          context.lineTo(i + scale5 * j, 30);
        } else {
          // 短刻度
          context.moveTo(i + scale5 * j, 26);
          context.lineTo(i + scale5 * j, 30);
        }
      }
    }

    context.stroke();

    // 时间轴刻度字体样式设置
    context.font = '12px Arial';
    context.fillStyle = '#888';

    // 处理每进度的2%就绘制一次文字刻度
    for (let i = 0; i <= duration; i += duration / 60) {
      // 转化秒与分钟
      let minute = Math.floor(i / 60);
      let second = Math.floor(i % 60);

      // 生成要在画布上绘制的文本。如果有经过的分钟数，则将其添加到文本中，后跟冒号（':'）。然后，使用 '0' + second 将秒数转换为字符串，并使用 .slice(-2) 截取最后两个字符，确保秒数始终显示为两位数字。最终生成的文本存储在 text 变量中。
      let text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

      // 设置文字的样式
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

  /**
   * 结束时间修改触发
   * @param {string} value 修改后的结束事件
   */
  handleChange(value) {
    // 根据输入的时间将分钟:秒数的格式转换为对应的秒数
    let duration = TimeUtils.timeToSeconds(value);

    // 如果修改得到的秒数为0,就阻止修改
    if (duration === 0) return;

    // 判断动画时长是否超出最大时长
    if (duration >= this.state.maxAnimationTime) {
      // 设置最长动画时长为1个小时
      duration = this.state.maxAnimationTime;

      global.app.toast(_t('The maximum animation duration is 1 hour'), 'warn');
    }

    // 更新步长
    let scale = 3600 / duration;

    // 更新秒数与步长
    this.setState({
      duration,
      scale,
    });

    // 重新渲染时间轴
    this.renderTimeline(duration, scale);
  }

  /**
   * 结束时间弹框取消焦点触发
   */
  handleBlur() {
    this.setState({
      isEditorTime: false,
    });
  }

  /**
   * 点击结束时间,将结束时间替换为文本框
   */
  editorEndTime() {
    this.setState({
      isEditorTime: true,
    });
  }

  /**
   * 添加动画层
   * @param {function} onAddLayer 动画层回调
   * @param {object} event 事件对象
   */
  handleAddLayer(onAddLayer, event) {
    onAddLayer && onAddLayer(event);
  }

  /**
   * 修改动画层信息
   * @param {function} onEditLayer 修改动画层回调
   * @param {object} event 事件对象
   */
  handleEditLayer(onEditLayer, event) {
    const { selectedLayer } = this.props;

    onEditLayer && onEditLayer(selectedLayer, event);
  }

  /**
   * 删除动画层
   * @param {function} onDeleteLayer 删除动画层回调
   * @param {object} event 事件对象
   */
  handleDeleteLayer(onDeleteLayer, event) {
    const { selectedLayer } = this.props;

    onDeleteLayer && onDeleteLayer(selectedLayer, event);
  }

  commitDeleteLayer() {}

  /**
   * 选择动画层
   * @param {function} onSelectedLayerChange 选择动画层回调
   * @param {boolean} value 是否选中东湖层
   * @param {string} name 动画层uuid
   * @param {object} event 事件对象
   */
  handleSelectedLayerChange(onSelectedLayerChange, value, name, event) {
    console.log(value, name, 'handleSelectedLayerChange');
    onSelectedLayerChange && onSelectedLayerChange(value ? name : null, event);
  }

  /**
   * 快退函数
   */
  handleBackward() {
    if (this.state.time === 0) return;
    this.setState({
      time: this.state.time >= 0 ? this.state.time - 1 : 0,
    });

    // 更新时间轴滚动与分割线移动
    this.scrollTimeLine();
  }

  /**
   * 播放函数
   */
  handlePlay() {
    if (this.state.isPlay) {
      global.app.toast('动画正在播放,请勿重复操作', 'warn');
      return;
    }

    // 滚动条移动至起点
    this.rightRef.current.scrollTo({
      left: 0,
    });

    // 设置动画播放函数为正在播放
    this.setState({
      isPlay: true,
    });

    // 开启动画
    global.app.editor.actions &&
      global.app.editor.actions.forEach(item => {
        item.action.play();
      });

    // animate.Timeline在每次渲染器渲染时执行
    global.app.on(`animate.Timeline`, clock => {
      if (this.state.isPlay) {
        // 判断动画播放时长是否超出时间轴总时长
        if (!(this.state.time >= this.state.duration)) {
          // 累计时间,设置播放动画状态
          this.setState({
            time: this.state.time + clock.deltaTime,
          });

          if (global.app.editor.actions && global.app.editor.actions.length !== 0) {
            global.app.editor.actions.forEach(item => {
              // item.mixer.update(clock.deltaTime);
              item.action.time = this.state.time;
              // console.log(item.action.time, 'item.action.time');
              item.mixer.update(0);
            });
          }

          // 更新时间轴滚动与分割线移动
          this.scrollTimeLine();
        } else {
          // 调用播放结束回调
          this.playEndCallback();
        }
      }
    });
  }

  /**
   * 播放结束回调
   */
  playEndCallback() {
    // 到达最终时间
    // 滚动条移动至起点
    this.rightRef.current.scrollTo({
      left: 0,
    });

    // 到达最终时间
    // 累计时间,设置播放动画状态
    this.setState({
      time: 0,
      isPlay: false,
    });

    // 重置时间轴
    this.sliderRef.current.style.left = '100px';

    // 重置所有动画
    global.app.editor.actions &&
      global.app.editor.actions.forEach(item => {
        item.action.reset();
      });

    // 给animate.Timeline绑定一个空函数,覆盖之前绑定的函数
    global.app.on(`animate.Timeline`, () => {});
  }

  /**
   * 动画时间面板滚动节流函数
   */
  throttledScrollTo = throttle(left => {
    this.rightRef.current.scrollTo({
      behavior: 'smooth',
      left: left,
    });
  }, 200);

  /**
   * 暂停函数
   */
  handlePause() {
    console.log('暂停');
    this.setState({
      isPlay: false,
    });
  }

  /**
   * 快进函数
   */
  handleForward() {
    this.setState({
      time: this.state.time >= this.state.duration ? this.state.duration : this.state.time + 1,
    });

    // 当前播放的时间等于或者大于结束时间时,调用播放结束回调
    if (this.state.time >= this.state.duration) {
      this.playEndCallback();
    }

    // 更新时间轴滚动与分割线移动
    this.scrollTimeLine();
  }

  /**
   * 结束函数
   */
  handleStop() {
    this.setState({
      isPlay: false,
      time: 0,
    });

    // 重置时间轴
    this.sliderRef.current.style.left = '100px';

    // 重置所有动画
    global.app.editor.actions &&
      global.app.editor.actions.forEach(item => {
        item.action.reset();
      });

    // 因为有200毫秒的节流,所以这里应该延迟200毫秒之后再重置会起点
    setTimeout(() => {
      // 滚动条移动至起点
      this.rightRef.current.scrollTo({
        left: 0,
      });
    }, 200);
  }

  /**
   * 滚动条滚动或者时间轴分割线移动函数
   */
  scrollTimeLine() {
    if (this.state.time * this.state.scale >= 2278) {
      this.sliderRef.current.style.left = 100 + this.state.time * this.state.scale - 2280 + 'px';
    } else {
      this.throttledScrollTo(this.state.time * this.state.scale);
    }
  }

  /**
   * 点击动画层中的动画
   * @param {function} onClickAnimation 点击动画回调函数
   * @param {object} event 事件对象
   */
  handleClick(onClickAnimation, event) {
    const type = event.target.getAttribute('data-type');

    if (type !== 'animation') {
      return;
    }

    const pid = event.target.getAttribute('data-pid');
    const id = event.target.getAttribute('data-id');

    onClickAnimation && onClickAnimation(id, pid, event);
  }

  /**
   * 双击动画层
   * @param {function} onAddAnimation 双击动画层回调
   * @param {object} event 事件对象
   */
  handleDoubleClick(onAddAnimation, event) {
    const type = event.target.getAttribute('data-type');

    if (type !== 'layer') {
      return;
    }

    const layerID = event.target.getAttribute('data-id');

    const beginTime = event.nativeEvent.offsetX / this.state.scale;
    const endTime = beginTime + 2;

    onAddAnimation && onAddAnimation(layerID, beginTime, endTime, event);
  }

  /**
   * 时间轴滚动条滚动函数
   * @param {object} scroll 事件对象
   */
  handleRightScroll(scroll) {
    let left = this.leftRef.current;
    let canvas = this.canvasRef.current;

    left.scrollTop = event.target.scrollTop;
    canvas.style.left = `${100 - event.target.scrollLeft}px`;
  }

  /**
   * 拖拽动画起始函数
   * @param {object} event 事件对象
   */
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

  /**
   * 拖拽动画结束函数
   * @param {object} event 事件对象
   */
  handleDragEnd(event) {
    event.nativeEvent.dataTransfer.clearData();
  }

  /**
   * 监听拖拽函数,阻止默认行为
   * @param {object} event 事件对象
   */
  handleDragEnter(event) {
    event.preventDefault();
  }

  /**
   * 监听拖拽函数,阻止默认行为
   * @param {object} event 事件对象
   */
  handleDragOver(event) {
    event.preventDefault();
  }

  /**
   * 监听拖拽函数,阻止默认行为
   * @param {object} event 事件对象
   */
  handleDragLeave(event) {
    event.preventDefault();
  }

  /**
   * 拖拽处理函数
   * @param {function} onDropAnimation 处理函数回调
   * @param {object} event 事件对象
   */
  handleDrop(onDropAnimation, event) {
    const type = event.target.getAttribute('data-type');

    if (type !== 'layer') {
      return;
    }

    const id = event.nativeEvent.dataTransfer.getData('id');
    const oldLayerID = event.nativeEvent.dataTransfer.getData('pid');
    const offsetX = event.nativeEvent.dataTransfer.getData('offsetX');

    const newLayerID = event.target.getAttribute('data-id');

    const beginTime = (event.nativeEvent.offsetX - offsetX) / this.state.scale;

    onDropAnimation && onDropAnimation(id, oldLayerID, newLayerID, beginTime, event);
  }

  /**
   * 格式化秒数为分钟:秒数的格式
   * @param {number} time 时长
   * @returns 处理之后的事件
   */
  parseTime(time) {
    let minute = `0${parseInt(time / 60)}`;
    let second = `0${parseInt(time % 60)}`;
    return `${minute.substr(minute.length - 2, 2)}:${second.substr(second.length - 2, 2)}`;
  }

  /**
   * 格式化播放速度
   * @param {number} speed 速度
   * @returns 速度
   */
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
  onClickAnimation: PropTypes.func,
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
  onClickAnimation: null,
};

export default Timeline;
