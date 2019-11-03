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
    public class Triangle
    {
        public Vector3 a;
        public Vector3 b;
        public Vector3 c;

        public Triangle(Vector3 a = null, Vector3 b = null, Vector3 c = null)
        {
            this.a = a ?? new Vector3();
            this.b = b ?? new Vector3();
            this.c = c ?? new Vector3();
        }

        public Vector3 GetNormal(Vector3 a, Vector3 b, Vector3 c, Vector3 target = null)
        {
            var v0 = new Vector3();

            if (target == null)
            {
                Console.WriteLine("THREE.Triangle: .getNormal() target is now required");
                target = new Vector3();
            }

            target.SubVectors(c, b);
            v0.SubVectors(a, b);
            target.Cross(v0);

            var targetLengthSq = target.LengthSq();
            if (targetLengthSq > 0)
            {
                return target.MultiplyScalar(1 / _Math.Sqrt(targetLengthSq));
            }

            return target.Set(0, 0, 0);
        }

        // static/instance method to calculate barycentric coordinates
        // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
        public Vector3 GetBarycoord(Vector3 point, Vector3 a, Vector3 b, Vector3 c, Vector3 target = null)
        {
            var v0 = new Vector3();
            var v1 = new Vector3();
            var v2 = new Vector3();

            v0.SubVectors(c, a);
            v1.SubVectors(b, a);
            v2.SubVectors(point, a);

            var dot00 = v0.Dot(v0);
            var dot01 = v0.Dot(v1);
            var dot02 = v0.Dot(v2);
            var dot11 = v1.Dot(v1);
            var dot12 = v1.Dot(v2);

            var denom = (dot00 * dot11 - dot01 * dot01);

            if (target == null)
            {
                Console.WriteLine("THREE.Triangle: .getBarycoord() target is now required");
                target = new Vector3();
            }

            // collinear or singular triangle
            if (denom == 0)
            {
                // arbitrary location outside of triangle?
                // not sure if this is the best idea, maybe should be returning undefined
                return target.Set(-2, -1, -1);
            }

            var invDenom = 1 / denom;
            var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

            // barycentric coordinates must always sum to 1
            return target.Set(1 - u - v, v, u);
        }

        public bool ContainsPoint(Vector3 point, Vector3 a, Vector3 b, Vector3 c)
        {
            var v1 = new Vector3();

            this.GetBarycoord(point, a, b, c, v1);

            return (v1.x >= 0) && (v1.y >= 0) && ((v1.x + v1.y) <= 1);
        }

        public Vector2 GetUV(Vector3 point, Vector3 p1, Vector3 p2, Vector3 p3, Vector2 uv1, Vector2 uv2, Vector2 uv3, Vector2 target)
        {

            var barycoord = new Vector3();

            this.GetBarycoord(point, p1, p2, p3, barycoord);

            target.Set(0, 0);
            target.AddScaledVector(uv1, barycoord.x);
            target.AddScaledVector(uv2, barycoord.y);
            target.AddScaledVector(uv3, barycoord.z);

            return target;
        }

        public Triangle Set(Vector3 a, Vector3 b, Vector3 c)
        {
            this.a.Copy(a);
            this.b.Copy(b);
            this.c.Copy(c);

            return this;
        }

        public Triangle SetFromPointsAndIndices(Vector3[] points, int i0, int i1, int i2)
        {
            this.a.Copy(points[i0]);
            this.b.Copy(points[i1]);
            this.c.Copy(points[i2]);

            return this;
        }

        public Triangle Clone()
        {
            return new Triangle().Copy(this);
        }

        public Triangle Copy(Triangle triangle)
        {
            this.a.Copy(triangle.a);
            this.b.Copy(triangle.b);
            this.c.Copy(triangle.c);

            return this;
        }

        public double GetArea()
        {
            var v0 = new Vector3();
            var v1 = new Vector3();

            v0.SubVectors(this.c, this.b);
            v1.SubVectors(this.a, this.b);

            return v0.Cross(v1).Length() * 0.5;
        }

        public Vector3 GetMidpoint(Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Triangle: .getMidpoint() target is now required");
                target = new Vector3();
            }

            return target.AddVectors(this.a, this.b).Add(this.c).MultiplyScalar(1 / 3);
        }

        public Vector3 GetNormal(Vector3 target)
        {
            return this.GetNormal(this.a, this.b, this.c, target);
        }

        public Plane GetPlane(Plane target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Triangle: .getPlane() target is now required");
                target = new Plane();
            }

            return target.SetFromCoplanarPoints(this.a, this.b, this.c);
        }

        public Vector3 GetBarycoord(Vector3 point, Vector3 target)
        {
            return this.GetBarycoord(point, this.a, this.b, this.c, target);
        }

        public bool ContainsPoint(Vector3 point)
        {
            return this.ContainsPoint(point, this.a, this.b, this.c);
        }

        public Vector2 GetUV(Vector3 point, Vector2 uv1, Vector2 uv2, Vector2 uv3, Vector2 result)
        {
            return this.GetUV(point, this.a, this.b, this.c, uv1, uv2, uv3, result);
        }

        public bool IntersectsBox(Box3 box)
        {
            return box.IntersectsTriangle(this);
        }

        public Vector3 ClosestPointToPoint(Vector3 p, Vector3 target = null)
        {
            var vab = new Vector3();
            var vac = new Vector3();
            var vbc = new Vector3();
            var vap = new Vector3();
            var vbp = new Vector3();
            var vcp = new Vector3();

            if (target == null)
            {
                Console.WriteLine("THREE.Triangle: .closestPointToPoint() target is now required");
                target = new Vector3();
            }

            Vector3 a = this.a, b = this.b, c = this.c;
            double v, w;

            // algorithm thanks to Real-Time Collision Detection by Christer Ericson,
            // published by Morgan Kaufmann Publishers, (c) 2005 Elsevier Inc.,
            // under the accompanying license; see chapter 5.1.5 for detailed explanation.
            // basically, we're distinguishing which of the voronoi regions of the triangle
            // the point lies in with the minimum amount of redundant computation.

            vab.SubVectors(b, a);
            vac.SubVectors(c, a);
            vap.SubVectors(p, a);
            var d1 = vab.Dot(vap);
            var d2 = vac.Dot(vap);
            if (d1 <= 0 && d2 <= 0)
            {
                // vertex region of A; barycentric coords (1, 0, 0)
                return target.Copy(a);
            }

            vbp.SubVectors(p, b);
            var d3 = vab.Dot(vbp);
            var d4 = vac.Dot(vbp);
            if (d3 >= 0 && d4 <= d3)
            {
                // vertex region of B; barycentric coords (0, 1, 0)
                return target.Copy(b);
            }

            var vc = d1 * d4 - d3 * d2;
            if (vc <= 0 && d1 >= 0 && d3 <= 0)
            {
                v = d1 / (d1 - d3);
                // edge region of AB; barycentric coords (1-v, v, 0)
                return target.Copy(a).AddScaledVector(vab, v);
            }

            vcp.SubVectors(p, c);
            var d5 = vab.Dot(vcp);
            var d6 = vac.Dot(vcp);
            if (d6 >= 0 && d5 <= d6)
            {
                // vertex region of C; barycentric coords (0, 0, 1)
                return target.Copy(c);
            }

            var vb = d5 * d2 - d1 * d6;
            if (vb <= 0 && d2 >= 0 && d6 <= 0)
            {
                w = d2 / (d2 - d6);
                // edge region of AC; barycentric coords (1-w, 0, w)
                return target.Copy(a).AddScaledVector(vac, w);
            }

            var va = d3 * d6 - d5 * d4;
            if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0)
            {
                vbc.SubVectors(c, b);
                w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
                // edge region of BC; barycentric coords (0, 1-w, w)
                return target.Copy(b).AddScaledVector(vbc, w); // edge region of BC
            }

            // face region
            var denom = 1 / (va + vb + vc);
            // u = va * denom
            v = vb * denom;
            w = vc * denom;
            return target.Copy(a).AddScaledVector(vab, v).AddScaledVector(vac, w);
        }

        public bool Equals(Triangle triangle)
        {
            return triangle.a.Equals(this.a) && triangle.b.Equals(this.b) && triangle.c.Equals(this.c);
        }
    }
}
