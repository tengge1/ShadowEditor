import './css/HistoryPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class HistoryPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style } = this.props;

        return <div>History</div>;
    }
}

HistoryPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default HistoryPanel;