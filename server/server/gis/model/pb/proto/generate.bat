protoc -I=. --go_out=../../ ./point_feature.proto ^
./linestring_feature.proto ./polygon_feature.proto ^
./feature_collection.proto