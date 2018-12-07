using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE.Math
{
    public class Vector2
    {
        public double x = 0.0;
        public double y = 0.0;

        public Vector2(double x = 0, double y = 0)
        {
            this.x = x;
            this.y = y;
        }

        public double Width
        {
            get
            {
                return this.x;
            }
            set
            {
                this.x = value;
            }
        }

        public double Height
        {
            get
            {
                return this.y;
            }
            set
            {
                this.y = value;
            }
        }

        public const bool isVector2 = true;

        public Vector2 Set(double x, double y)
        {
            this.x = x;
            this.y = y;
            return this;
        }

        public Vector2 SetScalar(double scalar)
        {
            this.x = scalar;
            this.y = scalar;
            return this;
        }

        public Vector2 SetX(double x)
        {
            this.x = x;
            return this;
        }

        public Vector2 SetY(double y)
        {
            this.y = y;
            return this;
        }

        public Vector2 SetComponent(int index, double value)
        {
            switch (index)
            {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                default:
                    throw new Exception($"index is out of range: {index}");
            }

            return this;
        }

        public double GetComponent(int index)
        {
            switch (index)
            {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                default:
                    throw new Exception($"index is out of range: {index}");
            }
        }

        public Vector2 Clone(Vector2 v)
        {
            this.x = v.x;
            this.y = v.y;

            return this;
        }

        public Vector2 Add(Vector2 v, Vector2 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
                return this.AddVectors(v, w);
            }

            this.x += v.x;
            this.y += v.y;

            return this;
        }

        public Vector2 AddScalar(double s)
        {
            this.x += s;
            this.y += s;

            return this;
        }

        public Vector2 AddVectors(Vector2 a, Vector2 b)
        {
            this.x = a.x + b.x;
            this.y = a.y + b.y;

            return this;
        }

        public Vector2 AddScaledVector(Vector2 v, double s)
        {
            this.x += v.x * s;
            this.y += v.y * s;

            return this;
        }

        public Vector2 Sub(Vector2 v, Vector2 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
                return this.SubVectors(v, w);
            }

            this.x -= v.x;
            this.y -= v.y;

            return this;
        }

        public Vector2 SubScalar(double s)
        {
            this.x -= s;
            this.y -= s;

            return this;
        }

        public Vector2 SubVectors(Vector2 a, Vector2 b)
        {
            this.x = a.x - b.x;
            this.y = a.y - b.y;

            return this;
        }

        public Vector2 Multiply(Vector2 v)
        {
            this.x *= v.x;
            this.y *= v.y;

            return this;
        }

        public Vector2 MultiplyScalar(double scalar)
        {
            this.x *= scalar;
            this.y *= scalar;

            return this;
        }

        public Vector2 Divide(Vector2 v)
        {
            this.x /= v.x;
            this.y /= v.y;

            return this;
        }

        public Vector2 DivideScalar(double scalar)
        {
            return this.MultiplyScalar(1 / scalar);
        }

        public Vector2 ApplyMatrix3(Matrix3 m)
        {
            double x = this.x, y = this.y;
            var e = m.elements;

            this.x = e[0] * x + e[3] * y + e[6];
            this.y = e[1] * x + e[4] * y + e[7];

            return this;
        }

        public Vector2 Min(Vector2 v)
        {
            this.x = _Math.Min(this.x, v.x);
            this.y = _Math.Min(this.y, v.y);

            return this;
        }

        public Vector2 Max(Vector2 v)
        {
            this.x = _Math.Max(this.x, v.x);
            this.y = _Math.Max(this.y, v.y);

            return this;
        }

        public Vector2 Clamp(Vector2 min, Vector2 max)
        {
            // assumes min < max, componentwise
            this.x = _Math.Max(min.x, _Math.Min(max.x, this.x));
            this.y = _Math.Max(min.y, _Math.Min(max.y, this.y));

            return this;
        }

        public Vector2 ClampScalar(double minVal, double maxVal)
        {
            var min = new Vector2();
            var max = new Vector2();

            min.Set(minVal, minVal);
            max.Set(maxVal, maxVal);

            return this.Clamp(min, max);
        }

        public Vector2 ClampLength(double min, double max)
        {
            var length = this.Length();

            return this.DivideScalar(length == 0 ? 1.0 : length).MultiplyScalar(_Math.Max(min, _Math.Min(max, length)));
        }

        public Vector2 Floor()
        {
            this.x = _Math.Floor(this.x);
            this.y = _Math.Floor(this.y);

            return this;
        }

        public Vector2 Ceil()
        {
            this.x = _Math.Ceiling(this.x);
            this.y = _Math.Ceiling(this.y);

            return this;
        }

        public Vector2 Round()
        {
            this.x = _Math.Round(this.x);
            this.y = _Math.Round(this.y);

            return this;
        }

        public Vector2 RoundToZero()
        {
            this.x = (this.x < 0) ? _Math.Ceiling(this.x) : _Math.Floor(this.x);
            this.y = (this.y < 0) ? _Math.Ceiling(this.y) : _Math.Floor(this.y);

            return this;
        }

        public Vector2 Negate()
        {
            this.x = -this.x;
            this.y = -this.y;

            return this;
        }

        public double Dot(Vector2 v)
        {
            return this.x * v.x + this.y * v.y;
        }

        public double Cross(Vector2 v)
        {
            return this.x * v.y - this.y * v.x;
        }

        public double LengthSq()
        {
            return this.x * this.x + this.y * this.y;
        }

        public double Length()
        {
            return _Math.Sqrt(this.x * this.x + this.y * this.y);
        }

        public double ManhattanLength()
        {
            return _Math.Abs(this.x) + _Math.Abs(this.y);
        }

        public Vector2 Normalize()
        {
            var length = this.Length();
            return this.DivideScalar(length == 0 ? 1.0 : length);
        }

        public double Angle()
        {
            // computes the angle in radians with respect to the positive x-axis
            var angle = _Math.Atan2(this.y, this.x);

            if (angle < 0) angle += 2 * _Math.PI;

            return angle;
        }

        public double DistanceTo(Vector2 v)
        {
            return _Math.Sqrt(this.DistanceToSquared(v));
        }

        public double DistanceToSquared(Vector2 v)
        {
            double dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        }

        public double ManhattanDistanceTo(Vector2 v)
        {
            return _Math.Abs(this.x - v.x) + _Math.Abs(this.y - v.y);
        }

        public Vector2 SetLength(double length)
        {
            return this.Normalize().MultiplyScalar(length);
        }

        public Vector2 Lerp(Vector2 v, double alpha)
        {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;

            return this;
        }

        public Vector2 LerpVectors(Vector2 v1, Vector2 v2, double alpha)
        {
            return this.SubVectors(v2, v1).MultiplyScalar(alpha).Add(v1);
        }

        public bool Equals(Vector2 v)
        {
            return (v.x == this.x) && (v.y == this.y);
        }

        public Vector2 FromArray(double[] array, int? offset = null)
        {
            if (offset == null) offset = 0;

            this.x = array[offset.Value];
            this.y = array[offset.Value + 1];

            return this;
        }

        public double[] ToArray(double[] array = null, int? offset = null)
        {

            if (array == null) array = new double[2];
            if (offset == null) offset = 0;

            array[offset.Value] = this.x;
            array[offset.Value + 1] = this.y;

            return array;
        }

        public Vector2 RotateAround(Vector2 center, double angle)
        {
            double c = _Math.Cos(angle), s = _Math.Sin(angle);

            var x = this.x - center.x;
            var y = this.y - center.y;

            this.x = x * c - y * s + center.x;
            this.y = x * s + y * c + center.y;

            return this;
        }
    }
}
