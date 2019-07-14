import './css/Icon.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标
 * @author tengge / https://github.com/tengge1
 */
class Icon extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onClick);
    }

    render() {
        const { className, style, name, icon } = this.props;

        return <i className={classNames('Icon', 'iconfont',
            icon && 'icon-' + icon,
            className)}
            style={style}
            name={name}
            onClick={this.handleClick}></i>;
    }

    handleClick(onClick, event) {
        const name = event.target.getAttribute('name');
        onClick && onClick(name, event);
    }
}

Icon.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
};

Icon.defaultProps = {
    className: null,
    style: null,
    name: null,
    icon: null,
    onClick: null,
};

export default Icon;