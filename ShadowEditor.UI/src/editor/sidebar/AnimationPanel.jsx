import './css/AnimationPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 动画面板
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class AnimationPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style } = this.props;

        return <div>AnimationPanel</div>;
    }
}

AnimationPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default AnimationPanel;