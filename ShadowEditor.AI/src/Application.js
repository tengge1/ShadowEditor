import Options from './Options';
import EventDispatcher from './event/EventDispatcher';
import LanguageLoader from './utils/LanguageLoader';
import Editor from './editor/Editor.jsx';

class Application {
    constructor(container, options) {
        this.container = container;

        window.app = this;

        // 配置
        this.options = new Options(options);

        // 事件
        this.event = new EventDispatcher(this);
        this.call = this.event.call.bind(this.event);
        this.on = this.event.on.bind(this.event);

        // 加载语言包
        const loader = new LanguageLoader();

        loader.load().then(() => {
            this.ui = React.createElement(Editor);
            this.start();
        });
    }

    start() {
        this.event.start();
    }
}

export default Application;