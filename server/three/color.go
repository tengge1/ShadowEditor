// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// This package is translated from three.js, visit `https://github.com/mrdoob/three.js`
// for more information.

package three

import (
	"math"
	"strconv"
)

// ColorKeywords :
var ColorKeywords = map[string]int{"aliceblue": 0xF0F8FF, "antiquewhite": 0xFAEBD7, "aqua": 0x00FFFF, "aquamarine": 0x7FFFD4, "azure": 0xF0FFFF,
	"beige": 0xF5F5DC, "bisque": 0xFFE4C4, "black": 0x000000, "blanchedalmond": 0xFFEBCD, "blue": 0x0000FF, "blueviolet": 0x8A2BE2,
	"brown": 0xA52A2A, "burlywood": 0xDEB887, "cadetblue": 0x5F9EA0, "chartreuse": 0x7FFF00, "chocolate": 0xD2691E, "coral": 0xFF7F50,
	"cornflowerblue": 0x6495ED, "cornsilk": 0xFFF8DC, "crimson": 0xDC143C, "cyan": 0x00FFFF, "darkblue": 0x00008B, "darkcyan": 0x008B8B,
	"darkgoldenrod": 0xB8860B, "darkgray": 0xA9A9A9, "darkgreen": 0x006400, "darkgrey": 0xA9A9A9, "darkkhaki": 0xBDB76B, "darkmagenta": 0x8B008B,
	"darkolivegreen": 0x556B2F, "darkorange": 0xFF8C00, "darkorchid": 0x9932CC, "darkred": 0x8B0000, "darksalmon": 0xE9967A, "darkseagreen": 0x8FBC8F,
	"darkslateblue": 0x483D8B, "darkslategray": 0x2F4F4F, "darkslategrey": 0x2F4F4F, "darkturquoise": 0x00CED1, "darkviolet": 0x9400D3,
	"deeppink": 0xFF1493, "deepskyblue": 0x00BFFF, "dimgray": 0x696969, "dimgrey": 0x696969, "dodgerblue": 0x1E90FF, "firebrick": 0xB22222,
	"floralwhite": 0xFFFAF0, "forestgreen": 0x228B22, "fuchsia": 0xFF00FF, "gainsboro": 0xDCDCDC, "ghostwhite": 0xF8F8FF, "gold": 0xFFD700,
	"goldenrod": 0xDAA520, "gray": 0x808080, "green": 0x008000, "greenyellow": 0xADFF2F, "grey": 0x808080, "honeydew": 0xF0FFF0, "hotpink": 0xFF69B4,
	"indianred": 0xCD5C5C, "indigo": 0x4B0082, "ivory": 0xFFFFF0, "khaki": 0xF0E68C, "lavender": 0xE6E6FA, "lavenderblush": 0xFFF0F5, "lawngreen": 0x7CFC00,
	"lemonchiffon": 0xFFFACD, "lightblue": 0xADD8E6, "lightcoral": 0xF08080, "lightcyan": 0xE0FFFF, "lightgoldenrodyellow": 0xFAFAD2, "lightgray": 0xD3D3D3,
	"lightgreen": 0x90EE90, "lightgrey": 0xD3D3D3, "lightpink": 0xFFB6C1, "lightsalmon": 0xFFA07A, "lightseagreen": 0x20B2AA, "lightskyblue": 0x87CEFA,
	"lightslategray": 0x778899, "lightslategrey": 0x778899, "lightsteelblue": 0xB0C4DE, "lightyellow": 0xFFFFE0, "lime": 0x00FF00, "limegreen": 0x32CD32,
	"linen": 0xFAF0E6, "magenta": 0xFF00FF, "maroon": 0x800000, "mediumaquamarine": 0x66CDAA, "mediumblue": 0x0000CD, "mediumorchid": 0xBA55D3,
	"mediumpurple": 0x9370DB, "mediumseagreen": 0x3CB371, "mediumslateblue": 0x7B68EE, "mediumspringgreen": 0x00FA9A, "mediumturquoise": 0x48D1CC,
	"mediumvioletred": 0xC71585, "midnightblue": 0x191970, "mintcream": 0xF5FFFA, "mistyrose": 0xFFE4E1, "moccasin": 0xFFE4B5, "navajowhite": 0xFFDEAD,
	"navy": 0x000080, "oldlace": 0xFDF5E6, "olive": 0x808000, "olivedrab": 0x6B8E23, "orange": 0xFFA500, "orangered": 0xFF4500, "orchid": 0xDA70D6,
	"palegoldenrod": 0xEEE8AA, "palegreen": 0x98FB98, "paleturquoise": 0xAFEEEE, "palevioletred": 0xDB7093, "papayawhip": 0xFFEFD5, "peachpuff": 0xFFDAB9,
	"peru": 0xCD853F, "pink": 0xFFC0CB, "plum": 0xDDA0DD, "powderblue": 0xB0E0E6, "purple": 0x800080, "rebeccapurple": 0x663399, "red": 0xFF0000, "rosybrown": 0xBC8F8F,
	"royalblue": 0x4169E1, "saddlebrown": 0x8B4513, "salmon": 0xFA8072, "sandybrown": 0xF4A460, "seagreen": 0x2E8B57, "seashell": 0xFFF5EE,
	"sienna": 0xA0522D, "silver": 0xC0C0C0, "skyblue": 0x87CEEB, "slateblue": 0x6A5ACD, "slategray": 0x708090, "slategrey": 0x708090, "snow": 0xFFFAFA,
	"springgreen": 0x00FF7F, "steelblue": 0x4682B4, "tan": 0xD2B48C, "teal": 0x008080, "ctle": 0xD8BFD8, "tomato": 0xFF6347, "turquoise": 0x40E0D0,
	"violet": 0xEE82EE, "wheat": 0xF5DEB3, "white": 0xFFFFFF, "whitesmoke": 0xF5F5F5, "yellow": 0xFFFF00, "yellowgreen": 0x9ACD32}

// HSL :
type HSL struct {
	H float64
	S float64
	L float64
}

var _hslA = HSL{0, 0, 0}
var _hslB = HSL{0, 0, 0}

// NewColor :
func NewColor(r, g, b float64) *Color {
	return &Color{r, g, b}
}

// Color :
type Color struct {
	R float64
	G float64
	B float64
}

// Hue2Rgb :
func Hue2Rgb(p, q, t float64) float64 {
	if t < 0 {
		t++
	}
	if t > 1 {
		t--
	}
	if t < 1/6 {
		return p + (q-p)*6*t
	}
	if t < 1/2 {
		return q
	}
	if t < 2/3 {
		return p + (q-p)*6*(2/3-t)
	}
	return p
}

// SRGBToLinear :
func SRGBToLinear(d float64) float64 {
	if d < 0.04045 {
		return d * 0.0773993808
	}
	return math.Pow(d*0.9478672986+0.0521327014, 2.4)
}

// LinearToSRGB :
func LinearToSRGB(d float64) float64 {
	if d < 0.0031308 {
		return d * 12.92
	}
	return 1.055*(math.Pow(d, 0.41666)) - 0.055
}

// Set :
func (c Color) Set(r, g, b float64) *Color {
	return c.SetRGB(r, g, b)
}

// SetScalar :
func (c Color) SetScalar(scalar float64) *Color {
	c.R = scalar
	c.G = scalar
	c.B = scalar
	return &c
}

// SetHex :
func (c Color) SetHex(hex int) *Color {
	c.R = float64((hex >> 16 & 255) / 255)
	c.G = float64((hex >> 8 & 255) / 255)
	c.B = float64((hex & 255) / 255)
	return &c
}

// SetRGB :
func (c Color) SetRGB(r, g, b float64) *Color {
	c.R = r
	c.G = g
	c.B = b
	return &c
}

// SetHSL :
func (c Color) SetHSL(h, s, l float64) *Color {
	// h,s,l ranges are in 0.0 - 1.0
	h = float64(EuclideanModulo(int(h), 1))
	s = Clamp(s, 0, 1)
	l = Clamp(l, 0, 1)

	if s == 0 {
		c.R = 1
		c.G = 1
		c.B = l
	} else {
		p := l + s - (l * s)
		if l <= 0.5 {
			p = l * (1 + s)
		}
		q := (2 * l) - p
		c.R = Hue2Rgb(q, p, h+1/3)
		c.G = Hue2Rgb(q, p, h)
		c.B = Hue2Rgb(q, p, h-1/3)
	}

	return &c
}

// SetColorName :
func (c Color) SetColorName(style string) *Color {
	// color keywords
	if hex, ok := ColorKeywords[style]; ok {
		c.SetHex(hex)
	} else {
		panic("THREE.Color: Unknown color " + style)
	}
	return &c
}

// Clone :
func (c Color) Clone() *Color {
	return NewColor(c.R, c.B, c.G)
}

// Copy :
func (c Color) Copy(color Color) *Color {
	c.R = color.R
	c.G = color.G
	c.B = color.B
	return &c
}

// CopyGammaToLinear : gammaFactor default is 2.0
func (c Color) CopyGammaToLinear(color Color, gammaFactor float64) *Color {
	c.R = math.Pow(color.R, gammaFactor)
	c.G = math.Pow(color.G, gammaFactor)
	c.B = math.Pow(color.B, gammaFactor)
	return &c
}

// CopyLinearToGamma : gammaFactor default is 2.0
func (c Color) CopyLinearToGamma(color Color, gammaFactor float64) *Color {
	safeInverse := 1.0
	if gammaFactor > 0 {
		gammaFactor = 1.0 / gammaFactor
	}
	c.R = math.Pow(color.R, safeInverse)
	c.G = math.Pow(color.G, safeInverse)
	c.B = math.Pow(color.B, safeInverse)
	return &c
}

// ConvertGammaToLinear :
func (c Color) ConvertGammaToLinear(gammaFactor float64) *Color {
	c.CopyGammaToLinear(c, gammaFactor)
	return &c
}

// ConvertLinearToGamma :
func (c Color) ConvertLinearToGamma(gammaFactor float64) *Color {
	c.CopyLinearToGamma(c, gammaFactor)
	return &c
}

// CopySRGBToLinear :
func (c Color) CopySRGBToLinear(color Color) *Color {
	c.R = SRGBToLinear(color.R)
	c.G = SRGBToLinear(color.G)
	c.B = SRGBToLinear(color.B)
	return &c
}

// CopyLinearToSRGB :
func (c Color) CopyLinearToSRGB(color Color) *Color {
	c.R = LinearToSRGB(color.R)
	c.G = LinearToSRGB(color.G)
	c.B = LinearToSRGB(color.B)
	return &c
}

// ConvertSRGBToLinear :
func (c Color) ConvertSRGBToLinear() *Color {
	c.CopySRGBToLinear(c)
	return &c
}

// ConvertLinearToSRGB :
func (c Color) ConvertLinearToSRGB() *Color {
	c.CopyLinearToSRGB(c)
	return &c
}

// GetHex :
func (c Color) GetHex() int {
	return (int(c.R)*255)<<16 ^ (int(c.G)*255)<<8 ^ (int(c.B)*255)<<0
}

// GetHexString :
func (c Color) GetHexString() string {
	str := "000000" + strconv.FormatInt(int64(c.GetHex()), 16)
	return str[len(str)-6:]
}

// GetHSL :
func (c Color) GetHSL(target HSL) *HSL {
	// h,s,l ranges are in 0.0 - 1.0
	r, g, b := c.R, c.G, c.B
	max := math.Max(r, math.Max(g, b))
	min := math.Min(r, math.Min(g, b))

	var hue, saturation float64
	lightness := (min + max) / 2.0

	if min == max {
		hue = 0
		saturation = 0
	} else {
		delta := max - min
		if lightness <= 0.5 {
			saturation = delta / (max + min)
		} else {
			saturation = delta / (2 - max - min)
		}
		switch max {
		case r:
			if g < b {
				hue = (g-b)/delta + 6
			} else {
				hue = (g - b) / delta
			}
		case g:
			hue = (b-r)/delta + 2
		case b:
			hue = (r-g)/delta + 4
		}
		hue /= 6
	}

	target.H = hue
	target.S = saturation
	target.L = lightness

	return &target
}

// GetStyle :
func (c Color) GetStyle() string {
	return "rgb(" + strconv.Itoa((int(c.R)*255)|0) +
		"," + strconv.Itoa((int(c.G)*255)|0) + "," +
		strconv.Itoa((int(c.B)*255)|0) + ")"
}

// OffsetHSL :
func (c Color) OffsetHSL(h, s, l float64) *Color {
	c.GetHSL(_hslA)
	_hslA.H += h
	_hslA.S += s
	_hslA.L += l
	c.SetHSL(_hslA.H, _hslA.S, _hslA.L)
	return &c
}

// Add :
func (c Color) Add(color Color) *Color {
	c.R += color.R
	c.G += color.G
	c.B += color.B
	return &c
}

// AddColors :
func (c Color) AddColors(color1, color2 Color) *Color {
	c.R = color1.R + color2.R
	c.G = color1.G + color2.G
	c.B = color1.B + color2.B
	return &c
}

// AddScalar :
func (c Color) AddScalar(s float64) *Color {
	c.R += s
	c.G += s
	c.B += s
	return &c
}

// Sub :
func (c Color) Sub(color Color) *Color {
	c.R = math.Max(0, c.R-color.R)
	c.G = math.Max(0, c.G-color.G)
	c.B = math.Max(0, c.B-color.B)
	return &c
}

// Multiply :
func (c Color) Multiply(color Color) *Color {
	c.R *= color.R
	c.G *= color.G
	c.B *= color.B
	return &c
}

// MultiplyScalar :
func (c Color) MultiplyScalar(s float64) *Color {
	c.R *= s
	c.G *= s
	c.B *= s
	return &c
}

// Lerp :
func (c Color) Lerp(color Color, alpha float64) *Color {
	c.R += (color.R - c.R) * alpha
	c.G += (color.G - c.G) * alpha
	c.B += (color.B - c.B) * alpha
	return &c
}

// LerpHSL :
func (c Color) LerpHSL(color Color, alpha float64) *Color {
	c.GetHSL(_hslA)
	color.GetHSL(_hslB)

	h := Lerp(_hslA.H, _hslB.H, alpha)
	s := Lerp(_hslA.S, _hslB.S, alpha)
	l := Lerp(_hslA.L, _hslB.L, alpha)

	c.SetHSL(h, s, l)
	return &c
}

// Equals :
func (c Color) Equals(d Color) bool {
	return (d.R == c.R) && (d.G == c.G) && (d.B == c.B)
}

// FromArray :
func (c Color) FromArray(array []float64, offset int) *Color {
	if len(array) < offset+3 {
		panic("array length should be greater than offset+3")
	}
	c.R = array[offset]
	c.G = array[offset+1]
	c.B = array[offset+2]
	return &c
}

// ToArray :
func (c Color) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+3 {
		panic("array length should be greater than offset+3")
	}
	array[offset] = c.R
	array[offset+1] = c.G
	array[offset+2] = c.B
	return array
}

// ToJSON :
func (c Color) ToJSON() int {
	return c.GetHex()
}
