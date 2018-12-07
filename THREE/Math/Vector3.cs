using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author mrdoob / http://mrdoob.com/
    /// @author kile / http://kile.stravaganza.org/
    /// @author philogb / http://blog.thejit.org/
    /// @author mikael emtinger / http://gomo.se/
    /// @author egraether / http://egraether.com/
    /// @author WestLangley / http://github.com/WestLangley
    /// </summary>
    public class Vector3
    {
        public double x = 0.0;
        public double y = 0.0;
        public double z = 0.0;

        public Vector3(double x = 0.0, double y = 0.0, double z = 0.0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public const bool isVector3 = true;

        public Vector3 Set(double x, double y, double z)
        {
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        }

        public Vector3 SetScalar(double scalar)
        {
            this.x = scalar;
            this.y = scalar;
            this.z = scalar;

            return this;
        }

        public Vector3 SetX(double x)
        {
            this.x = x;

            return this;
        }

        public Vector3 SetY(double y)
        {
            this.y = y;

            return this;
        }

        public Vector3 SetZ(double z)
        {
            this.z = z;

            return this;
        }

        public Vector3 SetComponent(int index, double value)
        {
            switch (index)
            {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                case 2:
                    this.z = value;
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
                case 2:
                    return this.z;
                default:
                    throw new Exception($"index is out of range: {index}");
            }
        }

        public Vector3 Clone()
        {
            return new Vector3(this.x, this.y, this.z);
        }

        public Vector3 Copy(Vector3 v)
        {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;
        }

        public Vector3 Add(Vector3 v, Vector3 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
                return this.AddVectors(v, w);
            }

            this.x += v.x;
            this.y += v.y;
            this.z += v.z;

            return this;
        }

        public Vector3 AddScalar(double s)
        {
            this.x += s;
            this.y += s;
            this.z += s;

            return this;
        }

        public Vector3 AddVectors(Vector3 a, Vector3 b)
        {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;

            return this;
        }

        public Vector3 AddScaledVector(Vector3 v, double s)
        {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;

            return this;
        }

        public Vector3 Sub(Vector3 v, Vector3 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
                return this.SubVectors(v, w);
            }

            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;

            return this;
        }

        public Vector3 SubScalar(double s)
        {
            this.x -= s;
            this.y -= s;
            this.z -= s;

            return this;
        }

        public Vector3 SubVectors(Vector3 a, Vector3 b)
        {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;

            return this;
        }

        public Vector3 Multiply(Vector3 v, Vector3 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.");
                return this.MultiplyVectors(v, w);
            }

            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;

            return this;
        }

        public Vector3 MultiplyScalar(double scalar)
        {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;

            return this;
        }

        public Vector3 MultiplyVectors(Vector3 a, Vector3 b)
        {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;

            return this;
        }

        public Vector3 ApplyEuler(Euler euler)
        {
            if (!(euler && euler.isEuler))
            {
                Console.WriteLine("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.");
            }

            var quaternion = new Quaternion();

            return this.ApplyQuaternion(quaternion.SetFromEuler(euler));
        }

        public Vector3 ApplyAxisAngle(Vector3 axis, double angle)
        {
            var quaternion = new Quaternion();

            return this.ApplyQuaternion(quaternion.SetFromAxisAngle(axis, angle));
        }

        public Vector3 ApplyMatrix3(Matrix3 m)
        {

            double x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[3] * y + e[6] * z;
            this.y = e[1] * x + e[4] * y + e[7] * z;
            this.z = e[2] * x + e[5] * y + e[8] * z;

            return this;
        }

        public Vector3 ApplyMatrix4(Matrix4 m)
        {
            double x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

            return this;
        }

        public Vector3 ApplyQuaternion(Quaternion q)
        {
            double x = this.x, y = this.y, z = this.z;
            double qx = q.x, qy = q.y, qz = q.z, qw = q.w;

            // calculate quat * vector
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;

            // calculate result * inverse quat
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

            return this;
        }

        //public Project(camera )
        //  {
        //      return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
        //  },

        //public Unproject()
        //  {
        //      var matrix = new Matrix4();

        //      return this.ApplyMatrix4(matrix.GetInverse(Camera.projectionMatrix)).applyMatrix4(Camera.matrixWorld);
        //  }

        public Vector3 TransformDirection(Matrix4 m)
        {
            // input: THREE.Matrix4 affine matrix
            // vector interpreted as a direction

            double x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z;
            this.y = e[1] * x + e[5] * y + e[9] * z;
            this.z = e[2] * x + e[6] * y + e[10] * z;

            return this.Normalize();
        }

        public Vector3 Divide(Vector3 v)
        {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;

            return this;
        }

        public Vector3 DivideScalar(double scalar)
        {
            return this.MultiplyScalar(1 / scalar);
        }

        public Vector3 Min(Vector3 v)
        {

            this.x = _Math.Min(this.x, v.x);
            this.y = _Math.Min(this.y, v.y);
            this.z = _Math.Min(this.z, v.z);

            return this;
        }

        public Vector3 Max(Vector3 v)
        {
            this.x = _Math.Max(this.x, v.x);
            this.y = _Math.Max(this.y, v.y);
            this.z = _Math.Max(this.z, v.z);

            return this;
        }

        public Vector3 Clamp(Vector3 min, Vector3 max)
        {
            // assumes min < max, componentwise

            this.x = _Math.Max(min.x, _Math.Min(max.x, this.x));
            this.y = _Math.Max(min.y, _Math.Min(max.y, this.y));
            this.z = _Math.Max(min.z, _Math.Min(max.z, this.z));

            return this;
        }

        public Vector3 ClampScalar(double minVal, double maxVal)
        {
            var min = new Vector3();
            var max = new Vector3();

            min.Set(minVal, minVal, minVal);
            max.Set(maxVal, maxVal, maxVal);

            return this.Clamp(min, max);
        }

        public Vector3 ClampLength(double min, double max)
        {
            var length = this.Length();

            return this.DivideScalar(length == 0 ? 1.0 : length).MultiplyScalar(_Math.Max(min, _Math.Min(max, length)));
        }

        public Vector3 Floor()
        {
            this.x = _Math.Floor(this.x);
            this.y = _Math.Floor(this.y);
            this.z = _Math.Floor(this.z);

            return this;
        }

        public Vector3 Ceil()
        {
            this.x = _Math.Ceiling(this.x);
            this.y = _Math.Ceiling(this.y);
            this.z = _Math.Ceiling(this.z);

            return this;
        }

        public Vector3 Round()
        {
            this.x = _Math.Round(this.x);
            this.y = _Math.Round(this.y);
            this.z = _Math.Round(this.z);

            return this;
        }

        public Vector3 RoundToZero()
        {
            this.x = (this.x < 0) ? _Math.Ceiling(this.x) : _Math.Floor(this.x);
            this.y = (this.y < 0) ? _Math.Ceiling(this.y) : _Math.Floor(this.y);
            this.z = (this.z < 0) ? _Math.Ceiling(this.z) : _Math.Floor(this.z);

            return this;
        }

        public Vector3 Negate()
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;

            return this;
        }

        public double Dot(Vector3 v)
        {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        // TODO lengthSquared?

        public double LengthSq()
        {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        public double Length()
        {
            return _Math.Sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        public double ManhattanLength()
        {
            return _Math.Abs(this.x) + _Math.Abs(this.y) + _Math.Abs(this.z);
        }

        public Vector3 Normalize()
        {
            var length = this.Length();

            return this.DivideScalar(length == 0 ? 1.0 : length);
        }

        public Vector3 SetLength(double length)
        {
            return this.Normalize().MultiplyScalar(length);
        }

        public Vector3 Lerp(Vector3 v, double alpha)
        {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;

            return this;
        }

        public Vector3 LerpVectors(Vector3 v1, Vector3 v2, double alpha)
        {
            return this.SubVectors(v2, v1).MultiplyScalar(alpha).Add(v1);
        }

        public Vector3 Cross(Vector3 v, Vector3 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.");
                return this.CrossVectors(v, w);
            }

            return this.CrossVectors(this, v);
        }

        public Vector3 CrossVectors(Vector3 a, Vector3 b)
        {
            double ax = a.x, ay = a.y, az = a.z;
            double bx = b.x, by = b.y, bz = b.z;

            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;

            return this;
        }

        public Vector3 ProjectOnVector(Vector3 vector)
        {
            var scalar = vector.Dot(this) / vector.LengthSq();

            return this.Copy(vector).MultiplyScalar(scalar);
        }

        public Vector3 ProjectOnPlane(Vector3 planeNormal)
        {
            var v1 = new Vector3();

            v1.Copy(this).ProjectOnVector(planeNormal);

            return this.Sub(v1);
        }

        public Vector3 Reflect(Vector3 normal)
        {
            // reflect incident vector off plane orthogonal to normal
            // normal is assumed to have unit length
            var v1 = new Vector3();

            return this.Sub(v1.Copy(normal).MultiplyScalar(2 * this.Dot(normal)));
        }

        public double AngleTo(Vector3 v)
        {
            var theta = this.Dot(v) / (_Math.Sqrt(this.LengthSq() * v.LengthSq()));

            // clamp, to handle numerical problems
            return _Math.Cos(Math.Clamp(theta, -1, 1));
        }

        public double DistanceTo(Vector3 v)
        {
            return _Math.Sqrt(this.DistanceToSquared(v));
        }

        public double DistanceToSquared(Vector3 v)
        {
            double dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

            return dx * dx + dy * dy + dz * dz;
        }

        public double ManhattanDistanceTo(Vector3 v)
        {
            return _Math.Abs(this.x - v.x) + _Math.Abs(this.y - v.y) + _Math.Abs(this.z - v.z);
        }

        public Vector3 SetFromSpherical(Spherical s)
        {
            return this.SetFromSphericalCoords(s.radius, s.phi, s.theta);
        }

        public Vector3 SetFromSphericalCoords(double radius, double phi, double theta)
        {
            var sinPhiRadius = _Math.Sin(phi) * radius;

            this.x = sinPhiRadius * _Math.Sin(theta);
            this.y = _Math.Cos(phi) * radius;
            this.z = sinPhiRadius * _Math.Cos(theta);

            return this;
        }

        public Vector3 SetFromCylindrical(Cylindrical c)
        {
            return this.SetFromCylindricalCoords(c.radius, c.theta, c.y);
        }

        public Vector3 SetFromCylindricalCoords(double radius, double theta, double y)
        {
            this.x = radius * _Math.Sin(theta);
            this.y = y;
            this.z = radius * _Math.Cos(theta);

            return this;
        }

        public Vector3 SetFromMatrixPosition(Matrix4 m)
        {
            var e = m.elements;

            this.x = e[12];
            this.y = e[13];
            this.z = e[14];

            return this;
        }

        public Vector3 SetFromMatrixScale(Matrix4 m)
        {
            var sx = this.SetFromMatrixColumn(m, 0).Length();
            var sy = this.SetFromMatrixColumn(m, 1).Length();
            var sz = this.SetFromMatrixColumn(m, 2).Length();

            this.x = sx;
            this.y = sy;
            this.z = sz;

            return this;
        }

        public Vector3 SetFromMatrixColumn(Matrix4 m, int index)
        {
            return this.FromArray(m.elements, index * 4);
        }

        public bool Equals(Vector3 v)
        {
            return (v.x == this.x) && (v.y == this.y) && (v.z == this.z);
        }

        public Vector3 FromArray(double[] array, int offset = 0)
        {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];

            return this;
        }

        public double[] ToArray(double[] array = null, int offset = 0)
        {
            if (array == null) array = new double[2];

            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;

            return array;
        }
    }
}
