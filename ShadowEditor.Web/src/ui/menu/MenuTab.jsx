import './css/MenuTab.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单选项卡
 * @author tengge / https://github.com/tengge1
 */
class MenuTab extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onClick);
    }

    render() {
        const { className, style, children, selected, show, disabled, onClick } = this.props;

        return <li
            className={classNames('MenuTab', selected && 'selected', disabled && 'disabled', !show && 'hidden', className)}
            style={style}
            onClick={this.handleClick}>{children}</li>;
    }

    handleClick(onClick, event) {
        event.stopPropagation();

        if (!event.target.classList.contains('disabled')) {
            onClick && onClick(event);
        }
    }
}

MenuTab.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    selected: PropTypes.bool,
    show: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

MenuTab.defaultProps = {
    className: null,
    style: null,
    children: null,
    selected: false,
    show: true,
    disabled: false,
    onClick: null,
};

export default MenuTab;