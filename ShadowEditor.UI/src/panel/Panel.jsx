import './css/Panel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 面板
 * @author tengge / https://github.com/tengge1
 * @property {String} title 标题
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {Boolean} show 是否显示
 * @property {Boolean} header 是否显示标题
 */
class Panel extends React.Component {
    render() {
        const { title, className, style, children, show, header } = this.props;

        return <div className={classNames('Panel', show ? null : 'hide', className)} style={style}>
            <div className={classNames('header', header ? null : 'hide')}>
                <span className="title">{title}</span>
                <div className="controls">
                    <div className="control">
                        <i className="iconfont icon-up-arrow"></i>
                    </div>
                </div>
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