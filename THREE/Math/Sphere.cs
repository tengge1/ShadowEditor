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
    /// @author mrdoob / http://mrdoob.com/
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Sphere
    {
        public Vector3 center;
        public double radius;

        public Sphere(Vector3 center = null, double radius = 0)
        {
            this.center = center ?? new Vector3();
            this.radius = radius;
        }

        public Sphere Set(Vector3 center, double radius)
        {
            this.center.Copy(center);
            this.radius = radius;

            return this;
        }

        public Sphere SetFromPoints(Vector3[] points, Vector3 optionalCenter = null)
        {
            var box = new Box3();

            var center = this.center;

            if (optionalCenter != null)
            {
                center.Copy(optionalCenter);
            }
            else
            {
                box.SetFromPoints(points).GetCenter(center);
            }

            var maxRadiusSq = 0.0;

            for (int i = 0, il = points.Length; i < il; i++)
            {
                maxRadiusSq = _Math.Max(maxRadiusSq, center.DistanceToSquared(points[i]));
            }

            this.radius = _Math.Sqrt(maxRadiusSq);

            return this;
        }

        public Sphere Clone()
        {
            return new Sphere().Copy(this);
        }

        public Sphere Copy(Sphere sphere)
        {
            this.center.Copy(sphere.center);
            this.radius = sphere.radius;

            return this;
        }

        public bool Empty()
        {
            return this.radius <= 0;
        }

        public bool ContainsPoint(Vector3 point)
        {
            return point.DistanceToSquared(this.center) <= this.radius * this.radius;
        }

        public double DistanceToPoint(Vector3 point)
        {
            return point.DistanceTo(this.center) - this.radius;
        }

        public bool IntersectsSphere(Sphere sphere)
        {
            var radiusSum = this.radius + sphere.radius;

            return sphere.center.DistanceToSquared(this.center) <= radiusSum * radiusSum;
        }

        public bool IntersectsBox(Box3 box)
        {
            return box.IntersectsSphere(this);
        }

        public bool IntersectsPlane(Plane plane)
        {
            return _Math.Abs(plane.DistanceToPoint(this.center)) <= this.radius;
        }

        public Vector3 ClampPoint(Vector3 point, Vector3 target = null)
        {
            var deltaLengthSq = this.center.DistanceToSquared(point);

            if (target == null)
            {
                Console.WriteLine("THREE.Sphere: .clampPoint() target is now required");
                target = new Vector3();
            }

            target.Copy(point);

            if (deltaLengthSq > this.radius * this.radius)
            {
                target.Sub(this.center).Normalize();
                target.MultiplyScalar(this.radius).Add(this.center);
            }

            return target;
        }

        public Box3 GetBoundingBox(Box3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Sphere: .getBoundingBox() target is now required");
                target = new Box3();
            }

            target.Set(this.center, this.center);
            target.ExpandByScalar(this.radius);

            return target;
        }

        public Sphere ApplyMatrix4(Matrix4 matrix)
        {
            this.center.ApplyMatrix4(matrix);
            this.radius = this.radius * matrix.GetMaxScaleOnAxis();

            return this;
        }

        public Sphere Translate(Vector3 offset)
        {
            this.center.Add(offset);

            return this;
        }

        public bool Equals(Sphere sphere)
        {
            return sphere.center.Equals(this.center) && sphere.radius == this.radius;
        }
    }
}
