using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace THREE.Math
{
    public class Matrix3
    {
        public double[] elements;

        public Matrix3()
        {
            this.elements = new double[] {
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            };
        }
    }
}
