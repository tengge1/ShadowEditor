import './css/Form.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表单
 * @author tengge / https://github.com/tengge1
 */
class Form extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this, props.onSubmit);
    }

    handleSubmit(onSubmit) {
        event.preventDefault();
        onSubmit && onSubmit();
    }

    render() {
        const { className, style, children, direction, ...others } = this.props;
        return <form className={classNames('Form', direction, className)} style={style} onSubmit={this.handleSubmit} {...others}>
            {children}
        </form>;
    }
}

Form.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
};

Form.defaultProps = {
    className: null,
    style: null,
    children: null,
    direction: 'horizontal',
};

export default Form;