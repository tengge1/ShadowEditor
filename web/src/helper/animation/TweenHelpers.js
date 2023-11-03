/*
 * @Author: wangzhiyu
 * @Date: 2023-10-12 11:05:27
 * @LastEditors: wangzhiyu
 * @LastEditTime: 2023-10-13 10:02:46
 */
import global from '../../global';

// 补间动画辅助器
class TweenHelpers {
  constructor() {
    this.keyframesKey = [
      {
        key: 'position',
        titleCase: 'Position',
      },
      {
        key: 'rotation',
        titleCase: 'Rotation',
      },
      {
        key: 'scale',
        titleCase: 'Scale',
      },
    ];
  }

  /**
   * 根据animations配置生成对应的动画并添加进模型中
   * @param {object} paramAnimation 指定的动画,如果为空,就会应用为当前选中的动画
   */
  addAnimation(paramAnimation) {
    let editor = global.app.editor;

    // 获取当前选中的动画配置
    const animation = paramAnimation || editor.selectAnimation;

    // 如果没有对应的动画配置,就弹出提示并阻止后续运行
    if (!animation) {
      global.app.call('animationMessage', this, _t('Please select the animation target'), 'warn');
      return;
    }

    // 使用getObjectByProperty方法在threejs场景中根据uuid属性查找到对应的模型
    let model = editor.scene.getObjectByProperty('uuid', animation.target);

    // 如果没有找到对应的模型就直接阻止后续运行并提示
    if (!model) {
      // 调用自定义事件animationMessage
      global.app.call('animationMessage', this, _t('Please select the animation target'), 'warn');
      return;
    }

    // 根据获取的模型生成动画混合器
    const mixer = new THREE.AnimationMixer(model);

    // 根据动画信息整合动画配置
    const animationConfig = {
      beginTime: animation.beginTime,
      endTime: animation.endTime,
      name: animation.name,

      beginPositionX: this.isCurrent(animation.data.beginStatus, model.position.x, animation.data.beginPositionX),
      beginPositionY: this.isCurrent(animation.data.beginStatus, model.position.y, animation.data.beginPositionY),
      beginPositionZ: this.isCurrent(animation.data.beginStatus, model.position.z, animation.data.beginPositionZ),

      endPositionX: this.isCurrent(animation.data.endStatus, model.position.x, animation.data.endPositionX),
      endPositionY: this.isCurrent(animation.data.endStatus, model.position.y, animation.data.endPositionY),
      endPositionZ: this.isCurrent(animation.data.endStatus, model.position.z, animation.data.endPositionZ),

      beginRotationX: this.isCurrent(animation.data.beginStatus, model.rotation.x, (animation.data.beginRotationX * 180) / Math.PI),
      beginRotationY: this.isCurrent(animation.data.beginStatus, model.rotation.y, (animation.data.beginRotationY * 180) / Math.PI),
      beginRotationZ: this.isCurrent(animation.data.beginStatus, model.rotation.z, (animation.data.beginRotationZ * 180) / Math.PI),

      endRotationX: this.isCurrent(animation.data.endStatus, model.rotation.x, (animation.data.endRotationX * 180) / Math.PI),
      endRotationY: this.isCurrent(animation.data.endStatus, model.rotation.y, (animation.data.endRotationY * 180) / Math.PI),
      endRotationZ: this.isCurrent(animation.data.endStatus, model.rotation.z, (animation.data.endRotationZ * 180) / Math.PI),

      beginScaleX: this.isCurrent(animation.data.beginStatus, model.scale.x, animation.data.beginScaleX),
      beginScaleY: this.isCurrent(animation.data.beginStatus, model.scale.y, animation.data.beginScaleY),
      beginScaleZ: this.isCurrent(animation.data.beginStatus, model.scale.z, animation.data.beginScaleZ),

      endScaleX: this.isCurrent(animation.data.endStatus, model.scale.x, animation.data.endScaleX),
      endScaleY: this.isCurrent(animation.data.endStatus, model.scale.y, animation.data.endScaleY),
      endScaleZ: this.isCurrent(animation.data.endStatus, model.scale.z, animation.data.endScaleZ),
    };

    // 关键帧数组
    const keyframesArr = [];

    // 循环生成关键帧动画
    for (let i = 0; i < this.keyframesKey.length; i++) {
      const item = this.keyframesKey[i];
      let keyframes;

      if (item.key === 'rotation') {
        let rotationX = new THREE.VectorKeyframeTrack(`.rotation[x]`, [animationConfig.beginTime, animationConfig.endTime], [animationConfig[`begin${item.titleCase}X`], animationConfig[`end${item.titleCase}X`]]);

        let rotationY = new THREE.VectorKeyframeTrack(`.rotation[y]`, [animationConfig.beginTime, animationConfig.endTime], [animationConfig[`begin${item.titleCase}Y`], animationConfig[`end${item.titleCase}Y`]]);

        let rotationZ = new THREE.VectorKeyframeTrack(`.rotation[z]`, [animationConfig.beginTime, animationConfig.endTime], [animationConfig[`begin${item.titleCase}Z`], animationConfig[`end${item.titleCase}Z`]]);

        keyframesArr.push(rotationX, rotationY, rotationZ);
      } else {
        keyframes = new THREE.VectorKeyframeTrack(`.${item.key}`, [animationConfig.beginTime, animationConfig.endTime], [animationConfig[`begin${item.titleCase}X`], animationConfig[`begin${item.titleCase}Y`], animationConfig[`begin${item.titleCase}Z`], animationConfig[`end${item.titleCase}X`], animationConfig[`end${item.titleCase}Y`], animationConfig[`end${item.titleCase}Z`]]);

        keyframesArr.push(keyframes);
      }
    }

    // 生成动画剪辑器
    const clip = new THREE.AnimationClip(animation.name, animationConfig.beginTime - animationConfig.endTime, keyframesArr);

    // 设置动画剪辑器的uuid
    clip.uuid = animation.uuid;

    // 通过动画混合器mixer的clipAction函数获取动画实例
    let action = mixer.clipAction(clip);

    // 设置动画循环次数为1次
    action.loop = THREE.LoopOnce;

    // 设置动画停留在结束状态
    action.clampWhenFinished = true;

    // 判断全局是否存在actions,如果不存在,就新建一个空数组,用于承载实例化之后的动画列表
    if (!editor.actions) {
      editor.actions = [];
    }

    // 判断是否已经存在对应的动画了,进行对应的提示与操作
    if (editor.actions.find(findItem => findItem.uuid === animation.uuid)) {
      // 这里表示该动画与已保存的动画有重复

      // 移除之前的动画
      this.handlerDeleteOk(animation, 'Replace');

      // 更新为当前的动画
      editor.actions.push({ mixer, action, uuid: animation.uuid });

      // 动画添加到模型中
      model.animations.push(clip);

      // 调用自定义事件animationMessage
      global.app.call('animationMessage', this, _t('Animation modification successful'), 'success');
    } else {
      editor.actions.push({ mixer, action, uuid: animation.uuid });

      // 动画添加到模型中
      model.animations.push(clip);

      // 调用自定义事件animationMessage
      global.app.call('animationMessage', this, _t('Animation added successfully'), 'success');
    }
  }

  /**
   * 判断状态是否为当前状态
   * @param {string} state 状态
   * @param {number} data1 为当前状态时的数值
   * @param {number} data2 不为当前状态时的数值
   * @returns 根据状态决定返回什么
   */
  isCurrent(state, data1, data2) {
    return state === 'Current' ? data1 : data2;
  }

  /**
   * 点击confirm框的确认删除
   * @param {object} animation 选中删除的动画配置
   * @param {string} type 判断执行的操作是删除还是替换
   */
  handlerDeleteOk(animation, type) {
    if (type === 'Delete') {
      // 移除全局动画中的动画
      global.app.editor.animations.forEach(item => {
        if (item.animations.length !== 0) {
          item.animations = item.animations.filter(animationItem => animationItem.uuid !== animation.uuid);
        }
        return item;
      });
    }

    // 判断是否存在全局剪辑器
    if (global.app.editor.actions && global.app.editor.actions.length !== 0) {
      // 移除全局剪辑器中的动画
      global.app.editor.actions = global.app.editor.actions.filter(item => item.uuid !== animation.uuid);
    }

    // 删除模型内的动画,使用getObjectByProperty方法在threejs场景中根据uuid属性查找到对应的模型
    let model = global.app.editor.scene.getObjectByProperty('uuid', animation.target);

    // 判断模型是否存在
    if (model) {
      model.animations = model.animations.filter(item => item.uuid !== animation.uuid);
    }

    if (type === 'Delete') {
      global.app.call('animationChanged', this, null);
    }
  }
}
export default TweenHelpers;
