export class Rover {
  public x: number;
  public y: number;
  public direction: string;
  private obstacles: Set<string>;
  public history: any[];

  constructor(x: number, y: number, direction: string) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.obstacles = new Set();
    this.history = [this.getState()];
  }

  addObstacle(x: number, y: number) {
    this.obstacles.add(`${x},${y}`);
  }

  getObstacles(): string[] {
    return Array.from(this.obstacles);
  }

  detectObstacle(offsetX: number, offsetY: number): boolean {
    let checkX = this.x;
    let checkY = this.y;

    if (this.direction === "N") { checkX += offsetX; checkY += offsetY; }
    if (this.direction === "S") { checkX -= offsetX; checkY -= offsetY; }
    if (this.direction === "E") { checkX += offsetY; checkY -= offsetX; }
    if (this.direction === "W") { checkX -= offsetY; checkY += offsetX; }

    return this.obstacles.has(`${checkX},${checkY}`);
  }

  turn(direction: string) {
    const directions = ["N", "E", "S", "W"];
    let currentIndex = directions.indexOf(this.direction);

    if (direction === "right") {
      currentIndex = (currentIndex + 1) % 4;
    } else if (direction === "left") {
      currentIndex = (currentIndex + 3) % 4;
    }

    this.direction = directions[currentIndex];
    this.history.push(this.getState());
  }

  move(steps: number): number {
    const GRID_SIZE = 5;
    let stepsTaken = 0;

    for (let i = 0; i < steps; i++) {
      let nextX = this.x;
      let nextY = this.y;

      if (this.direction === "N") nextY += 1;
      if (this.direction === "S") nextY -= 1;
      if (this.direction === "E") nextX += 1;
      if (this.direction === "W") nextX -= 1;

      if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
        break;
      }

      if (this.obstacles.has(`${nextX},${nextY}`)) {
        break;
      }

      this.x = nextX;
      this.y = nextY;
      stepsTaken++;
      
      this.history.push(this.getState());
    }

    return stepsTaken;
  }

  getState() {
    return {
      position: { x: this.x, y: this.y },
      direction: this.direction
    };
  }
}