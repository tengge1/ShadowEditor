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
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Ray
    {
        Vector3 origin;
        Vector3 direction;

        public Ray(Vector3 origin = null, Vector3 direction = null)
        {
            this.origin = origin ?? new Vector3();
            this.direction = direction ?? new Vector3();
        }

        public Ray Set(Vector3 origin, Vector3 direction)
        {
            this.origin.Copy(origin);
            this.direction.Copy(direction);

            return this;
        }

        public Ray Clone()
        {
            return new Ray().Copy(this);
        }

        public Ray Copy(Ray ray)
        {
            this.origin.Copy(ray.origin);
            this.direction.Copy(ray.direction);

            return this;
        }

        public Vector3 At(double t, Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Ray: .at() target is now required");
                target = new Vector3();
            }

            return target.Copy(this.direction).MultiplyScalar(t).Add(this.origin);
        }

        public Ray LookAt(Vector3 v)
        {
            this.direction.Copy(v).Sub(this.origin).Normalize();

            return this;
        }

        public Ray Recast(double t)
        {
            var v1 = new Vector3();

            this.origin.Copy(this.At(t, v1));

            return this;
        }

        public Vector3 ClosestPointToPoint(Vector3 point, Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Ray: .closestPointToPoint() target is now required");
                target = new Vector3();
            }

            target.SubVectors(point, this.origin);

            var directionDistance = target.Dot(this.direction);

            if (directionDistance < 0)
            {
                return target.Copy(this.origin);
            }

            return target.Copy(this.direction).MultiplyScalar(directionDistance).Add(this.origin);
        }

        public double DistanceToPoint(Vector3 point)
        {
            return _Math.Sqrt(this.DistanceSqToPoint(point));
        }

        public double DistanceSqToPoint(Vector3 point)
        {
            var v1 = new Vector3();

            var directionDistance = v1.SubVectors(point, this.origin).Dot(this.direction);

            // point behind the ray

            if (directionDistance < 0)
            {
                return this.origin.DistanceToSquared(point);
            }

            v1.Copy(this.direction).MultiplyScalar(directionDistance).Add(this.origin);

            return v1.DistanceToSquared(point);
        }

        public double DistanceSqToSegment(Vector3 v0, Vector3 v1, Vector3 optionalPointOnRay = null, Vector3 optionalPointOnSegment = null)
        {
            var segCenter = new Vector3();
            var segDir = new Vector3();
            var diff = new Vector3();

            // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
            // It returns the min distance between the ray and the segment
            // defined by v0 and v1
            // It can also set two optional targets :
            // - The closest point on the ray
            // - The closest point on the segment

            segCenter.Copy(v0).Add(v1).MultiplyScalar(0.5);
            segDir.Copy(v1).Sub(v0).Normalize();
            diff.Copy(this.origin).Sub(segCenter);

            var segExtent = v0.DistanceTo(v1) * 0.5;
            var a01 = -this.direction.Dot(segDir);
            var b0 = diff.Dot(this.direction);
            var b1 = -diff.Dot(segDir);
            var c = diff.LengthSq();
            var det = _Math.Abs(1 - a01 * a01);
            double s0, s1, sqrDist, extDet;

            if (det > 0)
            {
                // The ray and segment are not parallel.

                s0 = a01 * b1 - b0;
                s1 = a01 * b0 - b1;
                extDet = segExtent * det;

                if (s0 >= 0)
                {
                    if (s1 >= -extDet)
                    {
                        if (s1 <= extDet)
                        {
                            // region 0
                            // Minimum at interior points of ray and segment.

                            var invDet = 1 / det;
                            s0 *= invDet;
                            s1 *= invDet;
                            sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
                        }
                        else
                        {
                            // region 1

                            s1 = segExtent;
                            s0 = _Math.Max(0, -(a01 * s1 + b0));
                            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                        }
                    }
                    else
                    {
                        // region 5

                        s1 = -segExtent;
                        s0 = _Math.Max(0, -(a01 * s1 + b0));
                        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                    }
                }
                else
                {
                    if (s1 <= -extDet)
                    {
                        // region 4

                        s0 = _Math.Max(0, -(-a01 * segExtent + b0));
                        s1 = (s0 > 0) ? -segExtent : _Math.Min(_Math.Max(-segExtent, -b1), segExtent);
                        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                    }
                    else if (s1 <= extDet)
                    {
                        // region 3

                        s0 = 0;
                        s1 = _Math.Min(_Math.Max(-segExtent, -b1), segExtent);
                        sqrDist = s1 * (s1 + 2 * b1) + c;
                    }
                    else
                    {
                        // region 2

                        s0 = _Math.Max(0, -(a01 * segExtent + b0));
                        s1 = (s0 > 0) ? segExtent : _Math.Min(_Math.Max(-segExtent, -b1), segExtent);
                        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                    }
                }
            }
            else
            {
                // Ray and segment are parallel.

                s1 = (a01 > 0) ? -segExtent : segExtent;
                s0 = _Math.Max(0, -(a01 * s1 + b0));
                sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
            }

            if (optionalPointOnRay != null)
            {
                optionalPointOnRay.Copy(this.direction).MultiplyScalar(s0).Add(this.origin);
            }

            if (optionalPointOnSegment != null)
            {
                optionalPointOnSegment.Copy(segDir).MultiplyScalar(s1).Add(segCenter);
            }

            return sqrDist;
        }

        public Vector3 IntersectSphere(Sphere sphere, Vector3 target)
        {
            var v1 = new Vector3();

            v1.SubVectors(sphere.center, this.origin);
            var tca = v1.Dot(this.direction);
            var d2 = v1.Dot(v1) - tca * tca;
            var radius2 = sphere.radius * sphere.radius;

            if (d2 > radius2) return null;

            var thc = _Math.Sqrt(radius2 - d2);

            // t0 = first intersect point - entrance on front of sphere
            var t0 = tca - thc;

            // t1 = second intersect point - exit point on back of sphere
            var t1 = tca + thc;

            // test to see if both t0 and t1 are behind the ray - if so, return null
            if (t0 < 0 && t1 < 0) return null;

            // test to see if t0 is behind the ray:
            // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
            // in order to always return an intersect point that is in front of the ray.
            if (t0 < 0) return this.At(t1, target);

            // else t0 is in front of the ray, so return the first collision point scaled by t0
            return this.At(t0, target);
        }

        public bool IntersectsSphere(Sphere sphere)
        {
            return this.DistanceSqToPoint(sphere.center) <= sphere.radius * sphere.radius;
        }

        public double? DistanceToPlane(Plane plane)
        {
            var denominator = plane.normal.Dot(this.direction);

            if (denominator == 0)
            {
                // line is coplanar, return origin
                if (plane.DistanceToPoint(this.origin) == 0)
                {
                    return 0;
                }

                // Null is preferable to undefined since undefined means.... it is undefined

                return null;
            }

            var t = -(this.origin.Dot(plane.normal) + plane.constant) / denominator;

            // Return if the ray never intersects the plane

            if (t >= 0)
            {
                return t;
            }

            return null;
        }

        public Vector3 IntersectPlane(Plane plane, Vector3 target)
        {

            var t = this.DistanceToPlane(plane);

            if (t == null)
            {
                return null;
            }

            return this.At(t.Value, target);
        }

        public bool IntersectsPlane(Plane plane)
        {
            // check if the ray lies on the plane first

            var distToPoint = plane.DistanceToPoint(this.origin);

            if (distToPoint == 0)
            {
                return true;
            }

            var denominator = plane.normal.Dot(this.direction);

            if (denominator * distToPoint < 0)
            {
                return true;
            }

            // ray origin is behind the plane (and is pointing behind it)

            return false;
        }

        public Vector3 IntersectBox(Box3 box, Vector3 target)
        {
            double tmin, tmax, tymin, tymax, tzmin, tzmax;

            double invdirx = 1 / this.direction.x,
                invdiry = 1 / this.direction.y,
                invdirz = 1 / this.direction.z;

            var origin = this.origin;

            if (invdirx >= 0)
            {
                tmin = (box.min.x - origin.x) * invdirx;
                tmax = (box.max.x - origin.x) * invdirx;
            }
            else
            {
                tmin = (box.max.x - origin.x) * invdirx;
                tmax = (box.min.x - origin.x) * invdirx;
            }

            if (invdiry >= 0)
            {
                tymin = (box.min.y - origin.y) * invdiry;
                tymax = (box.max.y - origin.y) * invdiry;
            }
            else
            {
                tymin = (box.max.y - origin.y) * invdiry;
                tymax = (box.min.y - origin.y) * invdiry;
            }

            if ((tmin > tymax) || (tymin > tmax)) return null;

            // These lines also handle the case where tmin or tmax is NaN
            // (result of 0 * Infinity). x !== x returns true if x is NaN

            if (tymin > tmin || double.IsNaN(tmin)) tmin = tymin;

            if (tymax < tmax || double.IsNaN(tmax)) tmax = tymax;

            if (invdirz >= 0)
            {
                tzmin = (box.min.z - origin.z) * invdirz;
                tzmax = (box.max.z - origin.z) * invdirz;
            }
            else
            {
                tzmin = (box.max.z - origin.z) * invdirz;
                tzmax = (box.min.z - origin.z) * invdirz;
            }

            if ((tmin > tzmax) || (tzmin > tmax)) return null;

            if (tzmin > tmin || double.IsNaN(tmin)) tmin = tzmin;

            if (tzmax < tmax || double.IsNaN(tmax)) tmax = tzmax;

            //return point closest to the ray (positive side)

            if (tmax < 0) return null;

            return this.At(tmin >= 0 ? tmin : tmax, target);
        }

        public bool IntersectsBox(Box3 box)
        {
            var v = new Vector3();
            return this.IntersectBox(box, v) != null;
        }

        public Vector3 IntersectTriangle(Vector3 a, Vector3 b, Vector3 c, bool backfaceCulling, Vector3 target)
        {
            // Compute the offset origin, edges, and normal.
            var diff = new Vector3();
            var edge1 = new Vector3();
            var edge2 = new Vector3();
            var normal = new Vector3();

            // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

            edge1.SubVectors(b, a);
            edge2.SubVectors(c, a);
            normal.CrossVectors(edge1, edge2);

            // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
            // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
            //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
            //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
            //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
            var DdN = this.direction.Dot(normal);
            double sign;

            if (DdN > 0)
            {
                if (backfaceCulling) return null;
                sign = 1;
            }
            else if (DdN < 0)
            {
                sign = -1;
                DdN = -DdN;
            }
            else
            {
                return null;
            }

            diff.SubVectors(this.origin, a);
            var DdQxE2 = sign * this.direction.Dot(edge2.CrossVectors(diff, edge2));

            // b1 < 0, no intersection
            if (DdQxE2 < 0)
            {
                return null;
            }

            var DdE1xQ = sign * this.direction.Dot(edge1.Cross(diff));

            // b2 < 0, no intersection
            if (DdE1xQ < 0)
            {
                return null;
            }

            // b1+b2 > 1, no intersection
            if (DdQxE2 + DdE1xQ > DdN)
            {
                return null;
            }

            // Line intersects triangle, check if ray does.
            var QdN = -sign * diff.Dot(normal);

            // t < 0, no intersection
            if (QdN < 0)
            {
                return null;
            }

            // Ray intersects triangle.
            return this.At(QdN / DdN, target);
        }

        public Ray ApplyMatrix4(Matrix4 matrix4)
        {
            this.origin.ApplyMatrix4(matrix4);
            this.direction.TransformDirection(matrix4);

            return this;
        }

        public bool Equals(Ray ray)
        {
            return ray.origin.Equals(this.origin) && ray.direction.Equals(this.direction);
        }
    }
}
