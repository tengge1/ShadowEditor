import './css/ToolbarSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏分隔符
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class ToolbarSeparator extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('ToolbarSeparator', className)} style={style}>
            <div className='separator'></div>
        </div>;
    }
}

ToolbarSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ToolbarSeparator;