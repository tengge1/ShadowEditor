using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author Mugen87 / https://github.com/Mugen87
    /// @author tengge / https://github.com/tengge1
    /// Ref: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
    /// </summary>
    public class Cylindrical
    {
        public double radius;
        public double theta;
        public double y;

        public Cylindrical(double radius = 1.0, double theta = 0, double y = 0)
        {
            this.radius = radius; // distance from the origin to a point in the x-z plane
            this.theta = theta; // counterclockwise angle in the x-z plane measured in radians from the positive z-axis
            this.y = y; // height above the x-z plane
        }

        public Cylindrical Set(double radius, double theta, double y)
        {
            this.radius = radius;
            this.theta = theta;
            this.y = y;

            return this;
        }

        public Cylindrical Clone()
        {
            return new Cylindrical().Copy(this);
        }

        public Cylindrical Copy(Cylindrical other)
        {
            this.radius = other.radius;
            this.theta = other.theta;
            this.y = other.y;

            return this;
        }

        public Cylindrical SetFromVector3(Vector3 v)
        {
            return this.setFromCartesianCoords(v.x, v.y, v.z);
        }

        Cylindrical SetFromCartesianCoords(double x, double y, double z)
        {
            this.radius = _Math.Sqrt(x * x + z * z);
            this.theta = _Math.Atan2(x, z);
            this.y = y;

            return this;
        }
    }
}
