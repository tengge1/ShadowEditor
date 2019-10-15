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

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { className, style, icon, name, title, show, selected } = this.props;
        return <button
            className={classNames('IconButton', selected && 'selected', !show && 'hidden', className)}
            style={style}
            title={title}
            onClick={this.handleClick}>
            <i className={classNames('iconfont', icon && 'icon-' + icon)}></i>
        </button>;
    }

    handleClick(event) {
        const { name, onClick } = this.props;
        onClick && onClick(name, event);
    };
}

IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    show: PropTypes.bool,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

IconButton.defaultProps = {
    className: null,
    style: null,
    icon: null,
    name: null,
    title: null,
    show: true,
    selected: false,
    onClick: null,
};

export default IconButton;