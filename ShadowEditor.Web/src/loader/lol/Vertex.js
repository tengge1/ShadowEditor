/**
 * @author lolking / http://www.lolking.net/models
 * @author tengge / https://github.com/tengge1
 * @param {DataView2} r 数据视图
 */
function Vertex(r) {
    var self = this,
        i;
    self.position = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.normal = [r.getFloat(), r.getFloat(), r.getFloat(), 0];
    self.u = r.getFloat();
    self.v = r.getFloat();
    self.bones = new Array(4);
    for (i = 0; i < 4; ++i) {
        self.bones[i] = r.getUint8();
    }
    self.weights = new Array(4);
    for (i = 0; i < 4; ++i) {
        self.weights[i] = r.getFloat();
    }
}

export default Vertex;