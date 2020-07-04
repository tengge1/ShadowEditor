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
import { PropertyGrid } from '../../ui/index';

import BasicAnimationComponent from '../component/animation/BasicAnimationComponent.jsx';
import TweenAnimationComponent from '../component/animation/TweenAnimationComponent.jsx';

/**
 * 动画属性面板
 * @author tengge / https://github.com/tengge1
 */
class AnimationPropertyPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <PropertyGrid>
            <BasicAnimationComponent />
            <TweenAnimationComponent />
        </PropertyGrid>;
    }
}

export default AnimationPropertyPanel;