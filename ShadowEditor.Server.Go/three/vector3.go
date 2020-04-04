package three

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

func NewVector3(x, y, z float64) *Vector3 {
	return &Vector3{x, y, z}
}

type Vector3 struct {
	X float64
	Y float64
	Z float64
}
