using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace THREE.Math
{
    public class Vector2
    {
        public double x = 0;
        public double y = 0;

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

        public bool isVector2 = true;

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
                // console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
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
    }
}
