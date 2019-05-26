import './css/Timeline.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 时间轴
 * @author tengge / https://github.com/tengge1
 */
class Timeline extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('Timeline', className)} style={style}></div>;
    }
}

Timeline.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Timeline;