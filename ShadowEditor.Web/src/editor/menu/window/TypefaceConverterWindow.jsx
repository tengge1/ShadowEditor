import './css/TypefaceConverterWindow.css';
import { Window, Content, Buttons, Button, Label, Input, CheckBox, Form, FormControl, LinkButton } from '../../../third_party';
import DownloadUtils from '../../../utils/DownloadUtils';

/**
 * 字体转换器窗口
 * @author tengge / https://github.com/tengge1
 */
class TypefaceConverterWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            reverseDirection: false,
            characterSet: '',
            font: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleConvertFontType = this.handleConvertFontType.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { file, reverseDirection, characterSet } = this.state;

        return <Window
            className={'TypefaceConverterWindow'}
            title={_t('Typeface Converter')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Font File') + ' (.ttf)'}</Label>
                        <Input className={'font'}
                            name={'file'}
                            type={'file'}
                            value={file}
                            accept={'.ttf'}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Reverse direction')}</Label>
                        <CheckBox name={'reverseDirection'}
                            checked={reverseDirection}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Character set')}</Label>
                        <Input name={'characterSet'}
                            value={characterSet}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('.ttc to .ttf')}</Label>
                        <LinkButton onClick={this.handleConvertFontType}>{'https://transfonter.org/ttc-unpack'}</LinkButton>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        app.require('opentype');
    }

    handleChange(value, name, event) {
        if (name === 'file') {
            this.setState({
                [name]: value,
                font: event.target.files[0]
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleConvertFontType() {
        window.open('https://transfonter.org/ttc-unpack', '_blank');
    }

    handleOK() {
        const { font, reverseDirection, characterSet } = this.state;

        if (!font) {
            app.toast(_t('Please select an file.'));
            return;
        }

        app.mask(_t('Waiting...'));

        const reader = new FileReader();

        reader.addEventListener('load', event => {
            const font1 = opentype.parse(event.target.result);
            let result = this.convert(font1, reverseDirection, characterSet.trim());
            // 将文件放入assets/fonts/custom目录
            app.unmask();
            this.handleClose();
            DownloadUtils.download([result], { 'type': 'application/octet-stream' }, `${font1.familyName}_${font1.styleName}.json`);
            app.toast(_t('Convert successfully!'), 'success');
        }, false);

        reader.readAsArrayBuffer(font);
    }

    convert(font, reverseDirection, characterSet) {
        var scale = 1000 * 100 / ((font.unitsPerEm || 2048) * 72);
        var result = {};
        result.glyphs = {};

        var restriction = {
            range: null,
            set: null
        };

        if (characterSet.length > 0) {
            var restrictContent = characterSet;
            var rangeSeparator = '-';
            if (restrictContent.indexOf(rangeSeparator) !== -1) {
                var rangeParts = restrictContent.split(rangeSeparator);
                if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
                    restriction.range = [parseInt(rangeParts[0]), parseInt(rangeParts[1])];
                }
            }
            if (restriction.range === null) {
                restriction.set = restrictContent;
            }
        }

        font.glyphs.forEach(function (glyph) {
            if (glyph.unicode !== undefined) {
                var glyphCharacter = String.fromCharCode(glyph.unicode);
                var needToExport = true;
                if (restriction.range !== null) {
                    needToExport = glyph.unicode >= restriction.range[0] && glyph.unicode <= restriction.range[1];
                } else if (restriction.set !== null) {
                    needToExport = characterSet.indexOf(glyphCharacter) !== -1;
                }
                if (needToExport) {
                    var token = {};
                    token.ha = Math.round(glyph.advanceWidth * scale);
                    token.x_min = Math.round(glyph.xMin * scale);
                    token.x_max = Math.round(glyph.xMax * scale);
                    token.o = "";
                    if (reverseDirection) { glyph.path.commands = this.reverseCommands(glyph.path.commands); }
                    glyph.path.commands.forEach(function (command) {
                        if (command.type.toLowerCase() === "c") { command.type = "b"; }
                        token.o += command.type.toLowerCase();
                        token.o += " ";
                        if (command.x !== undefined && command.y !== undefined) {
                            token.o += Math.round(command.x * scale);
                            token.o += " ";
                            token.o += Math.round(command.y * scale);
                            token.o += " ";
                        }
                        if (command.x1 !== undefined && command.y1 !== undefined) {
                            token.o += Math.round(command.x1 * scale);
                            token.o += " ";
                            token.o += Math.round(command.y1 * scale);
                            token.o += " ";
                        }
                        if (command.x2 !== undefined && command.y2 !== undefined) {
                            token.o += Math.round(command.x2 * scale);
                            token.o += " ";
                            token.o += Math.round(command.y2 * scale);
                            token.o += " ";
                        }
                    });
                    result.glyphs[String.fromCharCode(glyph.unicode)] = token;
                }
            }
        });
        result.familyName = font.familyName;
        result.ascender = Math.round(font.ascender * scale);
        result.descender = Math.round(font.descender * scale);
        result.underlinePosition = Math.round(font.tables.post.underlinePosition * scale);
        result.underlineThickness = Math.round(font.tables.post.underlineThickness * scale);
        result.boundingBox = {
            "yMin": Math.round(font.tables.head.yMin * scale),
            "xMin": Math.round(font.tables.head.xMin * scale),
            "yMax": Math.round(font.tables.head.yMax * scale),
            "xMax": Math.round(font.tables.head.xMax * scale)
        };
        result.resolution = 1000;
        result.original_font_information = font.tables.name;
        if (font.styleName.toLowerCase().indexOf("bold") > -1) {
            result.cssFontWeight = "bold";
        } else {
            result.cssFontWeight = "normal";
        }

        if (font.styleName.toLowerCase().indexOf("italic") > -1) {
            result.cssFontStyle = "italic";
        } else {
            result.cssFontStyle = "normal";
        }

        return JSON.stringify(result);
    }

    reverseCommands(commands) {

        var paths = [];
        var path;

        commands.forEach(function (c) {
            if (c.type.toLowerCase() === "m") {
                path = [c];
                paths.push(path);
            } else if (c.type.toLowerCase() !== "z") {
                path.push(c);
            }
        });

        var reversed = [];
        paths.forEach(function (p) {
            var result = { "type": "m", "x": p[p.length - 1].x, "y": p[p.length - 1].y };
            reversed.push(result);

            for (var i = p.length - 1; i > 0; i--) {
                var command = p[i];
                result = { "type": command.type };
                if (command.x2 !== undefined && command.y2 !== undefined) {
                    result.x1 = command.x2;
                    result.y1 = command.y2;
                    result.x2 = command.x1;
                    result.y2 = command.y1;
                } else if (command.x1 !== undefined && command.y1 !== undefined) {
                    result.x1 = command.x1;
                    result.y1 = command.y1;
                }
                result.x = p[i - 1].x;
                result.y = p[i - 1].y;
                reversed.push(result);
            }

        });

        return reversed;

    }

    handleClose() {
        app.removeElement(this);
    }
}

export default TypefaceConverterWindow;