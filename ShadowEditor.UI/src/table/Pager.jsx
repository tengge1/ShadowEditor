import './css/Table.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 分页
 * @author tengge / https://github.com/tengge1
 */
class Pager extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <div
            className={classNames('Pager', className)}
            style={style}
            {...others}>
            {children}
        </div>;
    }
}

Pager.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

Pager.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default Pager;