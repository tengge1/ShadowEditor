using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace THREE.Math
{
    public class Vector2
    {
        public double x = 0.0;
        public double y = 0.0;

        public Vector2(double x = 0, double y = 0)
        {
            this.x = x;
            this.y = y;
        }

        public double width
        {
            get
            {
                return this.x;
            }
            set
            {
                this.x = value;
            }
        }

        public double height
        {
            get
            {
                return this.y;
            }
            set
            {
                this.y = value;
            }
        }

        public const bool isVector2 = true;

        public Vector2 Set(double x, double y)
        {
            this.x = x;
            this.y = y;
            return this;
        }

        public Vector2 SetScalar(double scalar)
        {
            this.x = scalar;
            this.y = scalar;
            return this;
        }

        public Vector2 SetX(double x)
        {
            this.x = x;
            return this;
        }

        public Vector2 SetY(double y)
        {
            this.y = y;
            return this;
        }

        public Vector2 SetComponent(int index, double value)
        {
            switch (index)
            {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                default:
                    throw new Exception($"index is out of range: {index}");
            }

            return this;
        }

        public double GetComponent(int index)
        {
            switch (index)
            {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                default:
                    throw new Exception($"index is out of range: {index}");
            }
        }

        public Vector2 Clone(Vector2 v)
        {
            this.x = v.x;
            this.y = v.y;

            return this;
        }

        public Vector2 Add(Vector2 v, Vector2 w = null)
        {
            if (w != null)
            {
                Console.WriteLine("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
                return this.AddVectors(v, w);
            }

            this.x += v.x;
            this.y += v.y;

            return this;
        }

        public Vector2 AddScalar(double s)
        {
            this.x += s;
            this.y += s;

            return this;
        }

        public Vector2 AddVectors(Vector2 a, Vector2 b)
        {
            this.x = a.x + b.x;
            this.y = a.y + b.y;

            return this;
        }

        public Vector2 AddScaledVector(Vector2 v, double s)
        {
            this.x += v.x * s;
            this.y += v.y * s;

            return this;
        }

        public Vector2 Sub(Vector2 v, Vector2 w = null)
        {
            if (w != null)
            {

                Console.WriteLine("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
                return this.SubVectors(v, w);

            }

            this.x -= v.x;
            this.y -= v.y;

            return this;
        }

	     public Vector2 SubScalar(double s)
        {
            this.x -= s;
            this.y -= s;

            return this;
        }

	    public Vector2 SubVectors(Vector2 a, Vector2 b)
        {
            this.x = a.x - b.x;
            this.y = a.y - b.y;

            return this;
        }

	    public Vector2 Multiply(Vector2 v)
        {
            this.x *= v.x;
            this.y *= v.y;

            return this;
        }

	    public Vector2 MultiplyScalar(double scalar)
        {
            this.x *= scalar;
            this.y *= scalar;

            return this;
        }

	    public Vector2 Divide(Vector2 v)
        {
            this.x /= v.x;
            this.y /= v.y;

            return this;
        }

	    public Vector2 DivideScalar(double scalar)
        {
            return this.MultiplyScalar(1 / scalar);
        }

	    public Vector2 ApplyMatrix3(Matrix3 m)
        {
            double x = this.x, y = this.y;
            var e = m.elements;

            this.x = e[0] * x + e[3] * y + e[6];
            this.y = e[1] * x + e[4] * y + e[7];

            return this;
        }

	     public Vector2 Min(Vector2 v)
        {
            this.x = System.Math.Min(this.x, v.x);
            this.y = System.Math.Min(this.y, v.y);

            return this;
        }

	    public Vector2 Max(Vector2 v)
        {
            this.x = System.Math.Max(this.x, v.x);
            this.y = System.Math.Max(this.y, v.y);

            return this;
        }

	    public Vector2 Clamp(Vector2 min, Vector2 max)
        {
            // assumes min < max, componentwise
            this.x = System.Math.Max(min.x, System.Math.Min(max.x, this.x));
            this.y = System.Math.Max(min.y, System.Math.Min(max.y, this.y));

            return this;
        }

	     public Vector2 ClampScalar(Vector2 minVal, Vector2 maxVal)
        {
            var min = new Vector2();
            var max = new Vector2();

            min.set(minVal, minVal);
            max.set(maxVal, maxVal);

            return this.clamp(min, max);
        }

	clampLength: function(min, max )
        {

            var length = this.length();

            return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));

        },

	floor: function()
        {

            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);

            return this;

        },

	ceil: function()
        {

            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);

            return this;

        },

	round: function()
        {

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            return this;

        },

	roundToZero: function()
        {

            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);

            return this;

        },

	negate: function()
        {

            this.x = -this.x;
            this.y = -this.y;

            return this;

        },

	dot: function(v )
        {

            return this.x * v.x + this.y * v.y;

        },

	cross: function(v )
        {

            return this.x * v.y - this.y * v.x;

        },

	lengthSq: function()
        {

            return this.x * this.x + this.y * this.y;

        },

	length: function()
        {

            return Math.sqrt(this.x * this.x + this.y * this.y);

        },

	manhattanLength: function()
        {

            return Math.abs(this.x) + Math.abs(this.y);

        },

	normalize: function()
        {

            return this.divideScalar(this.length() || 1);

        },

	angle: function()
        {

            // computes the angle in radians with respect to the positive x-axis

            var angle = Math.atan2(this.y, this.x);

            if (angle < 0) angle += 2 * Math.PI;

            return angle;

        },

	distanceTo: function(v )
        {

            return Math.sqrt(this.distanceToSquared(v));

        },

	distanceToSquared: function(v )
        {

            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;

        },

	manhattanDistanceTo: function(v )
        {

            return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);

        },

	setLength: function(length )
        {

            return this.normalize().multiplyScalar(length);

        },

	lerp: function(v, alpha )
        {

            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;

            return this;

        },

	lerpVectors: function(v1, v2, alpha )
        {

            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

        },

	equals: function(v )
        {

            return ((v.x === this.x) && (v.y === this.y));

        },

	fromArray: function(array, offset )
        {

            if (offset === undefined) offset = 0;

            this.x = array[offset];
            this.y = array[offset + 1];

            return this;

        },

	toArray: function(array, offset )
        {

            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            array[offset] = this.x;
            array[offset + 1] = this.y;

            return array;

        },

	fromBufferAttribute: function(attribute, index, offset )
        {

            if (offset !== undefined)
            {

                console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');

            }

            this.x = attribute.getX(index);
            this.y = attribute.getY(index);

            return this;

        },

	rotateAround: function(center, angle )
        {

            var c = Math.cos(angle), s = Math.sin(angle);

            var x = this.x - center.x;
            var y = this.y - center.y;

            this.x = x * c - y * s + center.x;
            this.y = x * s + y * c + center.y;

            return this;

        }
    }
}
