/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TimelinePanel.css';

import { Timeline } from '../../ui/index';
import global from '../../global';

/**
 * 时间轴面板
 * @author tengge / https://github.com/tengge1
 */
class TimelinePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animations: [],
      selectedLayer: null,
      selected: null,
    };

    this.handleAddLayer = this.handleAddLayer.bind(this);
    this.commitAddLayer = this.commitAddLayer.bind(this);
    this.handleEditLayer = this.handleEditLayer.bind(this);
    this.commitEditLayer = this.commitEditLayer.bind(this);
    this.handleDeleteLayer = this.handleDeleteLayer.bind(this);
    this.commitDeleteLayer = this.commitDeleteLayer.bind(this);
    this.handleSelectedLayerChange = this.handleSelectedLayerChange.bind(this);

    this.handleAddAnimation = this.handleAddAnimation.bind(this);
    this.handleDropAnimation = this.handleDropAnimation.bind(this);
    this.handleClickAnimation = this.handleClickAnimation.bind(this);

    this.updateUI = this.updateUI.bind(this);
  }

  render() {
    const { animations, selectedLayer, selected } = this.state;

    return <Timeline className={'TimelinePanel'} animations={animations} selectedLayer={selectedLayer} selected={selected} onAddLayer={this.handleAddLayer} onEditLayer={this.handleEditLayer} onDeleteLayer={this.handleDeleteLayer} onSelectedLayerChange={this.handleSelectedLayerChange} onAddAnimation={this.handleAddAnimation} onDropAnimation={this.handleDropAnimation} onClickAnimation={this.handleClickAnimation} />;
  }

  // 这里会在组件dom挂载完成后立即执行
  componentDidMount() {
    global.app.on(`appStarted.TimelinePanel`, this.updateUI);
    global.app.on(`animationChanged.TimelinePanel`, this.updateUI);
  }

  // 更新本组件内的animations状态
  updateUI() {
    this.setState({
      animations: global.app.editor.animations,
    });
  }

  // ----------------------- 动画层管理 ------------------------------

  /**
   * 添加动画层
   */
  handleAddLayer() {
    global.app.prompt({
      title: _t('Input Layer Name'),
      content: _t('Layer Name'),
      value: _t('New Layer'),
      onOK: this.commitAddLayer,
    });
  }

  /**
   * 确认添加动画触发
   * @param {string} layerName 添加的动画层名称
   */
  commitAddLayer(layerName) {
    let animations = global.app.editor.animations;
    const layer =
      Math.max.apply(
        Math,
        animations.map(n => n.layer)
      ) + 1;

    animations.push({
      id: null,
      layer,
      layerName: layerName,
      uuid: THREE.Math.generateUUID(),
      animations: [],
    });
    console.log(animations, 'commitAddLayer');

    global.app.call(`animationChanged`, this);
  }

  /**
   * 修改动画层名称触发
   * @param {string} id 要修改的动画层id
   */
  handleEditLayer(id) {
    if (!id) {
      global.app.toast(_t('Please select an animation layer.'));
      return;
    }

    const animations = global.app.editor.animations;

    const layer = animations.filter(n => n.uuid === id)[0];

    global.app.prompt({
      title: _t('Edit Layer Name'),
      content: _t('Layer Name'),
      value: layer.layerName,
      onOK: this.commitEditLayer,
    });
  }

  /**
   * 点击修改动画层名称的确认弹框
   * @param {string} layerName 修改的最新的动画层名称
   */
  commitEditLayer(layerName) {
    let animations = global.app.editor.animations;

    const index = animations.findIndex(n => n.uuid === this.state.selectedLayer);

    if (index > -1) {
      animations[index].layerName = layerName;

      global.app.call(`animationChanged`, this);
    }
  }

  /**
   * 删除动画层
   * @param {string} id 动画层id
   */
  handleDeleteLayer(id) {
    if (!id) {
      global.app.toast(_t('Please select an animation layer.'));
      return;
    }

    const animations = global.app.editor.animations;

    const layer = animations.filter(n => n.uuid === id)[0];

    global.app.confirm({
      title: _t('Delete'),
      content: _t(`Delete animation layer {{layerName}}?`, { layerName: layer.layerName }),
      onOK: this.commitDeleteLayer,
    });
  }

  /**
   * 点击确认删除弹框的确认按钮
   */
  commitDeleteLayer() {
    let animations = global.app.editor.animations;

    const index = animations.findIndex(n => n.uuid === this.state.selectedLayer);

    if (index > -1) {
      animations.splice(index, 1);

      global.app.call(`animationChanged`, this);
    }
  }

  /**
   * 修改选中动画层时触发
   * @param {string} value 选中的动画层的id
   */
  handleSelectedLayerChange(value) {
    this.setState({
      selectedLayer: value,
    });
  }

  // ---------------------------- 动画管理 ---------------------------------

  /**
   * 新建动画
   * @param {string} layerID 动画层id
   * @param {number} beginTime 动画开始的秒数
   * @param {number} endTime 动画结束的秒速
   */
  handleAddAnimation(layerID, beginTime, endTime) {
    let layer = global.app.editor.animations.filter(n => n.uuid === layerID)[0];

    if (!layer) {
      console.warn(`TimelinePanel: layer ${layerID} is not defined.`);
      return;
    }

    layer.animations.push({
      id: null,
      uuid: THREE.Math.generateUUID(),
      name: _t('Animation'),
      target: null,
      type: 'Tween',
      beginTime,
      endTime,
      data: {
        beginStatus: 'Current', // 开始状态：Current-当前位置、Custom-自定义位置
        beginPositionX: 0,
        beginPositionY: 0,
        beginPositionZ: 0,
        beginRotationX: 0,
        beginRotationY: 0,
        beginRotationZ: 0,
        beginScaleLock: true,
        beginScaleX: 1.0,
        beginScaleY: 1.0,
        beginScaleZ: 1.0,
        ease: 'linear', // linear, quadIn, quadOut, quadInOut, cubicIn, cubicOut, cubicInOut, quartIn, quartOut, quartInOut, quintIn, quintOut, quintInOut, sineIn, sineOut, sineInOut, backIn, backOut, backInOut, circIn, circOut, circInOut, bounceIn, bounceOut, bounceInOut, elasticIn, elasticOut, elasticInOut
        endStatus: 'Current',
        endPositionX: 0,
        endPositionY: 0,
        endPositionZ: 0,
        endRotationX: 0,
        endRotationY: 0,
        endRotationZ: 0,
        endScaleLock: true,
        endScaleX: 1.0,
        endScaleY: 1.0,
        endScaleZ: 1.0,
      },
    });

    global.app.call(`animationChanged`, this);
  }

  /**
   * 移动动画块触发
   * @param {string} id 拖动的动画块的id
   * @param {string} oldLayerID 拖动之前的动画层id
   * @param {string} newLayerID 拖动之后的动画层id
   * @param {number} beginTime 拖动之后的起始时间
   */
  handleDropAnimation(id, oldLayerID, newLayerID, beginTime) {
    let oldLayer = global.app.editor.animations.filter(n => n.uuid === oldLayerID)[0];

    if (!oldLayer) {
      console.warn(`TimelinePanel: layer ${oldLayerID} is not defined.`);
      return;
    }

    let newLayer = global.app.editor.animations.filter(n => n.uuid === newLayerID)[0];

    if (!newLayer) {
      console.warn(`TimelinePanel: layer ${newLayerID} is not defined.`);
      return;
    }

    let index = oldLayer.animations.findIndex(n => n.uuid === id);

    if (index === -1) {
      console.warn(`TimelinePanel: animation ${id} is not defined.`);
      return;
    }

    let animation = oldLayer.animations[index];

    let duration = animation.endTime - animation.beginTime;

    animation.beginTime = beginTime;
    animation.endTime = beginTime + duration;

    oldLayer.animations.splice(index, 1);
    newLayer.animations.push(animation);

    global.app.call(`animationChanged`, this);
  }

  /**
   * 点击动画,加载动画对应的配置与状态
   * @param {string} id 点击的动画id
   * @param {string} pid 点击的动画所在的层级的id
   */
  handleClickAnimation(id, pid) {
    const layer = global.app.editor.animations.filter(n => n.uuid === pid)[0];

    if (!layer) {
      console.warn(`TimelinePanel: layer ${pid} is not defined.`);
      return;
    }

    const animation = layer.animations.filter(n => n.uuid === id)[0];

    if (!animation) {
      console.warn(`TimelinePanel: animation ${id} is not defined.`);
      return;
    }

    global.app.call('animationSelected', this, animation);

    this.setState({
      selected: animation.uuid,
    });
  }
}

export default TimelinePanel;
