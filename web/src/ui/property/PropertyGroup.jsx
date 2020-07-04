/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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

        this.contentRef = React.createRef();

        this.handleExpand = this.handleExpand.bind(this, props.onExpand);
    }

    render() {
        const { style, children, title, show, expanded } = this.props;

        return <div className={classNames('PropertyGroup', !show && 'hidden')}
            style={style}
               >
            <div className={'head'}
                expanded={expanded ? 'true' : 'false'}
                onClick={this.handleExpand}
            >
                <div className={'icon'}>
                    <i className={expanded ? 'icon-expand' : 'icon-collapse'} />
                </div>
                <div className={'title'}>{title}</div>
            </div>
            <div className={classNames('content', !expanded && 'collapsed')}
                ref={this.contentRef}
            >
                {React.Children.map(children, (n, i) => {
                    if (n.props.show === false) {
                        return null;
                    }

                    let typeName = n.type.name;

                    if (typeName.indexOf('$') > -1) {
                        typeName = typeName.split('$')[0];
                    }

                    return <div className={classNames('property', typeName)}
                        key={i}
                           >
                        <div className={'label'}>{n.props.label}</div>
                        <div className={'field'}>{n}</div>
                    </div>;
                })}
            </div>
        </div>;
    }

    componentDidUpdate() {
        let content = this.contentRef.current;
        let height = 0;

        for (let i = 0; i < content.children.length; i++) {
            let child = content.children[i];
            height += child.offsetHeight; // offsetHeight包含下边框
        }

        content.style.height = `${height}px`;
    }

    handleExpand(onExpand, event) {
        const expanded = event.target.getAttribute('expanded') === 'true';
        onExpand && onExpand(!expanded, event);
    }
}

PropertyGroup.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    title: PropTypes.string,
    show: PropTypes.bool,
    expanded: PropTypes.bool,
    onExpand: PropTypes.func
};

PropertyGroup.defaultProps = {
    className: null,
    style: null,
    children: null,
    title: 'Group',
    show: true,
    expanded: true,
    onExpand: null
};

export default PropertyGroup;