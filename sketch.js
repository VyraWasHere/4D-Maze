let player, maze;

function setup() {
  maze = new Maze(2);
  player = new Player(maze.startPos);
  createCanvas(800, 600);
  drawView(); // Allow for first-time render
}

function drawView() {
  resetMatrix();
  background(0);
  stroke(0);
  let padding = createVector(15, 30);
  let textHeight = 20;
  textSize(25);
  fill(255);
  text("Coordinates", padding.x, padding.y);

  let axisColors = {
    0: color(255, 0, 0), // X-axis, red
    1: color(0, 255, 0), // Y-axis, green
    2: color(0, 0, 255), // Z-axis, blue
    3: color(255, 0, 255) // W-axis, purple
  };

  textSize(20);
  fill(axisColors[0]);
  let s = `X: ${player.position.w}`;
  text(s, padding.x, padding.y + textHeight);

  fill(axisColors[1]);
  s = `Y: ${player.position.x}`;
  text(s, padding.x, padding.y + 2 * textHeight);

  fill(axisColors[2]);
  s = `Z: ${player.position.y}`;
  text(s, padding.x, padding.y + 3 * textHeight);

  fill(axisColors[3]);
  s = `W: ${player.position.z}`;
  text(s, padding.x, padding.y + 4 * textHeight);

  strokeWeight(textHeight / 4);
  let axisSize = 50;
  let centerPoint = createVector(
    axisSize + padding.x,
    height - axisSize - padding.y
  );

  textSize(25);
  fill(255);
  text(
    "Orientation",
    padding.x,
    height - padding.y - textHeight - axisSize * 2
  );

  let xVec = player.viewX.toVector();
  let xIndex = xVec.findIndex(x => Math.abs(x) === 1);
  let xAxisDirection = xVec[xIndex];

  let yVec = player.viewY.toVector();
  let yIndex = yVec.findIndex(y => Math.abs(y) === 1);
  let yAxisDirection = yVec[yIndex];

  stroke(axisColors[xIndex]);
  line(
    centerPoint.x,
    centerPoint.y,
    centerPoint.x + axisSize * xAxisDirection,
    centerPoint.y
  );

  stroke(axisColors[yIndex]);
  line(
    centerPoint.x,
    centerPoint.y,
    centerPoint.x,
    centerPoint.y - axisSize * yAxisDirection
  );

  stroke(255);
  strokeWeight(textHeight / 8);
  let mazeSize = 400;
  let cellSize = mazeSize / maze.size;
  translate((width - mazeSize) / 2, height - (height - mazeSize) / 2);

  let startPos = createVector(
    xAxisDirection < 0 ? mazeSize : 0,
    yAxisDirection < 0 ? -mazeSize : 0
  );
  let currentPos = createVector();
  currentPos = Object.assign(currentPos, startPos);

  for (let viewX = 0; Math.abs(viewX) < maze.size; ) {
    for (let viewY = 0; Math.abs(viewY) < maze.size; ) {
      let globalPos = player
        .getViewProjection()
        .add(player.viewX.scale(viewX))
        .add(player.viewY.scale(-viewY)); // Negative due to screen y-axis being positive downwards

      if (globalPos.equals(maze.endPos)) {
        fill(128);
        noStroke();
        rect(
          currentPos.x,
          currentPos.y,
          cellSize * xAxisDirection,
          cellSize * -yAxisDirection
        );
      }

      if (globalPos.equals(player.position)) {
        stroke(255);
        let r = cellSize / 2;
        ellipse(
          currentPos.x + r * xAxisDirection,
          currentPos.y + r * -yAxisDirection,
          cellSize * 0.8,
          cellSize * 0.8
        );
      }
      if (!maze.hasConnection(globalPos, player.viewY.scale(-yAxisDirection))) {
        stroke(255);
        line(
          currentPos.x,
          currentPos.y,
          currentPos.x + cellSize * xAxisDirection,
          currentPos.y
        );
      }
      if (!maze.hasConnection(globalPos, player.viewY.scale(yAxisDirection))) {
        stroke(255);
        line(
          currentPos.x,
          currentPos.y + cellSize * -yAxisDirection,
          currentPos.x + cellSize * xAxisDirection,
          currentPos.y + cellSize * -yAxisDirection
        );
      }
      if (!maze.hasConnection(globalPos, player.viewX.scale(-xAxisDirection))) {
        stroke(255);
        line(
          currentPos.x,
          currentPos.y,
          currentPos.x,
          currentPos.y + cellSize * -yAxisDirection
        );
      }
      if (!maze.hasConnection(globalPos, player.viewX.scale(xAxisDirection))) {
        stroke(255);
        line(
          currentPos.x + cellSize * xAxisDirection,
          currentPos.y,
          currentPos.x + cellSize * xAxisDirection,
          currentPos.y + cellSize * -yAxisDirection
        );
      }
      viewY -= yAxisDirection;
      currentPos.add(0, cellSize * -yAxisDirection);
    }
    currentPos.y = startPos.y;
    viewX += xAxisDirection;
    currentPos.add(cellSize * xAxisDirection, 0);
  }
  // if (maze.hasConnection())
}

function keyTyped() {
  if (Object.values(rotPlane).includes(key)) {
    player.rotateView(key);
  }
  drawView();
}

function keyPressed() {
  const movementCmdMap = {
    w: createVector(0, 1),
    a: createVector(-1, 0),
    s: createVector(0, -1),
    d: createVector(1, 0)
  };

  if (key in movementCmdMap) {
    let globalMove = player.getMoveFromLocal(movementCmdMap[key]);
    if (maze.hasConnection(player.position, globalMove)) {
      player.move(globalMove);
      translate(movementCmdMap[key]);
      if (player.position.equals(maze.endPos)) {
        console.log("You won!");
      }
    } else {
      console.log("You hit a wall");
    }
  }
  drawView();
}
