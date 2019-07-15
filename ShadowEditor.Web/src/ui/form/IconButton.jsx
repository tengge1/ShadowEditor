import './css/IconButton.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标按钮
 * @author tengge / https://github.com/tengge1
 */
class IconButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onClick);
    }

    render() {
        const { className, style, icon, name, title, selected } = this.props;
        return <button
            className={classNames('IconButton', selected && 'selected', className)}
            style={style}
            title={title}
            onClick={this.handleClick}>
            <i className={classNames('iconfont', icon && 'icon-' + icon)}></i>
        </button>;
    }

    handleClick(onClick, event) {
        onClick && onClick(this.props.name, event);
    };
}

IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

IconButton.defaultProps = {
    className: null,
    style: null,
    icon: null,
    name: null,
    title: null,
    selected: false,
    onClick: null,
};

export default IconButton;