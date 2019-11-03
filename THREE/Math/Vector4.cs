using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author supereggbert / http://www.paulbrunt.co.uk/
    /// @author philogb / http://blog.thejit.org/
    /// @author mikael emtinger / http://gomo.se/
    /// @author egraether / http://egraether.com/
    /// @author WestLangley / http://github.com/WestLangley
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Vector4
    {
        public double x;
        public double y;
        public double z;
        public double w;

        public Vector4(double x = 0.0, double y = 0.0, double z = 0.0, double w = 1.0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public const bool isVector4 = true;

        public Vector4 Set(double x, double y, double z, double w)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;

            return this;
        }

        public Vector4 SetScalar(double scalar)
        {
            this.x = scalar;
            this.y = scalar;
            this.z = scalar;
            this.w = scalar;

            return this;
        }

        public Vector4 SetX(double x)
        {
            this.x = x;

            return this;
        }

        public Vector4 SetY(double y)
        {
            this.y = y;

            return this;
        }

        public Vector4 SetZ(double z)
        {
            this.z = z;

            return this;
        }

        public Vector4 SetW(double w)
        {
            this.w = w;

            return this;
        }

        public Vector4 SetComponent(int index, double value)
        {
            switch (index)
            {
                case 0: this.x = value; break;
                case 1: this.y = value; break;
                case 2: this.z = value; break;
                case 3: this.w = value; break;
                default: throw new Exception("index is out of range: " + index);
            }

            return this;
        }

        public double GetComponent(int index)
        {
            switch (index)
            {
                case 0: return this.x;
                case 1: return this.y;
                case 2: return this.z;
                case 3: return this.w;
                default: throw new Exception("index is out of range: " + index);
            }
        }

        public Vector4 Clone()
        {
            return new Vector4(this.x, this.y, this.z, this.w);
        }

        public Vector4 Copy(Vector4 v)
        {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;

            return this;
        }

        public Vector4 Add(Vector4 v, Vector4 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
                return this.AddVectors(v, w);
            }

            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += v.w;

            return this;
        }

        public Vector4 AddScalar(double s)
        {
            this.x += s;
            this.y += s;
            this.z += s;
            this.w += s;

            return this;
        }

        public Vector4 AddVectors(Vector4 a, Vector4 b)
        {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;

            return this;
        }

        public Vector4 AddScaledVector(Vector4 v, double s)
        {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;
            this.w += v.w * s;

            return this;
        }

        public Vector4 Sub(Vector4 v, Vector4 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
                return this.SubVectors(v, w);
            }

            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            this.w -= v.w;

            return this;
        }

        public Vector4 SubScalar(double s)
        {
            this.x -= s;
            this.y -= s;
            this.z -= s;
            this.w -= s;

            return this;
        }

        public Vector4 SubVectors(Vector4 a, Vector4 b)
        {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;

            return this;
        }

        public Vector4 MultiplyScalar(double scalar)
        {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            this.w *= scalar;

            return this;
        }

        public Vector4 ApplyMatrix4(Matrix4 m)
        {
            double x = this.x, y = this.y, z = this.z, w = this.w;
            double[] e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
            this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

            return this;
        }

        public Vector4 DivideScalar(double scalar)
        {
            return this.MultiplyScalar(1 / scalar);
        }

        public Vector4 SetAxisAngleFromQuaternion(Quaternion q)
        {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

            // q is assumed to be normalized

            this.w = 2 * _Math.Acos(q._w);

            var s = _Math.Sqrt(1 - q._w * q._w);

            if (s < 0.0001)
            {
                this.x = 1;
                this.y = 0;
                this.z = 0;
            }
            else
            {
                this.x = q._x / s;
                this.y = q._y / s;
                this.z = q._z / s;
            }

            return this;
        }

        public Vector4 SetAxisAngleFromRotationMatrix(Matrix4 m)
        {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            double angle, x, y, z,     // variables for result
                epsilon = 0.01,     // margin to allow for rounding errors
                epsilon2 = 0.1;     // margin to distinguish between 0 and 180 degrees

            double[] te = m.elements;

            double m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10];

            if ((_Math.Abs(m12 - m21) < epsilon) &&
                 (_Math.Abs(m13 - m31) < epsilon) &&
                 (_Math.Abs(m23 - m32) < epsilon))
            {
                // singularity found
                // first check for identity matrix which must have +1 for all terms
                // in leading diagonal and zero in other terms

                if ((_Math.Abs(m12 + m21) < epsilon2) &&
                     (_Math.Abs(m13 + m31) < epsilon2) &&
                     (_Math.Abs(m23 + m32) < epsilon2) &&
                     (_Math.Abs(m11 + m22 + m33 - 3) < epsilon2))
                {
                    // this singularity is identity matrix so angle = 0

                    this.Set(1, 0, 0, 0);

                    return this; // zero angle, arbitrary axis
                }

                // otherwise this singularity is angle = 180
                angle = _Math.PI;

                var xx = (m11 + 1) / 2;
                var yy = (m22 + 1) / 2;
                var zz = (m33 + 1) / 2;
                var xy = (m12 + m21) / 4;
                var xz = (m13 + m31) / 4;
                var yz = (m23 + m32) / 4;

                if ((xx > yy) && (xx > zz))
                {
                    // m11 is the largest diagonal term

                    if (xx < epsilon)
                    {
                        x = 0;
                        y = 0.707106781;
                        z = 0.707106781;
                    }
                    else
                    {
                        x = _Math.Sqrt(xx);
                        y = xy / x;
                        z = xz / x;
                    }
                }
                else if (yy > zz)
                {
                    // m22 is the largest diagonal term

                    if (yy < epsilon)
                    {
                        x = 0.707106781;
                        y = 0;
                        z = 0.707106781;
                    }
                    else
                    {
                        y = _Math.Sqrt(yy);
                        x = xy / y;
                        z = yz / y;
                    }
                }
                else
                {
                    // m33 is the largest diagonal term so base result on this

                    if (zz < epsilon)
                    {
                        x = 0.707106781;
                        y = 0.707106781;
                        z = 0;
                    }
                    else
                    {
                        z = _Math.Sqrt(zz);
                        x = xz / z;
                        y = yz / z;
                    }
                }

                this.Set(x, y, z, angle);

                return this; // return 180 deg rotation
            }

            // as we have reached here there are no singularities so we can handle normally

            var s = _Math.Sqrt((m32 - m23) * (m32 - m23) +
                               (m13 - m31) * (m13 - m31) +
                               (m21 - m12) * (m21 - m12)); // used to normalize

            if (_Math.Abs(s) < 0.001) s = 1;

            // prevent divide by zero, should not happen if matrix is orthogonal and should be
            // caught by singularity test above, but I've left it in just in case

            this.x = (m32 - m23) / s;
            this.y = (m13 - m31) / s;
            this.z = (m21 - m12) / s;
            this.w = _Math.Acos((m11 + m22 + m33 - 1) / 2);

            return this;
        }

        public Vector4 Min(Vector4 v)
        {
            this.x = _Math.Min(this.x, v.x);
            this.y = _Math.Min(this.y, v.y);
            this.z = _Math.Min(this.z, v.z);
            this.w = _Math.Min(this.w, v.w);

            return this;
        }

        public Vector4 Max(Vector4 v)
        {
            this.x = _Math.Max(this.x, v.x);
            this.y = _Math.Max(this.y, v.y);
            this.z = _Math.Max(this.z, v.z);
            this.w = _Math.Max(this.w, v.w);

            return this;
        }

        public Vector4 Clamp(Vector4 min, Vector4 max)
        {
            // assumes min < max, componentwise

            this.x = _Math.Max(min.x, _Math.Min(max.x, this.x));
            this.y = _Math.Max(min.y, _Math.Min(max.y, this.y));
            this.z = _Math.Max(min.z, _Math.Min(max.z, this.z));
            this.w = _Math.Max(min.w, _Math.Min(max.w, this.w));

            return this;
        }

        public Vector4 ClampScalar(double minVal, double maxVal)
        {
            Vector4 min = new Vector4(), max = new Vector4();

            min.Set(minVal, minVal, minVal, minVal);
            max.Set(maxVal, maxVal, maxVal, maxVal);

            return this.Clamp(min, max);
        }

        public Vector4 ClampLength(double min, double max)
        {
            var length = this.Length();

            return this.DivideScalar(length == 0 ? 1 : 0).MultiplyScalar(_Math.Max(min, _Math.Min(max, length)));
        }

        public Vector4 Floor()
        {
            this.x = _Math.Floor(this.x);
            this.y = _Math.Floor(this.y);
            this.z = _Math.Floor(this.z);
            this.w = _Math.Floor(this.w);

            return this;
        }

        public Vector4 Ceil()
        {
            this.x = _Math.Ceiling(this.x);
            this.y = _Math.Ceiling(this.y);
            this.z = _Math.Ceiling(this.z);
            this.w = _Math.Ceiling(this.w);

            return this;
        }

        public Vector4 Round()
        {
            this.x = _Math.Round(this.x);
            this.y = _Math.Round(this.y);
            this.z = _Math.Round(this.z);
            this.w = _Math.Round(this.w);

            return this;
        }

        public Vector4 RoundToZero()
        {
            this.x = (this.x < 0) ? _Math.Ceiling(this.x) : _Math.Floor(this.x);
            this.y = (this.y < 0) ? _Math.Ceiling(this.y) : _Math.Floor(this.y);
            this.z = (this.z < 0) ? _Math.Ceiling(this.z) : _Math.Floor(this.z);
            this.w = (this.w < 0) ? _Math.Ceiling(this.w) : _Math.Floor(this.w);

            return this;
        }

        public Vector4 Negate()
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;

            return this;
        }

        public double Dot(Vector4 v)
        {
            return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
        }

        public double LengthSq()
        {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        }

        public double Length()
        {
            return _Math.Sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }

        public double ManhattanLength()
        {
            return _Math.Abs(this.x) + _Math.Abs(this.y) + _Math.Abs(this.z) + _Math.Abs(this.w);
        }

        public Vector4 Normalize()
        {
            var len = this.Length();

            return this.DivideScalar(len == 0 ? 1 : len);
        }

        public Vector4 SetLength(double length)
        {
            return this.Normalize().MultiplyScalar(length);
        }

        public Vector4 Lerp(Vector4 v, double alpha)
        {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            this.w += (v.w - this.w) * alpha;

            return this;
        }

        public Vector4 LerpVectors(Vector4 v1, Vector4 v2, double alpha)
        {
            return this.SubVectors(v2, v1).MultiplyScalar(alpha).Add(v1);
        }

        public bool Equals(Vector4 v)
        {
            return v.x == this.x && v.y == this.y && v.z == this.z && v.w == this.w;
        }

        public Vector4 FromArray(double[] array, int offset = 0)
        {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            this.w = array[offset + 3];

            return this;
        }

        double[] ToArray(double[] array = null, int offset = 0)
        {
            if (array == null) array = new double[4];

            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            array[offset + 3] = this.w;

            return array;
        }
    }
}
