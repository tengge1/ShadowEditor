import './css/PropertyPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import PropertyGrid from '../../property/PropertyGrid.jsx';

/**
 * 属性面板
 * @author tengge / https://github.com/tengge1
 */
class PropertyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [{
            name: 'General',
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
            name: 'Transform',
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
        return <PropertyGrid data={this.data} />;
    }
}

export default PropertyPanel;