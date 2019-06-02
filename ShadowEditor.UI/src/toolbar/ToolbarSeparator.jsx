import './css/ToolbarSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏分割线
 * @author tengge / https://github.com/tengge1
 */
class ToolbarSeparator extends React.Component {
    render() {
        const { className, style, direction } = this.props;

        return <div className={classNames('ToolbarSeparator', direction, className)} style={style}>
            <div className='separator'></div>
        </div>;
    }
}

ToolbarSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    direction: PropTypes.string,
};

ToolbarSeparator.defaultProps = {
    className: null,
    style: null,
    direction: 'horizontal',
};

export default ToolbarSeparator;