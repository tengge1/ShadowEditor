using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author mikael emtinger / http://gomo.se/
    /// @author alteredq / http://alteredqualia.com/
    /// @author WestLangley / http://github.com/WestLangley
    /// @author bhouston / http://clara.io
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Quaternion
    {
        public double _x;
        public double _y;
        public double _z;
        public double _w;

        public Quaternion(double x = 0.0, double y = 0.0, double z = 0.0, double w = 1.0)
        {
            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;

            this.OnChangeCallback = _OnChangeCallback;
        }

        public Quaternion Slerp(Quaternion qa, Quaternion qb, Quaternion qm, double t)
        {
            return qm.Copy(qa).Slerp(qb, t);
        }

        public void SlerpFlat(double[] dst, int dstOffset, double[] src0, int srcOffset0, double[] src1, int srcOffset1, double t)
        {
            // fuzz-free, array-based Quaternion SLERP operation

            double x0 = src0[srcOffset0 + 0],
                y0 = src0[srcOffset0 + 1],
                z0 = src0[srcOffset0 + 2],
                w0 = src0[srcOffset0 + 3],

                x1 = src1[srcOffset1 + 0],
                y1 = src1[srcOffset1 + 1],
                z1 = src1[srcOffset1 + 2],
                w1 = src1[srcOffset1 + 3];

            if (w0 != w1 || x0 != x1 || y0 != y1 || z0 != z1)
            {
                double s = 1 - t,
                    cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

                    dir = (cos >= 0 ? 1 : -1),
                    sqrSin = 1 - cos * cos;

                // Skip the Slerp for tiny steps to avoid numeric problems:
                if (sqrSin > double.Epsilon)
                {
                    double sin = _Math.Sqrt(sqrSin),
                        len = _Math.Atan2(sin, cos * dir);

                    s = _Math.Sin(s * len) / sin;
                    t = _Math.Sin(t * len) / sin;
                }

                var tDir = t * dir;

                x0 = x0 * s + x1 * tDir;
                y0 = y0 * s + y1 * tDir;
                z0 = z0 * s + z1 * tDir;
                w0 = w0 * s + w1 * tDir;

                // Normalize in case we just did a lerp:
                if (s == 1 - t)
                {
                    var f = 1 / _Math.Sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

                    x0 *= f;
                    y0 *= f;
                    z0 *= f;
                    w0 *= f;
                }
            }

            dst[dstOffset] = x0;
            dst[dstOffset + 1] = y0;
            dst[dstOffset + 2] = z0;
            dst[dstOffset + 3] = w0;
        }

        public double X
        {
            get { return this._x; }

            set
            {
                this._x = value;
                this.OnChangeCallback();
            }
        }

        public double Y
        {
            get { return this._y; }

            set
            {

                this._y = value;
                this.OnChangeCallback();

            }
        }

        public double Z
        {
            get { return this._z; }

            set
            {
                this._z = value;
                this.OnChangeCallback();
            }
        }

        public double W
        {
            get { return this._w; }

            set
            {
                this._w = value;
                this.OnChangeCallback();
            }
        }

        public Quaternion Set(double x, double y, double z, double w)
        {
            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;

            this.OnChangeCallback();

            return this;
        }

        public Quaternion Clone()
        {
            return new Quaternion(this._x, this._y, this._z, this._w);
        }

        public Quaternion Copy(Quaternion quaternion)
        {
            this._x = quaternion._x;
            this._y = quaternion._y;
            this._z = quaternion._z;
            this._w = quaternion._w;

            this.OnChangeCallback();

            return this;
        }

        public Quaternion SetFromEuler(Euler euler, bool update = false)
        {
            double x = euler._x, y = euler._y, z = euler._z;
            string order = euler._order;

            // http://www.mathworks.com/matlabcentral/fileexchange/
            // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
            //	content/SpinCalc.m

            var c1 = _Math.Cos(x / 2);
            var c2 = _Math.Cos(y / 2);
            var c3 = _Math.Cos(z / 2);

            var s1 = _Math.Sin(x / 2);
            var s2 = _Math.Sin(y / 2);
            var s3 = _Math.Sin(z / 2);

            if (order == "XYZ")
            {
                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;
            }
            else if (order == "YXZ")
            {
                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;
            }
            else if (order == "ZXY")
            {
                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;
            }
            else if (order == "ZYX")
            {
                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;
            }
            else if (order == "YZX")
            {
                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;
            }
            else if (order == "XZY")
            {
                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;
            }

            if (update != false) this.OnChangeCallback();

            return this;
        }

        public Quaternion SetFromAxisAngle(Vector3 axis, double angle)
        {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

            // assumes axis is normalized

            double halfAngle = angle / 2, s = _Math.Sin(halfAngle);

            this._x = axis.x * s;
            this._y = axis.y * s;
            this._z = axis.z * s;
            this._w = _Math.Cos(halfAngle);

            this.OnChangeCallback();

            return this;
        }

        public Quaternion SetFromRotationMatrix(Matrix4 m)
        {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            double[] te = m.elements;

            double m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],

            trace = m11 + m22 + m33,
            s;

            if (trace > 0)
            {
                s = 0.5 / _Math.Sqrt(trace + 1.0);

                this._w = 0.25 / s;
                this._x = (m32 - m23) * s;
                this._y = (m13 - m31) * s;
                this._z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33)
            {
                s = 2.0 * _Math.Sqrt(1.0 + m11 - m22 - m33);

                this._w = (m32 - m23) / s;
                this._x = 0.25 * s;
                this._y = (m12 + m21) / s;
                this._z = (m13 + m31) / s;
            }
            else if (m22 > m33)
            {
                s = 2.0 * _Math.Sqrt(1.0 + m22 - m11 - m33);

                this._w = (m13 - m31) / s;
                this._x = (m12 + m21) / s;
                this._y = 0.25 * s;
                this._z = (m23 + m32) / s;

            }
            else
            {
                s = 2.0 * _Math.Sqrt(1.0 + m33 - m11 - m22);

                this._w = (m21 - m12) / s;
                this._x = (m13 + m31) / s;
                this._y = (m23 + m32) / s;
                this._z = 0.25 * s;
            }

            this.OnChangeCallback();

            return this;
        }

        public Quaternion SetFromUnitVectors(Vector3 vFrom, Vector3 vTo)
        {
            // assumes direction vectors vFrom and vTo are normalized
            var v1 = new Vector3();
            var EPS = 0.000001;

            double r = vFrom.Dot(vTo) + 1;

            if (r < EPS)
            {
                r = 0;

                if (_Math.Abs(vFrom.x) > _Math.Abs(vFrom.z))
                {
                    v1.Set(-vFrom.y, vFrom.x, 0);
                }
                else
                {
                    v1.Set(0, -vFrom.z, vFrom.y);
                }
            }
            else
            {
                v1.CrossVectors(vFrom, vTo);
            }

            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;

            return this.Normalize();
        }

        public double AngleTo(Quaternion q)
        {
            return 2 * _Math.Acos(_Math.Abs(Math.Clamp(this.Dot(q), -1, 1)));
        }

        public Quaternion RotateTowards(Quaternion q, double step)
        {
            var angle = this.AngleTo(q);

            if (angle == 0) return this;

            var t = _Math.Min(1, step / angle);

            this.Slerp(q, t);

            return this;
        }

        public Quaternion Inverse()
        {
            // quaternion is assumed to have unit length
            return this.Conjugate();
        }

        public Quaternion Conjugate()
        {
            this._x *= -1;
            this._y *= -1;
            this._z *= -1;

            this.OnChangeCallback();

            return this;
        }

        public double Dot(Quaternion v)
        {
            return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
        }

        public double LengthSq()
        {
            return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
        }

        public double Length()
        {
            return _Math.Sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
        }

        public Quaternion Normalize()
        {
            var l = this.Length();

            if (l == 0)
            {

                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._w = 1;

            }
            else
            {

                l = 1 / l;

                this._x = this._x * l;
                this._y = this._y * l;
                this._z = this._z * l;
                this._w = this._w * l;

            }

            this.OnChangeCallback();

            return this;
        }

        public Quaternion Multiply(Quaternion q, Quaternion p = null)
        {
            if (p != null)
            {
                Console.WriteLine("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.");
                return this.MultiplyQuaternions(q, p);
            }

            return this.MultiplyQuaternions(this, q);
        }

        public Quaternion Premultiply(Quaternion q)
        {
            return this.MultiplyQuaternions(q, this);
        }

        public Quaternion MultiplyQuaternions(Quaternion a, Quaternion b)
        {
            // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

            double qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
            double qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

            this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            this.OnChangeCallback();

            return this;
        }

        public Quaternion Slerp(Quaternion qb, double t)
        {
            if (t == 0) return this;
            if (t == 1) return this.Copy(qb);

            double x = this._x, y = this._y, z = this._z, w = this._w;

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

            var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

            if (cosHalfTheta < 0)
            {
                this._w = -qb._w;
                this._x = -qb._x;
                this._y = -qb._y;
                this._z = -qb._z;

                cosHalfTheta = -cosHalfTheta;
            }
            else
            {
                this.Copy(qb);
            }

            if (cosHalfTheta >= 1.0)
            {
                this._w = w;
                this._x = x;
                this._y = y;
                this._z = z;

                return this;
            }

            var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

            if (sqrSinHalfTheta <= double.Epsilon)
            {
                var s = 1 - t;
                this._w = s * w + t * this._w;
                this._x = s * x + t * this._x;
                this._y = s * y + t * this._y;
                this._z = s * z + t * this._z;

                return this.Normalize();
            }

            var sinHalfTheta = _Math.Sqrt(sqrSinHalfTheta);
            var halfTheta = _Math.Atan2(sinHalfTheta, cosHalfTheta);
            double ratioA = _Math.Sin((1 - t) * halfTheta) / sinHalfTheta,
                ratioB = _Math.Sin(t * halfTheta) / sinHalfTheta;

            this._w = (w * ratioA + this._w * ratioB);
            this._x = (x * ratioA + this._x * ratioB);
            this._y = (y * ratioA + this._y * ratioB);
            this._z = (z * ratioA + this._z * ratioB);

            this.OnChangeCallback();

            return this;
        }

        public bool Equals(Quaternion quaternion)
        {
            return quaternion._x == this._x && quaternion._y == this._y && quaternion._z == this._z && quaternion._w == this._w;
        }

        public Quaternion FromArray(double[] array, int offset = 0)
        {
            this._x = array[offset];
            this._y = array[offset + 1];
            this._z = array[offset + 2];
            this._w = array[offset + 3];

            this.OnChangeCallback();

            return this;
        }

        public double[] ToArray(double[] array = null, int offset = 0)
        {
            if (array == null) array = new double[4];

            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            array[offset + 3] = this._w;

            return array;
        }

        public Quaternion OnChange(OnChangeCallbackFunc callback)
        {
            this.OnChangeCallback = callback;

            return this;
        }

        public delegate void OnChangeCallbackFunc();

        private void _OnChangeCallback()
        {

        }

        public OnChangeCallbackFunc OnChangeCallback;
    }
}
