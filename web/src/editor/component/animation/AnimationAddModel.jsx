/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { Button } from '../../../ui/index';
import global from '../../../global';
import TweenHelpers from '../../../helper/animation/TweenHelpers';

class AnimationAddModel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 按钮样式
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
      },

      // 添加/修改动画
      type: 'add',
    };

    // 实例化补间动画辅助器
    this.tweenHelpers = new TweenHelpers();

    this.handleOK = this.handleOK.bind(this);
    this.removeAnimation = this.removeAnimation.bind(this);
  }

  render() {
    const { style, type } = this.state;
    return (
      <div style={style}>
        {/* {type === 'add' ? '添加' : '修改'} */}
        <Button onClick={this.handleOK}>{_t('Configure Animation')}</Button>
        <Button onClick={this.removeAnimation}>{_t('Delete') + _t('Animation')}</Button>
      </div>
    );
  }

  componentDidMount() {
    // 监听动画消息
    global.app.on('animationMessage.AnimationAddModel', (message, type) => {
      global.app.toast(message, type);
    });
  }

  /**
   * 根据配置处理动画
   */
  handleOK() {
    // 根据系统配置添加动画
    this.tweenHelpers.addAnimation();
  }

  /**
   * 要删除的动画
   */
  removeAnimation() {
    // 获取当前选中的动画配置
    const animation = global.app.editor.selectAnimation;

    global.app.confirm({
      title: _t('Confirm'),
      content: _t('Are you sure you want to delete this animation?'),
      onOK: () => this.tweenHelpers.handlerDeleteOk(animation, 'Delete'),
    });
  }
}

export default AnimationAddModel;
