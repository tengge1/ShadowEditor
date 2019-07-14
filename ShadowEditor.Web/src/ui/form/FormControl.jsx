import './css/FormControl.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表单项
 * @author tengge / https://github.com/tengge1
 */
class FormControl extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <div className={classNames('FormControl', className)} style={style} {...others}>
            {children}
        </div>;
    }
}

FormControl.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

FormControl.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default FormControl;