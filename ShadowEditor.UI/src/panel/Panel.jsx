import './css/Panel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 面板
 * @author tengge / https://github.com/tengge1
 */
class Panel extends React.Component {
    render() {
        const { title, className, style, children, show, header } = this.props;

        const split = false;

        return <div className={classNames('Panel', show ? null : 'hide', className)} style={style}>
            <div className={classNames('header', header ? null : 'hide')}>
                <span className="title">{title}</span>
                {split && <div className="controls">
                    <div className="control">
                        <i className="iconfont icon-up-arrow"></i>
                    </div>
                </div>}
            </div>
            <div className="body">
                {children}
            </div>
        </div>;
    }
}

Panel.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    show: PropTypes.bool,
    header: PropTypes.bool,
};

Panel.defaultProps = {
    show: true,
    header: true,
};

export default Panel;