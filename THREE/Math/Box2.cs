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
    public class Box2
    {
        public Vector2 min;
        public Vector2 max;

        public Box2(Vector2 min = null, Vector2 max = null)
        {
            this.min = (min != null) ? min : new Vector2(double.PositiveInfinity, double.NegativeInfinity);
            this.max = (max != null) ? max : new Vector2(double.NegativeInfinity, double.NegativeInfinity);
        }

        public Box2 Set(Vector2 min, Vector2 max)
        {
            this.min.Copy(min);
            this.max.Copy(max);

            return this;
        }

        public Box2 SetFromPoints(Vector2[] points)
        {
            this.MakeEmpty();

            for (int i = 0, il = points.Length; i < il; i++)
            {
                this.ExpandByPoint(points[i]);
            }

            return this;
        }

        public Box2 SetFromCenterAndSize(Vector2 center, Vector2 size)
        {
            var v1 = new Vector2();

            var halfSize = v1.Copy(size).MultiplyScalar(0.5);
            this.min.Copy(center).Sub(halfSize);
            this.max.Copy(center).Add(halfSize);

            return this;
        }

        public Box2 Clone()
        {
            return new Box2().Copy(this);
        }

        public Box2 Copy(Box2 box)
        {
            this.min.Copy(box.min);
            this.max.Copy(box.max);

            return this;
        }

        public Box2 MakeEmpty()
        {
            this.min.x = this.min.y = double.PositiveInfinity;
            this.max.x = this.max.y = double.NegativeInfinity;

            return this;
        }

        public bool IsEmpty()
        {
            // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
            return this.max.x < this.min.x || this.max.y < this.min.y;
        }

        public Vector2 GetCenter(Vector2 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Box2: .getCenter() target is now required");
                target = new Vector2();
            }

            return this.IsEmpty() ? target.Set(0, 0) : target.AddVectors(this.min, this.max).MultiplyScalar(0.5);
        }

        public Vector2 GetSize(Vector2 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Box2: .getSize() target is now required");
                target = new Vector2();
            }

            return this.IsEmpty() ? target.Set(0, 0) : target.SubVectors(this.max, this.min);
        }

        public Box2 ExpandByPoint(Vector2 point)
        {
            this.min.Min(point);
            this.max.Max(point);

            return this;
        }

        public Box2 ExpandByVector(Vector2 vector)
        {
            this.min.Sub(vector);
            this.max.Add(vector);

            return this;
        }

        public Box2 ExpandByScalar(double scalar)
        {
            this.min.AddScalar(-scalar);
            this.max.AddScalar(scalar);

            return this;
        }

        public bool ContainsPoint(Vector2 point)
        {
            return point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y ? false : true;
        }

        public bool ContainsBox(Box2 box)
        {
            return this.min.x <= box.min.x && box.max.x <= this.max.x &&
                this.min.y <= box.min.y && box.max.y <= this.max.y;
        }

        public Vector2 GetParameter(Vector2 point, Vector2 target = null)
        {
            // This can potentially have a divide by zero if the box
            // has a size dimension of 0.
            if (target == null)
            {
                Console.WriteLine("THREE.Box2: .getParameter() target is now required");
                target = new Vector2();
            }

            return target.Set(
                (point.x - this.min.x) / (this.max.x - this.min.x),
                (point.y - this.min.y) / (this.max.y - this.min.y)
            );
        }

        public bool IntersectsBox(Box2 box)
        {
            // using 4 splitting planes to rule out intersections
            return box.max.x < this.min.x || box.min.x > this.max.x ||
                box.max.y < this.min.y || box.min.y > this.max.y ? false : true;
        }

        public Vector2 ClampPoint(Vector2 point, Vector2 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Box2: .clampPoint() target is now required");
                target = new Vector2();
            }

            return target.Copy(point).Clamp(this.min, this.max);
        }

        public double DistanceToPoint(Vector2 point)
        {
            var v1 = new Vector2();

            var clampedPoint = v1.Copy(point).Clamp(this.min, this.max);
            return clampedPoint.Sub(point).Length();
        }

        public Box2 Intersect(Box2 box)
        {
            this.min.Max(box.min);
            this.max.Min(box.max);

            return this;
        }

        public Box2 Union(Box2 box)
        {
            this.min.Min(box.min);
            this.max.Max(box.max);

            return this;
        }

        public Box2 Translate(Vector2 offset)
        {
            this.min.Add(offset);
            this.max.Add(offset);

            return this;
        }

        public bool Equals(Box2 box)
        {
            return box.min.Equals(this.min) && box.max.Equals(this.max);
        }
    }
}
