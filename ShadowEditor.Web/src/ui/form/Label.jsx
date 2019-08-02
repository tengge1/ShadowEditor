import './css/Label.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 标签
 * @author tengge / https://github.com/tengge1
 */
class Label extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children } = this.props;

        return <label className={classNames('Label', className)} style={style}>
            {children}
        </label>;
    }
}

Label.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

Label.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default Label;