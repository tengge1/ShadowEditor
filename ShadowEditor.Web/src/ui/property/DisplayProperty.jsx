import './css/DisplayProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 展示属性
 * @author tengge / https://github.com/tengge1
 */
class DisplayProperty extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, name, value } = this.props;

        return <div className={classNames('DisplayProperty', className)} style={style}>{value}</div>;
    }
}

DisplayProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
};

DisplayProperty.defaultProps = {
    className: null,
    style: null,
    name: 'name',
    value: '',
};

export default DisplayProperty;