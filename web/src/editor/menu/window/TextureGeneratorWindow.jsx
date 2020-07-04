/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TextureGeneratorWindow.css';
import { Window, Content, Buttons, Button } from '../../../ui/index';

/**
 * 纹理生成器窗口
 * @author tengge / https://github.com/tengge1
 */
class TextureGeneratorWindow extends React.Component {
    constructor(props) {
        super(props);

        this.containerRef = React.createRef();

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'TextureGeneratorWindow'}
            title={_t('Texture Generator')}
            style={{ width: '800px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <div ref={this.containerRef} />
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        const container = this.containerRef.current;

        let examples = [];

        var vignette = null;

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.XOR().tint(1, 0.5, 0.7))
                .add(new TG.SinX().frequency(0.004).tint(0.25, 0, 0))
                .sub(new TG.SinY().frequency(0.004).tint(0.25, 0, 0))
                .add(new TG.SinX().frequency(0.0065).tint(0.1, 0.5, 0.2))
                .add(new TG.SinY().frequency(0.0065).tint(0, 0.4, 0.5))
                .add(new TG.Noise().tint(0.1, 0.1, 0.2))
                .toCanvas();
            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.SinX().offset(- 16).frequency(0.03).tint(0.1, 0.25, 0.5))
                .add(new TG.SinY().offset(- 16).frequency(0.03).tint(0.1, 0.25, 0.5))
                .add(new TG.Number().tint(0.75, 0.5, 0.5))
                .add(new TG.SinX().frequency(0.03).tint(0.2, 0.2, 0.2))
                .add(new TG.SinY().frequency(0.03).tint(0.2, 0.2, 0.2))
                .add(new TG.Noise().tint(0.1, 0, 0))
                .add(new TG.Noise().tint(0, 0.1, 0))
                .add(new TG.Noise().tint(0, 0, 0.1))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.SinX().frequency(0.1))
                .mul(new TG.SinX().frequency(0.05))
                .mul(new TG.SinX().frequency(0.025))
                .mul(new TG.SinY().frequency(0.1))
                .mul(new TG.SinY().frequency(0.05))
                .mul(new TG.SinY().frequency(0.025))
                .add(new TG.SinX().frequency(0.004).tint(-0.25, 0.1, 0.6))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.XOR())
                .mul(new TG.OR().tint(0.5, 0.8, 0.5))
                .mul(new TG.SinX().frequency(0.0312))
                .div(new TG.SinY().frequency(0.0312))
                .add(new TG.SinX().frequency(0.004).tint(0.5, 0, 0))
                .add(new TG.Noise().tint(0.1, 0.1, 0.2))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.SinX().frequency(0.01))
                .mul(new TG.SinY().frequency(0.0075))
                .add(new TG.SinX().frequency(0.0225))
                .mul(new TG.SinY().frequency(0.015))
                .add(new TG.Noise().tint(0.1, 0.1, 0.3))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.SinX().frequency(0.05))
                .mul(new TG.SinX().frequency(0.08))
                .add(new TG.SinY().frequency(0.05))
                .mul(new TG.SinY().frequency(0.08))
                .div(new TG.Number().tint(1, 2, 1))
                .add(new TG.SinX().frequency(0.003).tint(0.5, 0, 0))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.SinX().frequency(0.066))
                .add(new TG.SinY().frequency(0.066))
                .mul(new TG.SinX().offset(32).frequency(0.044).tint(2, 2, 2))
                .mul(new TG.SinY().offset(16).frequency(0.044).tint(2, 2, 2))
                .sub(new TG.Number().tint(0.5, 2, 4))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.SinX().frequency(0.004))
                .mul(new TG.SinY().frequency(0.004))
                .mul(new TG.SinY().offset(32).frequency(0.02))
                .div(new TG.SinX().frequency(0.02).tint(8, 5, 4))
                .add(new TG.Noise().tint(0.1, 0, 0))
                .add(new TG.Noise().tint(0, 0.1, 0))
                .add(new TG.Noise().tint(0, 0, 0.1))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.CheckerBoard())
                .add(new TG.CheckerBoard().size(2, 2).tint(0.5, 0, 0))
                .add(new TG.CheckerBoard().size(8, 8).tint(1, 0.5, 0.5))
                .sub(new TG.CheckerBoard().offset(16, 16).tint(0.5, 0.5, 0))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.Rect().position(size / 4.8, size / 12).size(size / 1.7, size / 2).tint(1, 0.25, 0.25))
                .add(new TG.Rect().position(size / 12, size / 4).size(size / 1.21, size / 2).tint(0.25, 1, 0.25))
                .add(new TG.Rect().position(size / 4.8, size / 2.5).size(size / 1.7, size / 2).tint(0.25, 0.25, 1))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.CheckerBoard().size(32, 32).tint(0.5, 0, 0))
                .set(new TG.SineDistort())
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.CheckerBoard().size(32, 32).tint(0.5, 0, 0))
                .set(new TG.Twirl().radius(size / 2).position(size / 2, size / 2).strength(75))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.Circle().position(size / 2, size / 2).radius(size / 4))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.Circle().position(size / 2, size / 2).radius(size / 4).delta(size / 4).tint(1, 0.25, 0.25))
                .set(new TG.Pixelate().size(size / 32, size / 32))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.CheckerBoard().tint(1, 1, 0))
                .set(new TG.Transform().offset(10, 20).angle(23).scale(2, 0.5))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.CheckerBoard())
                .and(new TG.Circle().position(size / 2, size / 2).radius(size / 3))
                .xor(new TG.Circle().position(size / 2, size / 2).radius(size / 4))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.CheckerBoard().size(size / 16, size / 16))
                .set(new TG.Twirl().radius(size / 2).strength(75).position(size / 2, size / 2))
                .min(new TG.Circle().position(size / 2, size / 2).radius(size / 2).delta(size / 2))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.LinearGradient().interpolation(0)
                    .point(0, [1, 1, 0, 0])
                    .point(0.25, [0.2, 0, 0.5, 1])
                    .point(0.5, [0.5, 0.2, 0.5, 1])
                    .point(1, [1, 0, 1, 1]))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.LinearGradient().interpolation(1)
                    .point(0, [1, 1, 0, 0])
                    .point(0.25, [0.2, 0, 0.5, 1])
                    .point(0.5, [0.5, 0.2, 0.5, 1])
                    .point(1, [1, 0, 1, 1]))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.LinearGradient().interpolation(2)
                    .point(0, [1, 1, 0, 0])
                    .point(0.25, [0.2, 0, 0.5, 1])
                    .point(0.5, [0.5, 0.2, 0.5, 1])
                    .point(1, [1, 0, 1, 1]))
                .toCanvas();


            return texture;
        });



        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.RadialGradient().center(size / 2, size / 2).radius(size / 8).repeat(true).interpolation(0)
                    .point(0, [1, 1, 0, 0])
                    .point(0.25, [0.2, 0, 0.5, 1])
                    .point(0.5, [0.5, 0.2, 0.5, 1])
                    .point(1, [1, 0, 1, 1]))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.RadialGradient().center(0, 0).radius(size * 2).interpolation(1)
                    .point(0, [1, 1, 0, 0])
                    .point(0.25, [0.2, 0, 0.5, 1])
                    .point(0.5, [0.5, 0.2, 0.5, 1])
                    .point(1, [1, 0, 1, 1]))
                .toCanvas();


            return texture;
        });

        //

        examples.push(function (size) {
            var texture = new TG.Texture(size, size)
                .add(new TG.RadialGradient().center(size / 2, 0).radius(size).interpolation(2)
                    .point(0, [1, 1, 0, 0])
                    .point(0.25, [0.2, 0, 0.5, 1])
                    .point(0.5, [0.5, 0.2, 0.5, 1])
                    .point(1, [1, 0, 1, 1]))
                .toCanvas();


            return texture;
        });

        //---- Put-Texture ----

        examples.push(function (size) {
            vignette = new TG.Texture(size, size)		// predefine a vignette-effect so it can be used later
                .set(new TG.Circle().radius(size).position(size / 2, size / 2).delta(size * 0.7));

            var numSamples = 6;		// more samples = heavier effect

            var base = new TG.Texture(size, size)		// generating an image to be blurred
                .set(new TG.FractalNoise().amplitude(0.46).persistence(0.78).interpolation(0))
                .set(new TG.Normalize());

            var blur = new TG.Texture(size, size);		// the texture the samples are put onto

            for (var i = 0; i <= numSamples; i++) {
                var sample = new TG.Texture(size, size)
                    .set(new TG.PutTexture(base)) 		// copy the base texture, so that it doesn't get modified
                    .set(new TG.Transform().scale(1 + 0.01 * i, 1 + 0.01 * i).angle(0.5 * i));		// modify the texture a bit more with each sample

                blur.add(new TG.PutTexture(sample));		// adding the transformed sample to the result
            }

            blur.set(new TG.Normalize())		// since the samples are not weighted, put everything in the visible range
                .mul(new TG.PutTexture(vignette));		// adding the predefined vignette-effect

            base.toCanvas();		// since we copied the base texture instead of modifying it directly, we can still use it how it was before

            var texture = blur.toCanvas();

            return texture;
        });

        //----

        examples.push(function (size) {
            var subDim = Math.floor(size / 4);		// generate a smaller image so it can be mirrored later

            var pixel = new TG.Texture(subDim, subDim)
                .set(new TG.FractalNoise().baseFrequency(subDim / 15).octaves(1).amplitude(1))		// generating a noise pattern with 15 pixels per length
                .set(new TG.GradientMap().interpolation(0)		// divide the generated values into defined colors
                    .point(0, [250, 230, 210])		//[ 251, 255, 228 ] (alternative colors)
                    .point(0.2, [255, 92, 103])		//[ 130, 198, 184 ]
                    .point(0.4, [200, 15, 17])		//[ 42, 166, 137 ]
                    .point(0.6, [140, 49, 59])		//[ 58, 131, 114 ]
                    .point(0.8, [35, 10, 12])		//[ 4, 46, 27 ]
                    .point(1, [0, 0, 0]))
                .div(new TG.Number().tint(255, 255, 255));		// converting the 0-255 defined colors to the 0-1 space

            var mirrored = new TG.Texture(size, size)
                .add(new TG.PutTexture(pixel).repeat(2))		// repeat the texture to get a cool mirrored pattern effect
                .mul(new TG.PutTexture(vignette).tint(1.2, 1.2, 1.2));		// adding the vignette from the example above

            var texture = mirrored.toCanvas();

            return texture;
        });

        function generateTexture(a) {
            if (a >= examples.length) return;

            container.appendChild(examples[a](256));

            setTimeout(function () { generateTexture(a + 1); });
        }

        setTimeout(function () {
            generateTexture(0);
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default TextureGeneratorWindow;