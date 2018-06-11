import { dispatch } from '../third_party';
import EventList from './EventList';

/**
 * 事件执行器
 */
class EventDispatcher {

    constructor(app) {
        this.app = app;
        this.dispatch = dispatch.apply(dispatch, EventList);
        this.domElement = this.app.container;
        this.addDomEventListener();
    }

    /**
     * 执行事件
     * @param {*} eventName 
     * @param {*} _this 
     * @param {*} others 
     */
    call(eventName, _this, ...others) {
        this.dispatch.call(eventName, _this, ...others);
    }

    /**
     * 监听事件
     * @param {*} eventName 
     * @param {*} callback 
     */
    on(eventName, callback) {
        this.dispatch.on(eventName, callback);
    }

    /**
     * 监听dom事件
     */
    addDomEventListener() {
        var container = this.app.container;
        this.domElement.addEventListener('click', (event) => {
            this.dispatch.call('click', this, event);
        });
        this.domElement.addEventListener('contextmenu', (event) => {
            this.dispatch.call('contextmenu', this, event);
            event.preventDefault();
            return false;
        });
        this.domElement.addEventListener('dblclick', (event) => {
            this.dispatch.call('dblclick', this, event);
        });
        this.domElement.addEventListener('keydown', (event) => {
            this.dispatch.call('keydown', this, event);
        });
        this.domElement.addEventListener('keyup', (event) => {
            this.dispatch.call('keyup', this, event);
        });
        this.domElement.addEventListener('mousedown', (event) => {
            this.dispatch.call('mousedown', this, event);
        });
        this.domElement.addEventListener('mousemove', (event) => {
            this.dispatch.call('mousemove', this, event);
        });
        this.domElement.addEventListener('mouseup', (event) => {
            this.dispatch.call('mouseup', this, event);
        });
        this.domElement.addEventListener('mousewheel', (event) => {
            this.dispatch.call('mousewheel', this, event);
        });
        window.addEventListener('resize', (event) => {
            this.dispatch.call('resize', this, event);
        });
    }
}

export default EventDispatcher;