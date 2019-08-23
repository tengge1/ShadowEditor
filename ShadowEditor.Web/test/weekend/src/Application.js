/**
 * 应用程序
 */
class Application {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 200;
        this.height = 100;

        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
        canvas.width = this.width;
        canvas.height = this.height;

        this.context = canvas.getContext('2d');
    }

    start() {
        const {
            canvas,
            context
        } = this;

        let imgData = context.createImageData(this.width, this.height);

        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                let r = i / this.width;
                let g = j / this.height;
                let b = 0.2;

                let index = j * this.width * 4 + i * 4;

                imgData.data[index + 0] = parseInt(255.99 * r);
                imgData.data[index + 1] = parseInt(255.99 * g);
                imgData.data[index + 2] = parseInt(255.99 * b);
                imgData.data[index + 3] = 255;
            }
        }

        context.putImageData(imgData, 0, 0);
    }
}

export default Application;