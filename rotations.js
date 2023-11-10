// TODO: Display input controls in-game
const rotPlane = {
  XY_r: "i",
  XZ_r: "j",
  YZ_r: "k",
  XW_r: "l",
  YW_r: "t",
  ZW_r: "f",
  XY_l: "I",
  XZ_l: "J",
  YZ_l: "K",
  XW_l: "L",
  YW_l: "T",
  ZW_l: "F"
};
Object.freeze(rotPlane);

const Rotations = {
  R_xy: math.matrix([[0, -1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]),
  R_xz: math.matrix([[0, 0, -1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]]),
  R_xw: math.matrix([[0, 0, 0, -1], [0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0]]),
  R_yz: math.matrix([[1, 0, 0, 0], [0, 0, -1, 0], [0, 1, 0, 0], [0, 0, 0, 1]]),
  R_yw: math.matrix([[1, 0, 0, 0], [0, 0, 0, -1], [0, 0, 1, 0], [0, 1, 0, 0]]),
  R_zw: math.matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, -1], [0, 0, 1, 0]])
};

const rotMatrix = [
  [null, Rotations.R_xy, Rotations.R_xz, Rotations.R_xw],
  [Rotations.R_xy, null, Rotations.R_yz, Rotations.R_yw],
  [Rotations.R_xz, Rotations.R_yz, null, Rotations.R_zw],
  [Rotations.R_xw, Rotations.R_yw, Rotations.R_zw, null]
];

function getRotationMatrix(rowIndex, colIndex, inverse = false) {
  let m = rotMatrix[rowIndex][colIndex].clone();
  console.log(m);
  if (inverse) {
    if (colIndex > rowIndex) {
      m.subset(math.index(colIndex, rowIndex), -1);
      m.subset(math.index(rowIndex, colIndex), 1);
    } else {
      m.subset(math.index(colIndex, rowIndex), 1);
      m.subset(math.index(rowIndex, colIndex), -1);
    }
  }
  return m;
}
