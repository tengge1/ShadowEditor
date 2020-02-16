import './css/MenuItem.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单项
 * @author tengge / https://github.com/tengge1
 */
class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this, props.onClick);
    }

    render() {
        const { title, className, style, children, show, checked, selected, disabled } = this.props;

        const subMenu = React.Children.count(children) ? <><div className={'suffix'}>
            <i className={'iconfont icon-right-triangle'} />
        </div>
            <div className={'sub'}>
                <ul className={'wrap'}>{children}</ul>
            </div></> : null;

        return <li
            className={classNames('MenuItem', checked !== undefined && 'checked', selected !== undefined && 'selected', disabled && 'disabled', !show && 'hidden', className)}
            style={style}
            onClick={this.handleClick}
               >
            {(checked !== undefined || selected !== undefined) && <div className={classNames('prefix', (checked || selected) && 'on')} />}
            <span>{title}</span>
            {subMenu}
        </li>;
    }

    handleClick(onClick, event) {
        event.stopPropagation();

        if (!event.target.classList.contains('disabled')) {
            onClick && onClick(event);
        }
    }
}

MenuItem.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    show: PropTypes.bool,
    checked: PropTypes.bool,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

MenuItem.defaultProps = {
    title: null,
    className: null,
    style: null,
    children: null,
    show: true,
    checked: undefined,
    selected: undefined,
    disabled: false,
    onClick: null
};

export default MenuItem;