import './css/BorderLayout.css';
import classNames from 'classnames/bind';

/**
 * 边框布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class BorderLayout extends React.Component {
    render() {
        const { className, style, children } = this.props;

        const north = children.filter(n => n.props.region === 'north')[0];
        const south = children.filter(n => n.props.region === 'south')[0];
        const west = children.filter(n => n.props.region === 'west')[0];
        const east = children.filter(n => n.props.region === 'east')[0];
        const center = children.filter(n => n.props.region === 'center')[0];

        const eastSplit = east.props.split;

        return <div className={classNames('BorderLayout', className)} style={style}>
            {north}
            <div className={'fit'}>
                <div className={'west'}>
                    {west}
                </div>
                <div className={'center'}>
                    {center}
                </div>
                <div className={'east'}>
                    <div className={'split'}></div>
                    {east}
                </div>
            </div>
            {south}
        </div>;
    }
}

export default BorderLayout;