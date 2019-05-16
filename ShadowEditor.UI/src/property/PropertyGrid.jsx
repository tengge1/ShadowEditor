import './css/PropertyGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 属性表格
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {Object} data 数据
 */
class PropertyGrid extends React.Component {
    render() {
        const { className, style, data } = this.props;

        return <div className={classNames('PropertyGrid', className)} style={style}>
            {data.map((group, i) => {
                return <div className={'group'} key={i}>
                    <div className={'head'}>
                        <div className={'icon'}>
                            <i className={group.expand !== false ? 'icon-expand' : 'icon-collapse'} />
                        </div>
                        <div className={'title'}>{group.name}</div>
                    </div>
                    <div className={classNames('property', group.expand === false ? 'hide' : null)}>
                        {group.children.map((item, j) => {
                            return <div className={'item'} key={item.name || j}>
                                <div className={'label'}>{item.label}</div>
                                <div className={'value'}>{item.value}</div>
                            </div>;
                        })}
                    </div>
                </div>;
            })}
        </div>;
    }
}

PropertyGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

PropertyGrid.defaultProps = {
    data: [],
};

export default PropertyGrid;