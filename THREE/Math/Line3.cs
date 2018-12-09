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
    public class Line3
    {
        public Vector3 start;
        public Vector3 end;

        public Line3(Vector3 start = null, Vector3 end = null)
        {
            this.start = (start != null) ? start : new Vector3();
            this.end = (end != null) ? end : new Vector3();
        }

        public Line3 Set(Vector3 start, Vector3 end)
        {
            this.start.Copy(start);
            this.end.Copy(end);

            return this;
        }

        public Line3 Clone()
        {
            return new Line3().Copy(this);
        }

        public Line3 Copy(Line3 line)
        {
            this.start.Copy(line.start);
            this.end.Copy(line.end);

            return this;
        }

        public Vector3 GetCenter(Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Line3: .getCenter() target is now required");
                target = new Vector3();
            }

            return target.AddVectors(this.start, this.end).MultiplyScalar(0.5);
        }

        public Vector3 Delta(Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Line3: .delta() target is now required");
                target = new Vector3();
            }

            return target.SubVectors(this.end, this.start);
        }

        public double DistanceSq()
        {
            return this.start.DistanceToSquared(this.end);
        }

        public double Distance()
        {
            return this.start.DistanceTo(this.end);
        }

        public Vector3 At(double t, Vector3 target = null)
        {
            if (target == null)
            {
                Console.WriteLine("THREE.Line3: .at() target is now required");
                target = new Vector3();
            }

            return this.Delta(target).MultiplyScalar(t).Add(this.start);
        }

        public double ClosestPointToPointParameter(Vector3 point, bool clampToLine = false)
        {
            var startP = new Vector3();
            var startEnd = new Vector3();

            startP.SubVectors(point, this.start);
            startEnd.SubVectors(this.end, this.start);

            var startEnd2 = startEnd.Dot(startEnd);
            var startEnd_startP = startEnd.Dot(startP);

            var t = startEnd_startP / startEnd2;

            if (clampToLine)
            {
                t = Math.Clamp(t, 0, 1);
            }

            return t;
        }

        public Vector3 ClosestPointToPoint(Vector3 point, bool clampToLine = false, Vector3 target = null)
        {
            var t = this.ClosestPointToPointParameter(point, clampToLine);

            if (target == null)
            {
                Console.WriteLine("THREE.Line3: .closestPointToPoint() target is now required");
                target = new Vector3();
            }

            return this.Delta(target).MultiplyScalar(t).Add(this.start);
        }

        public Line3 ApplyMatrix4(Matrix4 matrix)
        {
            this.start.ApplyMatrix4(matrix);
            this.end.ApplyMatrix4(matrix);

            return this;
        }

        public bool Equals(Line3 line)
        {
            return line.start.Equals(this.start) && line.end.Equals(this.end);
        }
    }
}
