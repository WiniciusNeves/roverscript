export class Grid {
  width: number;
  height: number;

  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
  }

  inBounds(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}

export default Grid;
