import './css/StatusBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Toolbar from '../toolbar/Toolbar.jsx';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class StatusBar extends React.Component {
    render() {
        const { className, style } = this.props;

        return <Toolbar className={classNames('EditorStatusBar', className)} style={style}>
        </Toolbar>;
    }
}

StatusBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default StatusBar;