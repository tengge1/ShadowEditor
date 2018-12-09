using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author bhouston / http://clara.io
    /// @author WestLangley / http://github.com/WestLangley
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Box3
    {
        public Vector3 min;
        public Vector3 max;

        public Box3(Vector3 min = null, Vector3 max = null)
        {
            this.min = (min != null) ? min : new Vector3(double.PositiveInfinity, double.PositiveInfinity, double.PositiveInfinity);
            this.max = (max != null) ? max : new Vector3(double.NegativeInfinity, double.NegativeInfinity, double.NegativeInfinity);
        }

        public const bool isBox3 = true;

        public Box3 Set(Vector3 min, Vector3 max)
        {
            this.min.Copy(min);
            this.max.Copy(max);

            return this;
        }

        public Box3 SetFromArray(double[] array)
        {
            var minX = double.PositiveInfinity;
            var minY = double.PositiveInfinity;
            var minZ = double.PositiveInfinity;

            var maxX = double.NegativeInfinity;
            var maxY = double.NegativeInfinity;
            var maxZ = double.NegativeInfinity;

            for (int i = 0, l = array.Length; i < l; i += 3)
            {
                var x = array[i];
                var y = array[i + 1];
                var z = array[i + 2];

                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (z < minZ) minZ = z;

                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
                if (z > maxZ) maxZ = z;
            }

            this.min.Set(minX, minY, minZ);
            this.max.Set(maxX, maxY, maxZ);

            return this;
        }

        public Box3 SetFromPoints(Vector3[] points)
        {
            this.MakeEmpty();

            for (int i = 0, il = points.Length; i < il; i++)
            {
                this.ExpandByPoint(points[i]);
            }

            return this;
        }

        public Box3 SetFromCenterAndSize(Vector3 center, Vector3 size)
        {
            var v1 = new Vector3();

            var halfSize = v1.Copy(size).MultiplyScalar(0.5);

            this.min.Copy(center).Sub(halfSize);
            this.max.Copy(center).Add(halfSize);

            return this;
        }

        public Box3 Clone()
        {
            return new Box3().Copy(this);
        }

        public Box3 Copy(Box3 box)
        {
            this.min.Copy(box.min);
            this.max.Copy(box.max);

            return this;
        }

        public Box3 MakeEmpty()
        {
            this.min.x = this.min.y = this.min.z = double.PositiveInfinity;
            this.max.x = this.max.y = this.max.z = double.NegativeInfinity;

            return this;
        }

        public bool IsEmpty()
        {
            // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
            return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
        }

        public Vector3 GetCenter(Vector3 target)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Box3: .getCenter() target is now required");
                target = new Vector3();
            }

            return this.IsEmpty() ? target.Set(0, 0, 0) : target.AddVectors(this.min, this.max).MultiplyScalar(0.5);
        }

        public Vector3 GetSize(Vector3 target)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Box3: .getSize() target is now required");
                target = new Vector3();
            }

            return this.IsEmpty() ? target.Set(0, 0, 0) : target.SubVectors(this.max, this.min);
        }

        public Box3 ExpandByPoint(Vector3 point)
        {
            this.min.Min(point);
            this.max.Max(point);

            return this;
        }

        public Box3 ExpandByVector(Vector3 vector)
        {
            this.min.Sub(vector);
            this.max.Add(vector);

            return this;
        }

        public Box3 ExpandByScalar(double scalar)
        {
            this.min.AddScalar(-scalar);
            this.max.AddScalar(scalar);

            return this;
        }

        public bool ContainsPoint(Vector3 point)
        {
            return point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y ||
                point.z < this.min.z || point.z > this.max.z ? false : true;
        }

        public bool ContainsBox(Box3 box)
        {
            return this.min.x <= box.min.x && box.max.x <= this.max.x &&
                this.min.y <= box.min.y && box.max.y <= this.max.y &&
                this.min.z <= box.min.z && box.max.z <= this.max.z;
        }

        public Vector3 GetParameter(Vector3 point, Vector3 target)
        {
            // This can potentially have a divide by zero if the box
            // has a size dimension of 0.
            if (target == null)
            {
                Console.WriteLine("THREE.Box3: .getParameter() target is now required");
                target = new Vector3();
            }

            return target.Set(
                (point.x - this.min.x) / (this.max.x - this.min.x),
                (point.y - this.min.y) / (this.max.y - this.min.y),
                (point.z - this.min.z) / (this.max.z - this.min.z)
            );
        }

        public bool IntersectsBox(Box3 box)
        {
            // using 6 splitting planes to rule out intersections.
            return box.max.x < this.min.x || box.min.x > this.max.x ||
                box.max.y < this.min.y || box.min.y > this.max.y ||
                box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
        }

        public bool IntersectsSphere(Sphere sphere)
        {
            var closestPoint = new Vector3();

            // Find the point on the AABB closest to the sphere center.
            this.ClampPoint(sphere.center, closestPoint);

            // If that point is inside the sphere, the AABB and sphere intersect.
            return closestPoint.DistanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
        }

        public bool IntersectsPlane(Plane plane)
        {
            // We compute the minimum and maximum dot product values. If those values
            // are on the same side (back or front) of the plane, then there is no intersection.

            double min, max;

            if (plane.normal.x > 0)
            {
                min = plane.normal.x * this.min.x;
                max = plane.normal.x * this.max.x;
            }
            else
            {
                min = plane.normal.x * this.max.x;
                max = plane.normal.x * this.min.x;
            }

            if (plane.normal.y > 0)
            {
                min += plane.normal.y * this.min.y;
                max += plane.normal.y * this.max.y;
            }
            else
            {
                min += plane.normal.y * this.max.y;
                max += plane.normal.y * this.min.y;
            }

            if (plane.normal.z > 0)
            {
                min += plane.normal.z * this.min.z;
                max += plane.normal.z * this.max.z;
            }
            else
            {
                min += plane.normal.z * this.max.z;
                max += plane.normal.z * this.min.z;
            }

            return (min <= plane.constant && max >= plane.constant);
        }

        public bool _SatForAxes(double[] axes, Vector3 testAxis, Vector3 extents, Vector3 v0, Vector3 v1, Vector3 v2)
        {
            int i, j;

            for (i = 0, j = axes.Length - 3; i <= j; i += 3)
            {
                testAxis.FromArray(axes, i);
                // project the aabb onto the seperating axis
                var r = extents.x * _Math.Abs(testAxis.x) + extents.y * _Math.Abs(testAxis.y) + extents.z * _Math.Abs(testAxis.z);
                // project all 3 vertices of the triangle onto the seperating axis
                var p0 = v0.Dot(testAxis);
                var p1 = v1.Dot(testAxis);
                var p2 = v2.Dot(testAxis);
                // actual test, basically see if either of the most extreme of the triangle points intersects r
                if (_Math.Max(-_Math.Max(_Math.Max(p0, p1), p2), _Math.Min(_Math.Min(p0, p1), p2)) > r)
                {
                    // points of the projected triangle are outside the projected half-length of the aabb
                    // the axis is seperating and we can exit
                    return false;
                }
            }

            return true;
        }

        public bool IntersectsTriangle(Triangle triangle)
        {
            // triangle centered vertices
            var v0 = new Vector3();
            var v1 = new Vector3();
            var v2 = new Vector3();

            // triangle edge vectors
            var f0 = new Vector3();
            var f1 = new Vector3();
            var f2 = new Vector3();

            var testAxis = new Vector3();

            var center = new Vector3();
            var extents = new Vector3();

            var triangleNormal = new Vector3();

            if (this.IsEmpty())
            {
                return false;
            }

            // compute box center and extents
            this.GetCenter(center);
            extents.SubVectors(this.max, center);

            // translate triangle to aabb origin
            v0.SubVectors(triangle.a, center);
            v1.SubVectors(triangle.b, center);
            v2.SubVectors(triangle.c, center);

            // compute edge vectors for triangle
            f0.SubVectors(v1, v0);
            f1.SubVectors(v2, v1);
            f2.SubVectors(v0, v2);

            // test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
            // make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
            // axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
            var axes = new double[] {
                0, -f0.z, f0.y, 0, -f1.z, f1.y, 0, -f2.z, f2.y,
                f0.z, 0, -f0.x, f1.z, 0, -f1.x, f2.z, 0, -f2.x,
                -f0.y, f0.x, 0, -f1.y, f1.x, 0, -f2.y, f2.x, 0
            };
            if (!_SatForAxes(axes, testAxis, extents, v0, v1, v2))
            {
                return false;
            }

            // test 3 face normals from the aabb
            axes = new double[] { 1, 0, 0, 0, 1, 0, 0, 0, 1 };

            if (!_SatForAxes(axes, testAxis, extents, v0, v1, v2))
            {
                return false;
            }

            // finally testing the face normal of the triangle
            // use already existing triangle edge vectors here
            triangleNormal.CrossVectors(f0, f1);
            axes = new double[] { triangleNormal.x, triangleNormal.y, triangleNormal.z };

            return _SatForAxes(axes, testAxis, extents, v0, v1, v2);
        }

        public Vector3 ClampPoint(Vector3 point, Vector3 target)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Box3: .clampPoint() target is now required");
                target = new Vector3();
            }

            return target.Copy(point).Clamp(this.min, this.max);
        }

        public double DistanceToPoint(Vector3 point)
        {
            var v1 = new Vector3();

            var clampedPoint = v1.Copy(point).Clamp(this.min, this.max);
            return clampedPoint.Sub(point).Length();
        }

        public Sphere GetBoundingSphere(Sphere target)
        {
            var v1 = new Vector3();

            if (target == null)
            {
                Console.WriteLine("THREE.Box3: .getBoundingSphere() target is now required");
                target = new Sphere();
            }

            this.GetCenter(target.center);

            target.radius = this.GetSize(v1).Length() * 0.5;

            return target;
        }

        public Box3 Intersect(Box3 box)
        {
            this.min.Max(box.min);
            this.max.Min(box.max);

            // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
            if (this.IsEmpty()) this.MakeEmpty();

            return this;
        }

        public Box3 Union(Box3 box)
        {
            this.min.Min(box.min);
            this.max.Max(box.max);

            return this;
        }

        public Box3 ApplyMatrix4(Matrix4 matrix)
        {
            var points = new Vector3[] {
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3()
            };

            // transform of empty box is an empty box.
            if (this.IsEmpty()) return this;

            // NOTE: I am using a binary pattern to specify all 2^3 combinations below
            points[0].Set(this.min.x, this.min.y, this.min.z).ApplyMatrix4(matrix); // 000
            points[1].Set(this.min.x, this.min.y, this.max.z).ApplyMatrix4(matrix); // 001
            points[2].Set(this.min.x, this.max.y, this.min.z).ApplyMatrix4(matrix); // 010
            points[3].Set(this.min.x, this.max.y, this.max.z).ApplyMatrix4(matrix); // 011
            points[4].Set(this.max.x, this.min.y, this.min.z).ApplyMatrix4(matrix); // 100
            points[5].Set(this.max.x, this.min.y, this.max.z).ApplyMatrix4(matrix); // 101
            points[6].Set(this.max.x, this.max.y, this.min.z).ApplyMatrix4(matrix); // 110
            points[7].Set(this.max.x, this.max.y, this.max.z).ApplyMatrix4(matrix); // 111

            this.SetFromPoints(points);

            return this;
        }

        public Box3 Translate(Vector3 offset)
        {
            this.min.Add(offset);
            this.max.Add(offset);

            return this;
        }

        public bool Equals(Box3 box)
        {
            return box.min.Equals(this.min) && box.max.Equals(this.max);
        }
    }
}
