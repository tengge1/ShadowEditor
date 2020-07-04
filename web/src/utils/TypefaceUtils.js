/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 字体工具类
 * @author tengge / https://github.com/tengge1
 * @author gero3 / https://github.com/gero3
 */
const TypefaceUtils = {
    /**
     * 将字体(.ttf)转换成(.json)格式，用于创建三维文字
     * @param {ArrayBuffer} arrayBuffer .ttf字体二进制数据
     * @param {Boolean} reverseDirection 是否反转方向
     * @param {String} characterSet 需要哪些字符
     * @returns {String} json数据
     */
    convertTtfToJson(arrayBuffer, reverseDirection = false, characterSet = '') {
        return new Promise(resolve => {
            app.require('opentype').then(() => {
                const font = opentype.parse(arrayBuffer);
                let result = this._convert(font, reverseDirection, characterSet);
                resolve({ result, font });
            });
        });
    },

    // url https://github.com/gero3/facetype.js
    _convert(font, reverseDirection, characterSet) {
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
                    if (reverseDirection) { glyph.path.commands = this._reverseCommands(glyph.path.commands); }
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
    },

    // url: https://github.com/gero3/facetype.js
    _reverseCommands(commands) {

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
};

export default TypefaceUtils;