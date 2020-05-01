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