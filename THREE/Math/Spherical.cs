using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

/**
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 * @author tengge / https://github.com/tengge1
 *
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 *
 * The polar angle (phi) is measured from the positive y-axis. The positive y-axis is up.
 * The azimuthal angle (theta) is measured from the positive z-axiz.
 */
namespace THREE
{
    /// <summary>
    /// @author bhouston / http://clara.io
    /// @author WestLangley / http://github.com/WestLangley
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Spherical
    {
        public double radius;
        public double phi;
        public double theta;

        public Spherical(double radius = 1.0, double phi = 0.0, double theta = 0.0)
        {
            this.radius = radius;
            this.phi = phi; // polar angle
            this.theta = theta; // azimuthal angle
        }

        public Spherical Set(double radius, double phi, double theta)
        {
            this.radius = radius;
            this.phi = phi;
            this.theta = theta;

            return this;
        }

        public Spherical Clone()
        {
            return new Spherical().Copy(this);
        }

        public Spherical Copy(Spherical other)
        {
            this.radius = other.radius;
            this.phi = other.phi;
            this.theta = other.theta;

            return this;
        }

        // restrict phi to be betwee EPS and PI-EPS
        public Spherical MakeSafe()
        {
            var EPS = 0.000001;
            this.phi = _Math.Max(EPS, _Math.Min(_Math.PI - EPS, this.phi));

            return this;
        }

        public Spherical SetFromVector3(Vector3 v)
        {
            return this.SetFromCartesianCoords(v.x, v.y, v.z);
        }

        public Spherical SetFromCartesianCoords(double x, double y, double z)
        {
            this.radius = _Math.Sqrt(x * x + y * y + z * z);

            if (this.radius == 0)
            {
                this.theta = 0;
                this.phi = 0;
            }
            else
            {
                this.theta = _Math.Atan2(x, z);
                this.phi = _Math.Acos(Math.Clamp(y / this.radius, -1, 1));
            }

            return this;
        }
    }
}
