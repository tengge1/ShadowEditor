import './css/Alert.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 提示框
 */
class Alert extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, title, children } = this.props;

        return <div className="Alert">
            <div className="wrap">
                <div className="title">
                    <span>{title || 'Message'}</span>
                    <div className="controls">
                        <i className="iconfont icon-close icon"></i>
                    </div>
                </div>
                <div className="content"><p>{children}</p></div>
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

Alert.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
};

Alert.defaultProps = {
    className: null,
    style: null,
    title: 'Message',
    children: null,
};

export default Alert;