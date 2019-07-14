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
        const { className, style, name, label, value } = this.props;

        return <div className={'item'}>
            <div className={'label'}>{label}</div>
            <div className={'value'}>{value}</div>
        </div>;
    }
}

TextProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
};

TextProperty.defaultProps = {
    className: null,
    style: null,
    name: 'name',
    label: 'text',
    value: '',
};

export default TextProperty;