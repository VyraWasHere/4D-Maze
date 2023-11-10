class Maze {
  constructor(sideLength) {
    this.maze = new Array(sideLength);
    this.size = sideLength;
    this.startPos, this.endPos;
    console.log("Setting up maze...");
    this.initiate();
    this.generatePathways();
  }

  initiate() {
    // Initiate a 4x4 empty matrix with adjecent cells
    for (let x = 0; x < this.size; x++) {
      this.maze[x] = new Array(this.size);
      for (let y = 0; y < this.size; y++) {
        this.maze[x][y] = new Array(this.size);
        for (let z = 0; z < this.size; z++) {
          this.maze[x][y][z] = new Array(this.size);
          for (let w = 0; w < this.size; w++) {
            this.maze[x][y][z][w] = new Cell();

            if (x > 0) {
              this.maze[x][y][z][w].adjacentCells.push(
                this.maze[x - 1][y][z][w]
              );
              this.maze[x - 1][y][z][w].adjacentCells.push(
                this.maze[x][y][z][w]
              );
            }
            if (y > 0) {
              this.maze[x][y][z][w].adjacentCells.push(
                this.maze[x][y - 1][z][w]
              );
              this.maze[x][y - 1][z][w].adjacentCells.push(
                this.maze[x][y][z][w]
              );
            }
            if (z > 0) {
              this.maze[x][y][z][w].adjacentCells.push(
                this.maze[x][y][z - 1][w]
              );
              this.maze[x][y][z - 1][w].adjacentCells.push(
                this.maze[x][y][z][w]
              );
            }
            if (w > 0) {
              this.maze[x][y][z][w].adjacentCells.push(
                this.maze[x][y][z][w - 1]
              );
              this.maze[x][y][z][w - 1].adjacentCells.push(
                this.maze[x][y][z][w]
              );
            }
          }
        }
      }
    }
  }

  generatePathways() {
    let randomX = Math.floor(Math.random() * (this.size / 4));
    let randomY = Math.floor(Math.random() * (this.size / 4));
    let randomZ = Math.floor(Math.random() * (this.size / 4));
    let randomW = Math.floor(Math.random() * (this.size / 4));

    this.startPos = new Quaternion(randomX, randomY, randomZ, randomW);
    this.endPos = new Quaternion(
      this.size - 1 - randomX,
      this.size - 1 - randomY,
      this.size - 1 - randomZ,
      this.size - 1 - randomW
    );

    let startCell = this.maze[randomX][randomY][randomZ][randomW];
    let cellStack = [];
    let currentCell = startCell;
    let nextCell;

    while (currentCell != undefined) {
      currentCell.visited = true;
      nextCell = currentCell.next();

      if (currentCell.unvisitedAdjacent.length > 1) {
        cellStack.push(currentCell);
      }

      if (nextCell == undefined) {
        nextCell = cellStack.pop();
      }

      currentCell = nextCell;
    }
    console.log("Finished generating maze");
  }

  /**
   * @param {Quaternion} fromPos
   * @param {Quaternion} deltaPos Quat representing the change in position
   */
  hasConnection(fromPos, deltaPos) {
    let toPos = fromPos.add(deltaPos);
     if (
      (toPos.w >= 0 && toPos.w < this.size) &&
      (toPos.x >= 0 && toPos.x < this.size) &&
      (toPos.y >= 0 && toPos.y < this.size) &&
      (toPos.z >= 0 && toPos.z < this.size)
    ) {
      return this.maze[fromPos.w][fromPos.x][fromPos.y][fromPos.z].connectsTo(
        this.maze[toPos.w][toPos.x][toPos.y][toPos.z]
      );
    } else {
      return false;
    }
  }
}
