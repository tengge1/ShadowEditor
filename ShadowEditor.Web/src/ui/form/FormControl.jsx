import './css/FormControl.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表单项
 * @author tengge / https://github.com/tengge1
 */
class FormControl extends React.Component {
    render() {
        const { className, style, children, hidden } = this.props;

        return <div className={classNames('FormControl', className, hidden && 'hidden')}
            style={style}
               >
            {children}
        </div>;
    }
}

FormControl.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    hidden: PropTypes.bool
};

FormControl.defaultProps = {
    className: null,
    style: null,
    children: null,
    hidden: false
};

export default FormControl;