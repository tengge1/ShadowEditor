import './css/BorderLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 边框布局
 * @author tengge / https://github.com/tengge1
 */
class BorderLayout extends React.Component {
    constructor(props) {
        super(props);

        const children = this.props.children;
        const north = children && children.filter(n => n.props.region === 'north')[0];
        const south = children && children.filter(n => n.props.region === 'south')[0];
        const west = children && children.filter(n => n.props.region === 'west')[0];
        const east = children && children.filter(n => n.props.region === 'east')[0];
        const center = children && children.filter(n => n.props.region === 'center')[0];

        const northSplit = north && north.props.split || false;
        const southSplit = south && south.props.split || false;
        const westSplit = west && west.props.split || false;
        const eastSplit = east && east.props.split || false;

        const northCollapsed = north && north.props.collapsed || false;
        const southCollapsed = south && south.props.collapsed || false;
        const westCollapsed = west && west.props.collapsed || false;
        const eastCollapsed = east && east.props.collapsed || false;

        this.state = {
            northSplit, southSplit, westSplit, eastSplit,
            northCollapsed, southCollapsed, westCollapsed, eastCollapsed,
        };
    }

    render() {
        const { className, style, children, ...others } = this.props;

        const north = children && children.filter(n => n.props.region === 'north')[0];
        const south = children && children.filter(n => n.props.region === 'south')[0];
        const west = children && children.filter(n => n.props.region === 'west')[0];
        const east = children && children.filter(n => n.props.region === 'east')[0];
        const center = children && children.filter(n => n.props.region === 'center')[0];

        return <div className={classNames('BorderLayout', className)} style={style}>
            <div className={'north'}>
                {north}
            </div>
            <div className={'middle'}>
                <div className={'west'}>
                    {west}
                    <div className={classNames('split', 'expand')}>
                        <div className={'button'}></div>
                    </div>
                </div>
                <div className={'center'}>
                    {center}
                </div>
                <div className={'east'}>
                    <div className={classNames('split', 'expand')}>
                        <div className={'button'}></div>
                    </div>
                    {east}
                </div>
            </div>
            <div className={'south'}>
                {south}
            </div>
        </div>;
    }
}

BorderLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

BorderLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default BorderLayout;