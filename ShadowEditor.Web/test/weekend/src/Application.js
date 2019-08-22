/**
 * 应用程序
 */
class Application {
    constructor(canvas) {
        canvas.style.width = '200px';
        canvas.style.height = '200px';
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    start() {
        const {
            canvas,
            context
        } = this;

        let imgData = context.createImageData(200, 200);

        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i + 0] = 255;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 255;
        }

        context.putImageData(imgData, 0, 0);
    }
}

export default Application;