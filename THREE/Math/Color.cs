using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author mrdoob / http://mrdoob.com/
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Color
    {
        public double r = 1.0;
        public double g = 1.0;
        public double b = 1.0;

        public Color(double r, double g, double b)
        {
            this.SetRGB(r, g, b);
        }

        public Color(int color)
        {
            this.Set(color);
        }

        public Color(string color)
        {
            this.Set(color);
        }

        public const bool isColor = true;

        public Color Set(Color value)
        {
            this.Copy(value);

            return this;
        }

        public Color Set(int value)
        {
            this.SetHex(value);

            return this;
        }

        public Color Set(string value)
        {
            this.SetStyle(value);

            return this;
        }

        public Color SetScalar(double scalar)
        {
            this.r = scalar;
            this.g = scalar;
            this.b = scalar;

            return this;
        }

        public Color SetHex(int hex)
        {
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;

            return this;
        }

        public Color SetRGB(double r, double g, double b)
        {
            this.r = r;
            this.g = g;
            this.b = b;

            return this;
        }

        private double Hue2rgb(double p, double q, double t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
            return p;
        }

        public Color SetHSL(double h, double s, double l)
        {
            // h,s,l ranges are in 0.0 - 1.0
            h = Math.EuclideanModulo(h, 1);
            s = Math.Clamp(s, 0, 1);
            l = Math.Clamp(l, 0, 1);

            if (s == 0)
            {
                this.r = this.g = this.b = l;
            }
            else
            {
                var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
                var q = (2 * l) - p;

                this.r = Hue2rgb(q, p, h + 1 / 3);
                this.g = Hue2rgb(q, p, h);
                this.b = Hue2rgb(q, p, h - 1 / 3);
            }

            return this;
        }

        private void HandleAlpha(string str, string style)
        {
            if (str == null) return;

            if (double.Parse(str) < 1)
            {
                Console.WriteLine("THREE.Color: Alpha component of " + style + " will be ignored.");
            }
        }

        public Color SetStyle(string style)
        {
            Match m;

            if ((m = new Regex(@"^((?:rgb|hsl)a?)\(\s*([^\)]*)\)", RegexOptions.ECMAScript).Match(style)).Success)
            {
                // rgb / hsl
                Match color;
                var name = m.Groups[1].Value;
                var components = m.Groups[2].Value;

                switch (name)
                {
                    case "rgb":
                    case "rgba":
                        if ((color = new Regex(@"^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$",
                            RegexOptions.ECMAScript).Match(components)).Success)
                        {
                            // rgb(255,0,0) rgba(255,0,0,0.5)
                            this.r = _Math.Min(255, Convert.ToInt32(color.Groups[1].Value, 10)) / 255;
                            this.g = _Math.Min(255, Convert.ToInt32(color.Groups[2].Value, 10)) / 255;
                            this.b = _Math.Min(255, Convert.ToInt32(color.Groups[3].Value, 10)) / 255;

                            this.HandleAlpha(color.Groups[5].Value, style);

                            return this;
                        }

                        if ((color = new Regex(@"^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$",
                            RegexOptions.ECMAScript).Match(components)).Success)
                        {
                            // rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
                            this.r = _Math.Min(100, Convert.ToInt32(color.Groups[1].Value, 10)) / 100;
                            this.g = _Math.Min(100, Convert.ToInt32(color.Groups[2].Value, 10)) / 100;
                            this.b = _Math.Min(100, Convert.ToInt32(color.Groups[3].Value, 10)) / 100;

                            this.HandleAlpha(color.Groups[5].Value, style);

                            return this;
                        }
                        break;
                    case "hsl":
                    case "hsla":
                        if ((color = new Regex(@"^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$",
                            RegexOptions.ECMAScript).Match(components)).Success)
                        {
                            // hsl(120,50%,50%) hsla(120,50%,50%,0.5)
                            var h = Convert.ToDouble(color.Groups[1].Value) / 360;
                            var s = Convert.ToInt32(color.Groups[2].Value, 10) / 100;
                            var l = Convert.ToInt32(color.Groups[3].Value, 10) / 100;

                            this.HandleAlpha(color.Groups[5].Value, style);

                            return this.SetHSL(h, s, l);
                        }
                        break;
                }
            }
            else if ((m = new Regex(@"^\#([A-Fa-f0-9]+)$", RegexOptions.ECMAScript).Match(style)).Success)
            {
                // hex color
                var hex = m.Groups[1].Value;
                var size = hex.Length;

                if (size == 3)
                {
                    // #ff0
                    this.r = Convert.ToInt32((hex[0] + hex[0]).ToString(), 16) / 255;
                    this.g = Convert.ToInt32((hex[1] + hex[1]).ToString(), 16) / 255;
                    this.b = Convert.ToInt32((hex[2] + hex[2]).ToString(), 16) / 255;

                    return this;
                }
                else if (size == 6)
                {
                    // #ff0000
                    this.r = Convert.ToInt32((hex[0] + hex[1]).ToString(), 16) / 255;
                    this.g = Convert.ToInt32((hex[2] + hex[3]).ToString(), 16) / 255;
                    this.b = Convert.ToInt32((hex[4] + hex[5]).ToString(), 16) / 255;
                    return this;
                }
            }

            if (style != null && style.Length > 0)
            {
                // color keywords
                var field = typeof(ColorKeywords).GetField(style);

                if (field != null)
                {
                    var hex = Convert.ToInt32(field.GetValue(null).ToString());

                    // red
                    this.SetHex(hex);
                }
                else
                {
                    // unknown color
                    Console.WriteLine("THREE.Color: Unknown color " + style);
                }
            }

            return this;
        }

        public Color Clone()
        {
            return new Color(this.r, this.g, this.b);
        }

        public Color Copy(Color color)
        {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;

            return this;
        }

        public Color CopyGammaToLinear(Color color, double gammaFactor = 2.0)
        {
            this.r = _Math.Pow(color.r, gammaFactor);
            this.g = _Math.Pow(color.g, gammaFactor);
            this.b = _Math.Pow(color.b, gammaFactor);

            return this;
        }

        public Color CopyLinearToGamma(Color color, double gammaFactor = 2.0)
        {
            var safeInverse = (gammaFactor > 0) ? (1.0 / gammaFactor) : 1.0;

            this.r = _Math.Pow(color.r, safeInverse);
            this.g = _Math.Pow(color.g, safeInverse);
            this.b = _Math.Pow(color.b, safeInverse);

            return this;
        }

        public Color ConvertGammaToLinear(double gammaFactor)
        {
            this.CopyGammaToLinear(this, gammaFactor);

            return this;
        }

        public Color ConvertLinearToGamma(double gammaFactor)
        {
            this.CopyLinearToGamma(this, gammaFactor);

            return this;
        }

        private double SRGBToLinear(double c)
        {
            return (c < 0.04045) ? c * 0.0773993808 : _Math.Pow(c * 0.9478672986 + 0.0521327014, 2.4);
        }

        public Color CopySRGBToLinear(Color color)
        {
            this.r = SRGBToLinear(color.r);
            this.g = SRGBToLinear(color.g);
            this.b = SRGBToLinear(color.b);

            return this;
        }

        private double LinearToSRGB(double c)
        {
            return (c < 0.0031308) ? c * 12.92 : 1.055 * (_Math.Pow(c, 0.41666)) - 0.055;
        }

        public Color CopyLinearToSRGB(Color color)
        {
            this.r = LinearToSRGB(color.r);
            this.g = LinearToSRGB(color.g);
            this.b = LinearToSRGB(color.b);

            return this;
        }

        public Color ConvertSRGBToLinear()
        {
            this.CopySRGBToLinear(this);

            return this;
        }

        public Color ConvertLinearToSRGB()
        {
            this.CopyLinearToSRGB(this);

            return this;
        }

        public double GetHex()
        {
            return Convert.ToInt32(this.r * 255) << 16 ^ Convert.ToInt32(this.g * 255) << 8 ^ Convert.ToInt32(this.b * 255) << 0;
        }

        public string GetHexString()
        {
            var hex = ("000000" + this.GetHex().ToString("{0:X}"));
            return hex.Substring(hex.Length - 6, 6);
        }

        public double[] GetHSL(double[] target = null) // [h, s, l]
        {
            // h,s,l ranges are in 0.0 - 1.0

            if (target == null)
            {
                Console.WriteLine("THREE.Color: .getHSL() target is now required");
                target = new double[] { 0, 0, 0 };
            }

            double r = this.r, g = this.g, b = this.b;

            var max = _Math.Max(_Math.Max(r, g), b);
            var min = _Math.Min(_Math.Max(r, g), b);

            double hue = 0, saturation;
            var lightness = (min + max) / 2.0;

            if (min == max)
            {
                hue = 0;
                saturation = 0;
            }
            else
            {
                var delta = max - min;

                saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

                if (max == r)
                {
                    hue = (g - b) / delta + (g < b ? 6 : 0);
                }
                else if (max == g)
                {
                    hue = (b - r) / delta + 2;
                }
                else if (max == b)
                {
                    hue = (r - g) / delta + 4;
                }

                hue /= 6;
            }

            target = new double[] { hue, saturation, lightness };

            return target;
        }

        public string GetStyle()
        {
            return "rgb(" + _Math.Floor(this.r * 255) + "," + _Math.Floor(this.g * 255) + "," + _Math.Floor(this.b * 255) + ")";
        }

        public Color OffsetHSL(double h, double s, double l)
        {
            var hsl = new double[3];

            this.GetHSL(hsl);

            hsl[0] += h;
            hsl[1] += s;
            hsl[2] += l;

            this.SetHSL(hsl[0], hsl[1], hsl[2]);

            return this;
        }

        public Color Add(Color color)
        {
            this.r += color.r;
            this.g += color.g;
            this.b += color.b;

            return this;
        }

        public Color AddColors(Color color1, Color color2)
        {
            this.r = color1.r + color2.r;
            this.g = color1.g + color2.g;
            this.b = color1.b + color2.b;

            return this;
        }

        public Color AddScalar(double s)
        {
            this.r += s;
            this.g += s;
            this.b += s;

            return this;
        }

        public Color Sub(Color color)
        {
            this.r = _Math.Max(0, this.r - color.r);
            this.g = _Math.Max(0, this.g - color.g);
            this.b = _Math.Max(0, this.b - color.b);

            return this;
        }

        public Color Multiply(Color color)
        {
            this.r *= color.r;
            this.g *= color.g;
            this.b *= color.b;

            return this;
        }

        public Color MultiplyScalar(double s)
        {
            this.r *= s;
            this.g *= s;
            this.b *= s;

            return this;
        }

        public Color Lerp(Color color, double alpha)
        {
            this.r += (color.r - this.r) * alpha;
            this.g += (color.g - this.g) * alpha;
            this.b += (color.b - this.b) * alpha;

            return this;
        }

        public Color LerpHSL(Color color, double alpha)
        {

            var hslA = new double[] { 0, 0, 0 };
            var hslB = new double[] { 0, 0, 0 };

            this.GetHSL(hslA);
            color.GetHSL(hslB);

            var h = Math.Lerp(hslA[0], hslB[0], alpha);
            var s = Math.Lerp(hslA[1], hslB[1], alpha);
            var l = Math.Lerp(hslA[2], hslB[2], alpha);

            this.SetHSL(h, s, l);

            return this;
        }

        public bool Equals(Color c)
        {
            return (c.r == this.r) && (c.g == this.g) && (c.b == this.b);
        }

        public Color FromArray(double[] array, int offset = 0)
        {
            this.r = array[offset];
            this.g = array[offset + 1];
            this.b = array[offset + 2];

            return this;
        }

        public double[] ToArray(double[] array = null, int offset = 0)
        {
            if (array == null) array = new double[3];

            array[offset] = this.r;
            array[offset + 1] = this.g;
            array[offset + 2] = this.b;

            return array;
        }

        public double ToJSON()
        {
            return this.GetHex();
        }
    }
}
