import './css/PropertyPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import PropertyGrid from '../../property/PropertyGrid.jsx';

/**
 * 属性面板
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class PropertyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [{
            groupName: 'General',
            expand: true,
            children: [{
                type: 'text',
                name: 'name',
                label: 'Name',
                value: 'Box',
            }, {
                type: 'label',
                name: 'type',
                label: 'Type',
                value: 'Box',
            }, {
                type: 'checkbox',
                name: 'visible',
                label: 'Visible',
                value: true,
            }]
        }, {
            groupName: 'Transform',
            expand: false,
            children: [{
                type: 'number',
                name: 'translateX',
                label: 'TranslateX',
                value: 0,
            }, {
                type: 'number',
                name: 'translateY',
                label: 'TranslateY',
                value: 0,
            }, {
                type: 'number',
                name: 'translateZ',
                label: 'TranslateZ',
                value: 0,
            }, {
                type: 'number',
                name: 'rotateX',
                label: 'RotateX',
                value: 0,
            }, {
                type: 'number',
                name: 'rotateY',
                label: 'RotateY',
                value: 0,
            }, {
                type: 'number',
                name: 'rotateZ',
                label: 'RotateZ',
                value: 0,
            }]
        }];
    }

    render() {
        const { className, style } = this.props;

        return <PropertyGrid data={this.data} />;
    }
}

PropertyPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default PropertyPanel;