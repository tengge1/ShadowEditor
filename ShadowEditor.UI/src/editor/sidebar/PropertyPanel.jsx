import './css/PropertyPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 属性面板
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class PropertyPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style } = this.props;

        return <div>PropertyPanel</div>;
    }
}

PropertyPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default PropertyPanel;