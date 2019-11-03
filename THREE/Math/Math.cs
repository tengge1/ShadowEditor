using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author alteredq / http://alteredqualia.com/
    /// @author mrdoob / http://mrdoob.com/
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Math
    {
        public static double DEG2RAD = _Math.PI / 180;
        public static double RAD2DEG = 180 / _Math.PI;

        public static string GenerateUUID()
        {
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

            var lut = new string[256];

            for (var i = 0; i < 256; i++)
            {
                lut[i] = (i < 16 ? "0" : "") + i.ToString("0:X");
            }

            var ran = new Random();

            var d0 = ran.NextDouble() * 0xffffffff;
            var d1 = ran.NextDouble() * 0xffffffff;
            var d2 = ran.NextDouble() * 0xffffffff;
            var d3 = ran.NextDouble() * 0xffffffff;

            int n0 = Convert.ToInt32(d0 > 0 ? _Math.Floor(d0) : _Math.Ceiling(d0));
            int n1 = Convert.ToInt32(d1 > 0 ? _Math.Floor(d1) : _Math.Ceiling(d1));
            int n2 = Convert.ToInt32(d2 > 0 ? _Math.Floor(d2) : _Math.Ceiling(d2));
            int n3 = Convert.ToInt32(d3 > 0 ? _Math.Floor(d3) : _Math.Ceiling(d3));

            var uuid = lut[n0 & 0xff] + lut[n0 >> 8 & 0xff] + lut[n0 >> 16 & 0xff] + lut[n0 >> 24 & 0xff] + '-' +
                lut[n1 & 0xff] + lut[n1 >> 8 & 0xff] + '-' + lut[n1 >> 16 & 0x0f | 0x40] + lut[n1 >> 24 & 0xff] + '-' +
                lut[n2 & 0x3f | 0x80] + lut[n2 >> 8 & 0xff] + '-' + lut[n2 >> 16 & 0xff] + lut[n2 >> 24 & 0xff] +
                lut[n3 & 0xff] + lut[n3 >> 8 & 0xff] + lut[n3 >> 16 & 0xff] + lut[n3 >> 24 & 0xff];

            // .toUpperCase() here flattens concatenated strings to save heap memory space.
            return uuid.ToUpper();
        }

        public static double Clamp(double value, double min, double max)
        {
            return _Math.Max(min, _Math.Min(max, value));
        }

        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        public static double EuclideanModulo(double n, double m)
        {
            return ((n % m) + m) % m;
        }

        // Linear mapping from range <a1, a2> to range <b1, b2>

        public static double MapLinear(double x, double a1, double a2, double b1, double b2)
        {
            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        }

        // https://en.wikipedia.org/wiki/Linear_interpolation
        public static double Lerp(double x, double y, double t)
        {
            return (1 - t) * x + t * y;
        }

        // http://en.wikipedia.org/wiki/Smoothstep

        public static double Smoothstep(double x, double min, double max)
        {
            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * (3 - 2 * x);
        }

        public double Smootherstep(double x, double min, double max)
        {
            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * x * (x * (x * 6 - 15) + 10);
        }

        // Random integer from <low, high> interval
        public static double RandInt(double low, double high)
        {
            var ran = new Random();
            return low + _Math.Floor(ran.NextDouble() * (high - low + 1));
        }

        // Random float from <low, high> interval
        public static double RandFloat(double low, double high)
        {
            var ran = new Random();
            return low + ran.NextDouble() * (high - low);
        }

        // Random float from <-range/2, range/2> interval
        public static double RandFloatSpread(double range)
        {
            var ran = new Random();
            return range * (0.5 - ran.NextDouble());
        }

        public static double DegToRad(double degrees)
        {
            return degrees * Math.DEG2RAD;
        }

        public static double RadToDeg(double radians)
        {
            return radians * Math.RAD2DEG;
        }

        public static bool IsPowerOfTwo(int value)
        {
            return (value & (value - 1)) == 0 && value != 0;
        }

        public static double CeilPowerOfTwo(double value)
        {
            return _Math.Pow(2, _Math.Ceiling(_Math.Log(value) / _Math.Log(2)));
        }

        public static double FloorPowerOfTwo(double value)
        {
            return _Math.Pow(2, _Math.Floor(_Math.Log(value) / _Math.Log(2)));
        }
    }
}
