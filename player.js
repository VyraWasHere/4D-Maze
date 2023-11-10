class Player {
  constructor(startPosQuat) {
    this.position = startPosQuat;
    this.viewX = new Quaternion(1, 0, 0, 0); // The horizontal axis of the player's 2D crosssection view
    this.viewY = new Quaternion(0, 1, 0, 0); // The vertical axis of the player's 2D crosssection view
    this.viewZ = new Quaternion(0, 0, 1, 0); // The axis facing towards/away from the screen
    this.viewW = new Quaternion(0, 0, 0, 1); // The axis inwards/outwards of the current 3D space
  }

  /**
   * When the player wants to move in the view-oriented direction given by the vector v,
   * the increment in position will be adjusted accordingly to which two axis are rotated into the player's current 2D crossection view
   * @param {Quaternion} mq Movement Quaternion
   */
  move(mq) {
    this.position = this.position.add(mq);
    console.log(this.position);
  }

  /**
   * When the player wants to move in the view-oriented direction given by the vector mv,
   * find the global change in position relative to local orientation
   * @param {[]} mv View-oriented movement vector
   */
  getMoveFromLocal(mv) {
    let mq_x = this.viewX.scale(mv.x);
    let mq_y = this.viewY.scale(mv.y);
    return mq_x.add(mq_y);
  }

  /**
   * Rotates the player's 2D crossection view using a 4x4 4D-rotation matrix
   * @param {String} planeEnum String Object representing the view-oriented plane of rotation the player wants to rotate
   * (i => XY-plane, j => XZ-plane, k => YZ-plane, l => XW-plane, t => YW-plane, f => ZW-plane)
   */
  rotateView(planeEnum) {
    let basisVec = { a: null, b: null };
    let inverse = planeEnum == planeEnum.toUpperCase();

    switch (planeEnum.toLowerCase()) {
      case "i":
        basisVec.a = this.viewX;
        basisVec.b = this.viewY;
        break;
      case "j":
        basisVec.a = this.viewX;
        basisVec.b = this.viewZ;
        break;
      case "k":
        basisVec.a = this.viewY;
        basisVec.b = this.viewZ;
        break;
      case "l":
        basisVec.a = this.viewX;
        basisVec.b = this.viewW;
        break;
      case "t":
        basisVec.a = this.viewY;
        basisVec.b = this.viewW;
        break;
      case "f":
        basisVec.a = this.viewZ;
        basisVec.b = this.viewW;
        break;
    }

    this.rotatePlane(basisVec, inverse);
  }

  /**
   * @param {*} basisVec The two orthonormal basis vectors {a, b} that makes up the plane of rotation
   * @param {boolean} inverse To rotate with left-hand rule if true or right-hand rule if false
   */
  rotatePlane(basisVec, inverse) {
    let colVec = basisVec.a.toVector();
    let colIndex = colVec.findIndex(x => Math.abs(x) === 1);
    let rowVec = basisVec.b.toVector();
    let rowIndex = rowVec.findIndex(x => Math.abs(x) === 1);
    let rotMatrix = getRotationMatrix(rowIndex, colIndex, inverse);

    let resVecA = math.multiply(rotMatrix, colVec).toArray();
    let resVecB = math.multiply(rotMatrix, rowVec).toArray();

    basisVec.a.w = resVecA[0];
    basisVec.a.x = resVecA[1];
    basisVec.a.y = resVecA[2];
    basisVec.a.z = resVecA[3];

    basisVec.b.w = resVecB[0];
    basisVec.b.x = resVecB[1];
    basisVec.b.y = resVecB[2];
    basisVec.b.z = resVecB[3];
  }

  /**
   *
   */
  getViewProjection(viewX, viewY) {
    let posVector = this.position.toVector();
    let zViewIndex = this.viewZ.toVector().findIndex(z => Math.abs(z) === 1);
    let wViewIndex = this.viewW.toVector().findIndex(w => Math.abs(w) === 1);
    let viewZ = posVector[zViewIndex];
    let viewW = posVector[wViewIndex];
    let projectionVec = new Array(4).fill(0);
    projectionVec[zViewIndex] = viewZ;
    projectionVec[wViewIndex] = viewW;
    return new Quaternion(projectionVec);
  }
}
