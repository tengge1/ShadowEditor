import './css/ToolbarFiller.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏填充
 * @author tengge / https://github.com/tengge1
 */
class ToolbarFiller extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('ToolbarFiller', className)} style={style}></div>;
    }
}

ToolbarFiller.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

ToolbarFiller.defaultProps = {
    className: null,
    style: null,
};

export default ToolbarFiller;