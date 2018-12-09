using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace THREE
{
    /// <summary>
    /// @author mrdoob / http://mrdoob.com/
    /// @author alteredq / http://alteredqualia.com/
    /// @author bhouston / http://clara.io
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Frustum
    {
        public Plane[] planes;

        public Frustum(Plane p0 = null, Plane p1 = null, Plane p2 = null, Plane p3 = null, Plane p4 = null, Plane p5 = null)
        {
            this.planes = new Plane[] {
                p0?? new Plane(),
                p1?? new Plane(),
                p2?? new Plane(),
                p3?? new Plane(),
                p4?? new Plane(),
                p5?? new Plane()
            };
        }

        public Frustum Set(Plane p0, Plane p1, Plane p2, Plane p3, Plane p4, Plane p5)
        {
            var planes = this.planes;

            planes[0].Copy(p0);
            planes[1].Copy(p1);
            planes[2].Copy(p2);
            planes[3].Copy(p3);
            planes[4].Copy(p4);
            planes[5].Copy(p5);

            return this;
        }

        public Frustum Clone()
        {
            return new Frustum().Copy(this);
        }

        public Frustum Copy(Frustum frustum)
        {
            var planes = this.planes;

            for (var i = 0; i < 6; i++)
            {
                planes[i].Copy(frustum.planes[i]);
            }

            return this;
        }

        public Frustum SetFromMatrix(Matrix4 m)
        {
            var planes = this.planes;
            var me = m.elements;
            double me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
            double me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
            double me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
            double me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

            planes[0].SetComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).Normalize();
            planes[1].SetComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).Normalize();
            planes[2].SetComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).Normalize();
            planes[3].SetComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).Normalize();
            planes[4].SetComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).Normalize();
            planes[5].SetComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).Normalize();

            return this;
        }

        public bool IntersectsSphere(Sphere sphere)
        {
            var planes = this.planes;
            var center = sphere.center;
            var negRadius = -sphere.radius;

            for (var i = 0; i < 6; i++)
            {

                var distance = planes[i].DistanceToPoint(center);

                if (distance < negRadius)
                {
                    return false;
                }
            }

            return true;
        }

        public bool IntersectsBox(Box3 box)
        {
            var p = new Vector3();

            var planes = this.planes;

            for (var i = 0; i < 6; i++)
            {
                var plane = planes[i];

                // corner at max distance

                p.x = plane.normal.x > 0 ? box.max.x : box.min.x;
                p.y = plane.normal.y > 0 ? box.max.y : box.min.y;
                p.z = plane.normal.z > 0 ? box.max.z : box.min.z;

                if (plane.DistanceToPoint(p) < 0)
                {
                    return false;
                }
            }

            return true;
        }

        public bool ContainsPoint(Vector3 point)
        {
            var planes = this.planes;

            for (var i = 0; i < 6; i++)
            {
                if (planes[i].DistanceToPoint(point) < 0)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
