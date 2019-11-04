import './css/AssetsPanel.css';

import { AccordionLayout, Accordion } from '../../third_party';

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

        const isLogin = !app.config.enableAuthority || app.config.isLogin;

        return <AccordionLayout className={'AssetsPanel'}
            onActive={this.handleActive}
               >
            <Accordion name={'Scene'}
                title={`${_t('Scene')}(${sceneCount})`}
                maximizable
            >
                <ScenePanel className={'subPanel'}
                    show={0 === activeIndex}
                />
            </Accordion>
            {isLogin && <Accordion name={'Model'}
                title={`${_t('Model')}(${meshCount})`}
                maximizable
                        >
                <ModelPanel className={'subPanel'}
                    show={1 === activeIndex}
                />
                </Accordion>}
            {isLogin && <Accordion name={'Map'}
                title={`${_t('Map')}(${mapCount})`}
                maximizable
                        >
                    <MapPanel className={'subPanel'}
                        show={2 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Material'}
                title={`${_t('Material')}(${materialCount})`}
                maximizable
                        >
                    <MaterialPanel className={'subPanel'}
                        show={3 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Audio'}
                title={`${_t('Audio')}(${audioCount})`}
                maximizable
                        >
                    <AudioPanel className={'subPanel'}
                        show={4 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Animation'}
                title={`${_t('Animation')}(${animationCount})`}
                maximizable
                        >
                    <AnimationPanel className={'subPanel'}
                        show={5 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Particle'}
                title={`${_t('Particle')}(${particleCount})`}
                maximizable
                        >
                    <ParticlePanel className={'subPanel'}
                        show={6 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Prefab'}
                title={`${_t('Prefab')}(${prefabCount})`}
                maximizable
                        >
                    <PrefabPanel className={'subPanel'}
                        show={7 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Screenshot'}
                title={`${_t('Screenshot')}(${screenshotCount})`}
                maximizable
                        >
                    <ScreenshotPanel className={'subPanel'}
                        show={8 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Video'}
                title={`${_t('Video')}(${videoCount})`}
                maximizable
                        >
                    <VideoPanel className={'subPanel'}
                        show={9 === activeIndex}
                    />
                </Accordion>}
            {isLogin && <Accordion name={'Log'}
                title={`${_t('Logs')}`}
                maximizable
                        >
                    <LogPanel className={'subPanel'}
                        show={10 === activeIndex}
                    />
                </Accordion>}
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
                        app.toast(_t(obj.Msg));
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