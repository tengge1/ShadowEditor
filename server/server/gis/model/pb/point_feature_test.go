package pb

import (
	"testing"

	proto "github.com/golang/protobuf/proto"
)

func TestPointFeature(t *testing.T) {
	// marshal
	point := PointFeature{
		Id:   "1",
		Bbox: []float64{2, 3, 4, 5},
		Geometry: &PointGeometry{
			Type:        "Point",
			Coordinates: &Coordinate{X: 6, Y: 7},
		},
		Properties: map[string]*VariantValue{
			"name": &VariantValue{Value: &VariantValue_String_{"Point 1"}},
		},
	}
	byts, err := proto.Marshal(&point)
	if err != nil {
		t.Error(err)
	}

	// unmarshal
	var feature PointFeature
	if err := proto.Unmarshal(byts, &feature); err != nil {
		t.Error(err)
	}

	if feature.Id != "1" {
		t.Errorf("expect 1, get %v", feature.Id)
	}

	if feature.Bbox[0] != 2 {
		t.Errorf("expect 2, get %v", feature.Bbox[0])
	}

	if feature.Bbox[1] != 3 {
		t.Errorf("expect 3, get %v", feature.Bbox[1])
	}

	if feature.Bbox[2] != 4 {
		t.Errorf("expect 4, get %v", feature.Bbox[2])
	}

	if feature.Bbox[3] != 5 {
		t.Errorf("expect 5, get %v", feature.Bbox[3])
	}

	if feature.Geometry.Type != "Point" {
		t.Errorf("expect Point, get %v", feature.Geometry.Type)
	}

	if feature.Geometry.Coordinates.X != 6 {
		t.Errorf("expect 6, get %v", feature.Geometry.Coordinates.X)
	}

	if feature.Geometry.Coordinates.Y != 7 {
		t.Errorf("expect 7, get %v", feature.Geometry.Coordinates.Y)
	}

	if feature.Properties["name"].GetString_() != "Point 1" {
		t.Errorf("expect Point 1, get %v", feature.Properties["name"].GetString_())
	}
}
