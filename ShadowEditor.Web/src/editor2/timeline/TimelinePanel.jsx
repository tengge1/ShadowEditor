import './css/TimelinePanel.css';

import { classNames, PropTypes, Timeline } from '../../third_party';

/**
 * 时间轴面板
 * @author tengge / https://github.com/tengge1
 */
class TimelinePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animations: [],
        };
    }

    render() {
        const { animations } = this.state;

        return <Timeline
            className={'TimelinePanel'}
            animations={animations}
            tip={L_ILLUSTRATE_DOUBLE_CLICK_ADD_ANIM}></Timeline>;
    }

    componentDidMount() {
        app.on(`appStarted.TimelinePanel`, this.onAppStarted.bind(this));
        app.on(`animationChanged.TimelinePanel`, this.updateUI.bind(this));
    }

    onAppStarted() {
        this.updateUI();
        // var timeline = UI.get('timeline', this.id);
        // var layers = UI.get('layers', this.id);

        // timeline.updateUI();
        // layers.dom.style.width = timeline.dom.clientWidth + 'px';

        // layers.dom.addEventListener(`click`, this.onClick.bind(this));
        // layers.dom.addEventListener(`dblclick`, this.onDblClick.bind(this));

        // app.on(`animationChanged.${this.id}`, this.updateUI.bind(this));
        // app.on(`resetAnimation.${this.id}`, this.onResetAnimation.bind(this));
        // app.on(`startAnimation.${this.id}`, this.onPlay.bind(this));
    }

    updateUI() {
        this.setState({ animations: app.editor.animations });
    }
}

export default TimelinePanel;