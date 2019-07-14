import './css/Label.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 标签
 * @author tengge / https://github.com/tengge1
 */
class Label extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <label className={classNames('Label', className)} style={style} {...others}>
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