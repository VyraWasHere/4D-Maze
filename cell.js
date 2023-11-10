class Cell {
  constructor() {
    this.visited = false;
    this.adjacentCells = [];
    this.unvisitedAdjacent = [];
    this.connections = [];
  }

  next() {
    this.unvisitedAdjacent = this.adjacentCells.filter(c => !c.visited);

    if (this.unvisitedAdjacent.length != 0) {
      let randomIndex = Math.floor(
        Math.random() * this.unvisitedAdjacent.length
      );

      this.connections.push(this.unvisitedAdjacent[randomIndex]);
      this.unvisitedAdjacent[randomIndex].connections.push(this);
      return this.unvisitedAdjacent[randomIndex];
    } else {
      return undefined;
    }
  }

  connectsTo(other) {
    return this.connections.includes(other);
  }
}
