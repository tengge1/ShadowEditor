import './css/PropertyGroup.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 属性组
 * @author tengge / https://github.com/tengge1
 */
class PropertyGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children, name, expanded } = this.props;

        return <div className={'PropertyGroup'}>
            <div className={'head'}>
                <div className={'icon'}>
                    <i className={expanded ? 'icon-expand' : 'icon-collapse'} />
                </div>
                <div className={'title'}>{name}</div>
            </div>
            <div className={classNames('property', !expanded && 'hide')}>
                {children}
            </div>
        </div>;
    }
}

PropertyGroup.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    name: PropTypes.string,
    expanded: PropTypes.bool
};

PropertyGroup.defaultProps = {
    className: null,
    style: null,
    children: null,
    name: 'Group',
    expanded: true,
};

export default PropertyGroup;