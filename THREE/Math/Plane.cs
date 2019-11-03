using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace THREE
{
    /// <summary>
    /// @author bhouston / http://clara.io
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Plane
    {
        public Vector3 normal;
        public double constant;

        public Plane(Vector3 normal = null, double constant = 0.0)
        {
            // normal is assumed to be normalized

            if (normal == null)
            {
                normal = new Vector3(1, 0, 0);
            }
        }

        public Plane Set(Vector3 normal, double constant)
        {
            this.normal.Copy(normal);
            this.constant = constant;

            return this;
        }

        public Plane SetComponents(double x, double y, double z, double w)
        {
            this.normal.Set(x, y, z);
            this.constant = w;

            return this;
        }

        public Plane SetFromNormalAndCoplanarPoint(Vector3 normal, Vector3 point)
        {
            this.normal.Copy(normal);
            this.constant = -point.Dot(this.normal);

            return this;
        }

        public Plane SetFromCoplanarPoints(Vector3 a, Vector3 b, Vector3 c)
        {
            var v1 = new Vector3();
            var v2 = new Vector3();

            var normal = v1.SubVectors(c, b).Cross(v2.SubVectors(a, b)).Normalize();

            // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

            this.SetFromNormalAndCoplanarPoint(normal, a);

            return this;
        }

        public Plane Clone()
        {
            return new Plane().Copy(this);
        }

        public Plane Copy(Plane plane)
        {
            this.normal.Copy(plane.normal);
            this.constant = plane.constant;

            return this;
        }

        public Plane Normalize()
        {
            // Note: will lead to a divide by zero if the plane is invalid.

            var inverseNormalLength = 1.0 / this.normal.Length();
            this.normal.MultiplyScalar(inverseNormalLength);
            this.constant *= inverseNormalLength;

            return this;
        }

        public Plane Negate()
        {
            this.constant *= -1;
            this.normal.Negate();

            return this;
        }

        public double DistanceToPoint(Vector3 point)
        {
            return this.normal.Dot(point) + this.constant;
        }

        public double DistanceToSphere(Sphere sphere)
        {
            return this.DistanceToPoint(sphere.center) - sphere.radius;
        }

        public Vector3 ProjectPoint(Vector3 point, Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Plane: .projectPoint() target is now required");
                target = new Vector3();
            }

            return target.Copy(this.normal).MultiplyScalar(-this.DistanceToPoint(point)).Add(point);
        }

        public Vector3 IntersectLine(Line3 line, Vector3 target = null)
        {
            var v1 = new Vector3();
            if (target == null)
            {
                Console.WriteLine("THREE.Plane: .intersectLine() target is now required");
                target = new Vector3();
            }

            var direction = line.Delta(v1);

            var denominator = this.normal.Dot(direction);

            if (denominator == 0)
            {
                // line is coplanar, return origin
                if (this.DistanceToPoint(line.start) == 0)
                {
                    return target.Copy(line.start);
                }

                // Unsure if this is the correct method to handle this case.
                return null;
            }

            var t = -(line.start.Dot(this.normal) + this.constant) / denominator;

            if (t < 0 || t > 1)
            {
                return null;
            }

            return target.Copy(direction).MultiplyScalar(t).Add(line.start);
        }

        public bool IntersectsLine(Line3 line)
        {
            // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

            var startSign = this.DistanceToPoint(line.start);
            var endSign = this.DistanceToPoint(line.end);

            return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
        }

        public bool IntersectsBox(Box3 box)
        {
            return box.IntersectsPlane(this);
        }

        public bool IntersectsSphere(Sphere sphere)
        {
            return sphere.IntersectsPlane(this);
        }

        public Vector3 CoplanarPoint(Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Plane: .coplanarPoint() target is now required");
                target = new Vector3();
            }

            return target.Copy(this.normal).MultiplyScalar(-this.constant);
        }

        public Plane ApplyMatrix4(Matrix4 matrix, Matrix3 optionalNormalMatrix = null)
        {

            var v1 = new Vector3();
            var m1 = new Matrix3();

            var normalMatrix = optionalNormalMatrix ?? m1.GetNormalMatrix(matrix);

            var referencePoint = this.CoplanarPoint(v1).ApplyMatrix4(matrix);

            var normal = this.normal.ApplyMatrix3(normalMatrix).Normalize();

            this.constant = -referencePoint.Dot(normal);

            return this;
        }

        public Plane Translate(Vector3 offset)
        {
            this.constant -= offset.Dot(this.normal);

            return this;
        }

        public bool Equals(Plane plane)
        {
            return plane.normal.Equals(this.normal) && (plane.constant == this.constant);
        }
    }
}
