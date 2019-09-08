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
        const { title, className, style, children, show, disabled, onClick } = this.props;

        const subMenu = React.Children.count(children) ? <><div className={'suffix'}>
            <i className={'iconfont icon-right-triangle'}></i>
        </div>
            <div className={'sub'}>
                <ul className={'wrap'}>{children}</ul>
            </div></> : null;

        return <li
            className={classNames('MenuItem', disabled && 'disabled', !show && 'hidden', className)}
            style={style}
            onClick={this.handleClick}>
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
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

MenuItem.defaultProps = {
    title: null,
    className: null,
    style: null,
    children: null,
    show: true,
    disabled: false,
    onClick: null,
};

export default MenuItem;