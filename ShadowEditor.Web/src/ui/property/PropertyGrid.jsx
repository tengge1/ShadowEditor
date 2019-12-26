import './css/PropertyGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 属性表
 * @author tengge / https://github.com/tengge1
 */
class PropertyGrid extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('PropertyGrid', className)}
            style={style}
               >
            {children}
        </div>;
    }
}

PropertyGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

PropertyGrid.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default PropertyGrid;