import './css/Window.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 窗口
 */
class Window extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, title, children } = this.props;

        return <div className="Window">
            <div className="wrap">
                <div className="title">
                    <span>{title || 'Message'}</span>
                    <div className="controls">
                        <i className="iconfont icon-close icon"></i>
                    </div>
                </div>
                <div className="content">{children}</div>
                <div className="buttons">
                    <div className="button-wrap">
                        <button className="button">OK</button>
                    </div>
                </div>
            </div>
            <div className="resize"></div>
        </div>;
    }
}

Window.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
};

Window.defaultProps = {
    className: null,
    style: null,
    title: 'Message',
    children: null,
};

export default Window;