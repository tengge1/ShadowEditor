/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/AssetsPanel.css';

import { AccordionLayout, Accordion } from '../../ui/index';

import ScenePanel from './ScenePanel.jsx';
import ModelPanel from './ModelPanel.jsx';
import MapPanel from './MapPanel.jsx';
import MaterialPanel from './MaterialPanel.jsx';
import AudioPanel from './AudioPanel.jsx';
import AnimationPanel from './AnimationPanel.jsx';
import ParticlePanel from './ParticlePanel.jsx';
import PrefabPanel from './PrefabPanel.jsx';
// import CharacterPanel from './CharacterPanel.jsx';
import ScreenshotPanel from './ScreenshotPanel.jsx';
import VideoPanel from './VideoPanel.jsx';
import LogPanel from './LogPanel.jsx';

/**
 * 资源面板
 * @author tengge / https://github.com/tengge1
 */
class AssetsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            sceneCount: 0,
            meshCount: 0,
            mapCount: 0,
            materialCount: 0,
            audioCount: 0,
            animationCount: 0,
            particleCount: 0,
            prefabCount: 0,
            characterCount: 0,
            screenshotCount: 0,
            videoCount: 0
        };

        this.handleActive = this.handleActive.bind(this);
    }

    render() {
        const { activeIndex, sceneCount, meshCount, mapCount, materialCount, audioCount, animationCount, particleCount, prefabCount, screenshotCount, videoCount } = this.state;

        const { enableAuthority, isLogin, authorities } = app.server;

        let index = 0;

        return <AccordionLayout className={'AssetsPanel'}
            onActive={this.handleActive}
               >
            <Accordion name={'Scene'}
                title={`${_t('Scene')}(${sceneCount})`}
                maximizable
            >
                <ScenePanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion>
            {!enableAuthority || authorities.includes('LIST_MESH') ? <Accordion name={'Model'}
                title={`${_t('Model')}(${meshCount})`}
                maximizable
                                                                     >
                <ModelPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_MAP') ? <Accordion name={'Map'}
                title={`${_t('Map')}(${mapCount})`}
                maximizable
                                                                    >
                <MapPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_MATERIAL') ? <Accordion name={'Material'}
                title={`${_t('Material')}(${materialCount})`}
                maximizable
                                                                         >
                <MaterialPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_AUDIO') ? <Accordion name={'Audio'}
                title={`${_t('Audio')}(${audioCount})`}
                maximizable
                                                                      >
                <AudioPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_ANIMATION') ? <Accordion name={'Animation'}
                title={`${_t('Animation')}(${animationCount})`}
                maximizable
                                                                          >
                <AnimationPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_PARTICLE') ? <Accordion name={'Particle'}
                title={`${_t('Particle')}(${particleCount})`}
                maximizable
                                                                         >
                <ParticlePanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_PREFAB') ? <Accordion name={'Prefab'}
                title={`${_t('Prefab')}(${prefabCount})`}
                maximizable
                                                                       >
                <PrefabPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_SCREENSHOT') ? <Accordion name={'Screenshot'}
                title={`${_t('Screenshot')}(${screenshotCount})`}
                maximizable
                                                                           >
                <ScreenshotPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || authorities.includes('LIST_VIDEO') ? <Accordion name={'Video'}
                title={`${_t('Video')}(${videoCount})`}
                maximizable
                                                                      >
                <VideoPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
            {!enableAuthority || isLogin ? <Accordion name={'Log'}
                title={`${_t('Logs')}`}
                maximizable
                                           >
                <LogPanel className={'subPanel'}
                    show={index++ === activeIndex}
                />
            </Accordion> : null}
        </AccordionLayout>;
    }

    componentDidMount() {
        this.update();
    }

    update() {
        fetch(`${app.options.server}/api/Assets/List`).then(response => {
            if (response.ok) {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg), 'warn');
                        return;
                    }
                    this.setState(obj);
                });
            }
        });
    }

    handleActive(index) {
        this.setState({
            activeIndex: index
        });
    }
}

export default AssetsPanel;