import BaseEvent from './BaseEvent';
import Rain from '../object/weather/Rain';

/**
 * 视图事件
 * @author tengge / https://github.com/tengge1
 */
function WeatherEvent() {
    BaseEvent.call(this);

    this.weather = '';

    this.onOptionChange = this.onOptionChange.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
}

WeatherEvent.prototype = Object.create(BaseEvent.prototype);
WeatherEvent.prototype.constructor = WeatherEvent;

WeatherEvent.prototype.start = function () {
    app.on(`optionChange.${this.id}`, this.onOptionChange);
    app.on(`afterRender.${this.id}`, this.onAfterRender);
};

WeatherEvent.prototype.stop = function () {
    app.on(`optionChange.${this.id}`, null);
};

WeatherEvent.prototype.onOptionChange = function (name, value) {
    if (name !== 'weather') {
        return;
    }
    this.weather = value;
};

WeatherEvent.prototype.onAfterRender = function () {
    if (this.weather === 'rain') {
        this.updateRain();
    } else if (this.weather === 'snow') {
        this.updateSnow();
    }
};

WeatherEvent.prototype.updateRain = function () {
    if (this.rain === undefined) {
        this.rain = new Rain();
        app.editor.sceneHelpers.add(this.rain);
    }

    let vertices = this.rain.geometry.vertices;

    vertices.forEach(v => {
        v.y = v.y - v.velocityY;
        v.x = v.x - v.velocityX;

        if (v.y <= 0) {
            v.y = 60;
        }

        if (v.x <= -20 || v.x >= 20) {
            v.velocityX = v.velocityX * -1;
        }
    });

    this.rain.geometry.verticesNeedUpdate = true;
};

WeatherEvent.prototype.updateSnow = function () {

};

export default WeatherEvent;