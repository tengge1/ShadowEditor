define(["world/Utils"], function(Utils) {
  /**
   * 三维空间中的平面,其法向量为(A,B,C)
   * @param A
   * @param B
   * @param C
   * @param D
   * @return {Object}
   * @constructor
   */
  var Plan = function(A, B, C, D) {
    if (!Utils.isNumber(A)) {
      throw "invalid A";
    }
    if (!Utils.isNumber(B)) {
      throw "invalid B";
    }
    if (!Utils.isNumber(C)) {
      throw "invalid C";
    }
    if (!Utils.isNumber(D)) {
      throw "invalid D";
    }
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D;
  };
  Plan.prototype.constructor = Plan;
  Plan.prototype.getCopy = function() {
    var planCopy = new Plan(this.A, this.B, this.C, this.D);
    return planCopy;
  };
  return Plan;
});