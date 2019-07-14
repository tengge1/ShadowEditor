import './css/TextProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 文本属性
 * @author tengge / https://github.com/tengge1
 */
class TextProperty extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    handleCollapse() {

    }

    render() {
        const { className, style, data } = this.props;

        return <div className={classNames('TextProperty', className)} style={style}>
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

TextProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
};

TextProperty.defaultProps = {
    className: null,
    style: null,
    data: [],
};

export default TextProperty;