import './css/TextProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 文本属性
 * @author tengge / https://github.com/tengge1
 */
class TextProperty extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, name, value } = this.props;

        return <div className={classNames('TextProperty', className)} style={style}>{value}</div>;
    }
}

TextProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
};

TextProperty.defaultProps = {
    className: null,
    style: null,
    name: 'name',
    value: '',
};

export default TextProperty;