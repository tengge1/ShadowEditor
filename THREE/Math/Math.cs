using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    public class Math
    {
        public static double DEG2RAD = _Math.PI / 180;
        public static double RAD2DEG = 180 / _Math.PI;

        public static int operator |(double d, int zero)
        {
            return Convert.ToInt32(d > 0 ? _Math.Floor(d) : _Math.Ceiling(d));
        }

        public static string GenerateUUID()
        {
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

            var lut = new string[256];

            for (var i = 0; i < 256; i++)
            {
                lut[i] = (i < 16 ? "0" : "") + i.ToString("0:X");
            }

            var ran = new Random();

            var d0 = ran.NextDouble() * 0xffffffff | 0;
            var d1 = ran.NextDouble() * 0xffffffff | 0;
            var d2 = ran.NextDouble() * 0xffffffff | 0;
            var d3 = ran.NextDouble() * 0xffffffff | 0;

            var uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];

            // .toUpperCase() here flattens concatenated strings to save heap memory space.
            return uuid.ToUpperCase();
        }

        public Clamp(value, min, max )
        {

            return Math.max(min, Math.min(max, value));

        },

	// compute euclidian modulo of m % n
	// https://en.wikipedia.org/wiki/Modulo_operation

	euclideanModulo(n, m )
        {

            return ((n % m) + m) % m;

        },

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear(x, a1, a2, b1, b2 )
        {

            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);

        },

	// https://en.wikipedia.org/wiki/Linear_interpolation

	lerp(x, y, t )
        {

            return (1 - t) * x + t * y;

        },

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep(x, min, max )
        {

            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * (3 - 2 * x);

        },

	smootherstep(x, min, max )
        {

            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * x * (x * (x * 6 - 15) + 10);

        },

	// Random integer from <low, high> interval

	randInt(low, high )
        {

            return low + Math.floor(Math.random() * (high - low + 1));

        },

	// Random float from <low, high> interval

	randFloat(low, high )
        {

            return low + Math.random() * (high - low);

        },

	// Random float from <-range/2, range/2> interval

	randFloatSpread(range )
        {

            return range * (0.5 - Math.random());

        },

	degToRad(degrees )
        {

            return degrees * _Math.DEG2RAD;

        },

	radToDeg(radians )
        {

            return radians * _Math.RAD2DEG;

        },

	isPowerOfTwo(value )
        {

            return (value & (value - 1)) === 0 && value !== 0;

        },

	ceilPowerOfTwo(value )
        {

            return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));

        },

	floorPowerOfTwo(value )
        {

            return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));

        }
    }
}
