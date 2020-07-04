/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TabLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 选项卡布局
 * @author tengge / https://github.com/tengge1
 */
class TabLayout extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onActiveTabChange);
    }

    render() {
        const { className, style, children, activeTabIndex } = this.props;

        return <div className={classNames('TabLayout', className)}
            style={style}
               >
            <div className={'tabs'}>
                {React.Children.map(children, (n, i) => {
                    return <div
                        className={classNames('tab', i === activeTabIndex ? 'selected' : null)}
                        key={i}
                        tbindex={i}
                        onClick={this.handleClick}
                           >{n.props.title}</div>;
                })}
            </div>
            <div className={'contents'}>
                {React.Children.map(children, (n, i) => {
                    return <div className={classNames('content', i === activeTabIndex ? 'show' : null)}
                        key={i}
                           >{n}</div>;
                })}
            </div>
        </div>;
    }

    handleClick(onActiveTabChange, event) {
        const index = event.target.getAttribute('tbindex');

        onActiveTabChange && onActiveTabChange(parseInt(index), event.target, event);
    }
}

TabLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    activeTabIndex: PropTypes.number,
    onActiveTabChange: PropTypes.func
};

TabLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
    activeTabIndex: 0,
    onActiveTabChange: null
};

export default TabLayout;