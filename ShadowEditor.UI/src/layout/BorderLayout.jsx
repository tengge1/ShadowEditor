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
        const north = children.filter(n => n.props.region === 'north')[0];
        const south = children.filter(n => n.props.region === 'south')[0];
        const west = children.filter(n => n.props.region === 'west')[0];
        const east = children.filter(n => n.props.region === 'east')[0];
        const center = children.filter(n => n.props.region === 'center')[0];

        // const northSplit = north.props.split? true : false;
        // const southSplit = south.props.split? true : false;
        // const westSplit = west.props.split? false;
        // const eastSplit = east.props.split || false;

        // this.state = {
        //     northSplit: north.props.split || false,
        //     southSplit: south.props.split || false,
        //     westSplit: west.props.split || false,
        //     eastSplit: east.props.split || false,
        // };
    }

    render() {
        const { className, style, children, ...others } = this.props;

        const north = children.filter(n => n.props.region === 'north')[0];
        const south = children.filter(n => n.props.region === 'south')[0];
        const west = children.filter(n => n.props.region === 'west')[0];
        const east = children.filter(n => n.props.region === 'east')[0];
        const center = children.filter(n => n.props.region === 'center')[0];

        const eastSplit = east.props.split;

        return <div className={classNames('BorderLayout', className)} style={style}>
            <div className={'north'}>
                {north}
            </div>
            <div className={'fit'}>
                <div className={'west'}>
                    {west}
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
            {south}
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