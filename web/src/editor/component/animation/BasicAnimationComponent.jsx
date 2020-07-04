/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, TextProperty, DisplayProperty, NumberProperty, SelectProperty } from '../../../ui/index';

/**
 * 动画基本信息组件
 * @author tengge / https://github.com/tengge1
 */
class BasicAnimationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.animationType = {
            Tween: _t('Tween Animation'),
            Skeletal: _t('Skeletal Animation'),
            Audio: _t('Play Audio'),
            Filter: _t('Filter Animation'),
            Particle: _t('Particle Animation')
        };

        this.state = {
            show: false,
            expanded: true,
            name: '',
            target: null,
            type: null,
            beginTime: 0,
            endTime: 10
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSetTarget = this.handleSetTarget.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, name, target, type, beginTime, endTime } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Basic Information')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <TextProperty label={_t('Name')}
                name={'name'}
                value={name}
                onChange={this.handleChange}
            />
            <DisplayProperty
                label={_t('Target')}
                name={'target'}
                value={target ? target : `(${_t('None')})`}
                btnText={_t('Set Target')}
                btnShow={app.editor.selected !== null}
                onClick={this.handleSetTarget}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Type')}
                options={this.animationType}
                name={'type'}
                value={type}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('BeginTime')}
                name={'beginTime'}
                value={beginTime}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('EndTime')}
                name={'endTime'}
                value={endTime}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`animationSelected.BasicAnimationComponent`, this.handleUpdate.bind(this));
        app.on(`animationChanged.BasicAnimationComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate(animation) {
        if (!animation) {
            this.setState({
                show: false
            });
            return;
        }

        this.animation = animation;

        let state = {
            show: true,
            name: this.animation.name,
            type: this.animation.type,
            beginTime: this.animation.beginTime,
            endTime: this.animation.endTime
        };

        if (!this.animation.target) {
            state.target = null;
        } else {
            let obj = app.editor.objectByUuid(this.animation.target);
            if (obj === null) {
                state.target = null;
                console.warn(`BasicAnimationComponent: ${_t('Animation Object')} ${this.animation.target} ${_t('is not existed in the scene.')}`);
            } else {
                state.target = obj.name;
            }
        }

        this.setState(state);
    }

    handleSetTarget() {
        let selected = app.editor.selected;

        if (selected === null) {
            this.animation.target = null;
        } else {
            this.animation.target = selected.uuid;
        }

        app.call('animationChanged', this, this.animation);
    }

    handleChange(value, animName) {
        if (value === null) {
            this.setState({
                [animName]: value
            });
            return;
        }

        const { name, type, beginTime, endTime } = Object.assign({}, this.state, {
            [animName]: value
        });

        this.animation.name = name;
        this.animation.type = type;
        this.animation.beginTime = beginTime;
        this.animation.endTime = endTime;

        app.call('animationChanged', this, this.animation);
    }
}

export default BasicAnimationComponent;