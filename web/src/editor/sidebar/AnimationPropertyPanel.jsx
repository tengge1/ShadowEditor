/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/AnimationPropertyPanel.css';
import { PropertyGrid, Button } from '../../ui/index';
// import React, { Component } from 'react';
import BasicAnimationComponent from '../component/animation/BasicAnimationComponent.jsx';
import TweenAnimationComponent from '../component/animation/TweenAnimationComponent.jsx';

/**
 * 动画属性面板
 * @author tengge / https://github.com/tengge1
 */
class AnimationPropertyPanel extends React.Component {
  constructor(props) {
    super(props);
    // this.state.basicAnimationRef = React.createRef();
    // this.state = {
    //   show: false,
    //   basicAnimationRef: React.createRef(),
    // };
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevState.basicAnimationRef.current?.state?.show, 'componentDidUpdate');
  //   if (prevState.basicAnimationRef.current?.state?.show !== prevState.show) {
  //     console.log(prevState.basicAnimationRef.current?.state?.show, 'prevState.basicAnimationRef.current?.state?.show');
  //     this.setState({ show: prevState.basicAnimationRef.current?.state?.show });
  //   }
  // }

  render() {
    return (
      <PropertyGrid>
        <BasicAnimationComponent />
        <TweenAnimationComponent />
        {/* {this.state.show && <AnimationAddModel />} */}
      </PropertyGrid>
    );
  }
}

export default AnimationPropertyPanel;
