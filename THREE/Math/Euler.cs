using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author mrdoob / http://mrdoob.com/
    /// @author WestLangley / http://github.com/WestLangley
    /// @author bhouston / http://clara.io
    /// @author tengge / https://github.com/tengge1
    /// </summary>
    public class Euler
    {
        public static string[] RotationOrders = new string[] { "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX" };
        public static string DefaultOrder = "XYZ";

        public double _x;
        public double _y;
        public double _z;
        public string _order;

        public Euler(double x = 0, double y = 0, double z = 0, string order = "XYZ")
        {
            this._x = x;
            this._y = y;
            this._z = z;
            this._order = order;

            this.OnChangeCallback = _OnChangeCallback;
        }

        public double X
        {
            get { return this._x; }
            set
            {
                this._x = value;
                this.OnChangeCallback();
            }
        }

        public double Y
        {
            get { return this._y; }
            set
            {
                this._y = value;
                this.OnChangeCallback();
            }
        }

        public double Z
        {
            get { return this._z; }
            set
            {
                this._z = value;
                this.OnChangeCallback();
            }
        }

        public string Order
        {

            get { return this._order; }
            set
            {
                this._order = value;
                this.OnChangeCallback();
            }

        }

        public const bool isEuler = true;

        public Euler Set(double x, double y, double z, string order = null)
        {
            this._x = x;
            this._y = y;
            this._z = z;

            this._order = order == null ? this._order : order;

            this.OnChangeCallback();

            return this;
        }

        public Euler Clone()
        {
            return new Euler(this._x, this._y, this._z, this._order);
        }

        public Euler Copy(Euler euler)
        {
            this._x = euler._x;
            this._y = euler._y;
            this._z = euler._z;
            this._order = euler._order;

            this.OnChangeCallback();

            return this;
        }

        public Euler SetFromRotationMatrix(Matrix4 m, string order = null, bool update = true)
        {
            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var te = m.elements;
            double m11 = te[0], m12 = te[4], m13 = te[8];
            double m21 = te[1], m22 = te[5], m23 = te[9];
            double m31 = te[2], m32 = te[6], m33 = te[10];

            order = order == null ? this._order : order;

            if (order == "XYZ")
            {
                this._y = _Math.Asin(Math.Clamp(m13, -1, 1));

                if (_Math.Abs(m13) < 0.99999)
                {
                    this._x = _Math.Atan2(-m23, m33);
                    this._z = _Math.Atan2(-m12, m11);
                }
                else
                {
                    this._x = _Math.Atan2(m32, m22);
                    this._z = 0;
                }
            }
            else if (order == "YXZ")
            {
                this._x = _Math.Asin(-Math.Clamp(m23, -1, 1));

                if (_Math.Abs(m23) < 0.99999)
                {
                    this._y = _Math.Atan2(m13, m33);
                    this._z = _Math.Atan2(m21, m22);
                }
                else
                {
                    this._y = _Math.Atan2(-m31, m11);
                    this._z = 0;
                }
            }
            else if (order == "ZXY")
            {
                this._x = _Math.Asin(Math.Clamp(m32, -1, 1));

                if (_Math.Abs(m32) < 0.99999)
                {
                    this._y = _Math.Atan2(-m31, m33);
                    this._z = _Math.Atan2(-m12, m22);
                }
                else
                {
                    this._y = 0;
                    this._z = _Math.Atan2(m21, m11);
                }
            }
            else if (order == "ZYX")
            {
                this._y = _Math.Asin(-Math.Clamp(m31, -1, 1));

                if (_Math.Abs(m31) < 0.99999)
                {
                    this._x = _Math.Atan2(m32, m33);
                    this._z = _Math.Atan2(m21, m11);
                }
                else
                {
                    this._x = 0;
                    this._z = _Math.Atan2(-m12, m22);
                }
            }
            else if (order == "YZX")
            {
                this._z = _Math.Asin(Math.Clamp(m21, -1, 1));

                if (_Math.Abs(m21) < 0.99999)
                {
                    this._x = _Math.Atan2(-m23, m22);
                    this._y = _Math.Atan2(-m31, m11);
                }
                else
                {
                    this._x = 0;
                    this._y = _Math.Atan2(m13, m33);
                }
            }
            else if (order == "XZY")
            {
                this._z = _Math.Asin(-Math.Clamp(m12, -1, 1));

                if (_Math.Abs(m12) < 0.99999)
                {
                    this._x = _Math.Atan2(m32, m22);
                    this._y = _Math.Atan2(m13, m11);
                }
                else
                {
                    this._x = _Math.Atan2(-m23, m33);
                    this._y = 0;
                }
            }
            else
            {
                Console.WriteLine("THREE.Euler: .setFromRotationMatrix() given unsupported order: " + order);
            }

            this._order = order;

            if (update != false) this.OnChangeCallback();

            return this;
        }

        public Euler SetFromQuaternion(Quaternion q, string order, bool update = true)
        {
            var matrix = new Matrix4();

            matrix.MakeRotationFromQuaternion(q);

            return this.SetFromRotationMatrix(matrix, order, update);
        }

        public Euler SetFromVector3(Vector3 v, string order = null)
        {
            order = order == null ? this._order : order;

            return this.Set(v.x, v.y, v.z, order);
        }

        public Euler Reorder(string newOrder)
        {
            // WARNING: this discards revolution information -bhouston
            var q = new Quaternion();

            q.SetFromEuler(this);

            return this.SetFromQuaternion(q, newOrder);
        }

        public bool Equals(Euler euler)
        {
            return euler._x == this._x && euler._y == this._y && euler._z == this._z && euler._order == this._order;
        }

        public Euler FromArray(double[] array, string order = null)
        {
            this._x = array[0];
            this._y = array[1];
            this._z = array[2];
            if (order != null) this._order = order;

            this.OnChangeCallback();

            return this;
        }

        public double[] ToArray(ref string order, double[] array = null, int offset = 0)
        {
            if (array == null)
            {
                array = new double[3];
            }

            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            order = this._order;

            return array;
        }

        public Vector3 ToVector3(Vector3 optionalResult = null)
        {
            if (optionalResult != null)
            {
                return optionalResult.Set(this._x, this._y, this._z);
            }
            else
            {
                return new Vector3(this._x, this._y, this._z);
            }
        }

        public Euler OnChange(OnChangeCallBackFun callback)
        {
            this.OnChangeCallback = callback;

            return this;
        }

        public delegate void OnChangeCallBackFun();

        private void _OnChangeCallback()
        {

        }

        public OnChangeCallBackFun OnChangeCallback;
    }
}
