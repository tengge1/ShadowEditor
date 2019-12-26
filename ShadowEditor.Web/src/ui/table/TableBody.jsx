import './css/TableBody.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表格内容
 * @author tengge / https://github.com/tengge1
 */
class TableBody extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <tbody
            className={classNames('TableBody', className)}
            style={style}
            {...others}
               >
            {children}
        </tbody>;
    }
}

TableBody.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

TableBody.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default TableBody;