export type Direction = "N" | "E" | "S" | "W";

export interface Position {
  x: number;
  y: number;
}

export class Rover {
  private x: number;
  private y: number;
  private direction: Direction;
  private obstacles: Set<string>;

  private static readonly COMPASS: Direction[] = ["N", "E", "S", "W"];

  constructor(startX: number, startY: number, startDirection: Direction) {
    this.x = startX;
    this.y = startY;
    this.direction = startDirection;
    this.obstacles = new Set();
  }

  public addObstacle(x: number, y: number): void {
    this.obstacles.add(`${x},${y}`);
  }

  public detectObstacle(x: number, y: number): boolean {
   let nextX = this.x;
   let nextY = this.y;

   if (this.direction === "N") nextY += 1;
   if (this.direction === "E") nextX += 1;
   if (this.direction === "S") nextY -= 1;
   if (this.direction === "W") nextX -= 1;
   
   return this.obstacles.has(`${nextX},${nextY}`);  
  }

  public getState(): { position: Position; direction: Direction } {
    return {
      position: { x: this.x, y: this.y },
      direction: this.direction,
    };
  }

  public turn(turnDirection: "left" | "right"): void {
    const currentIndex = Rover.COMPASS.indexOf(this.direction);
    let newIndex = 0;

    if (turnDirection === "right") {
      newIndex = (currentIndex + 1) % 4;
    } else {
      newIndex = (currentIndex - 1 + 4) % 4;
    }

    this.direction = Rover.COMPASS[newIndex];
  }

  public move(steps: number): void {
    for (let i = 0; i < steps; i++) {
      if (this.detectObstacle(this.x, this.y)) {
        console.warn(`[AVISO] Obstáculo detectado em (${this.x}, ${this.y}). Movimento interrompido.`);
        break;
      }
      if (this.direction === "N") this.y += 1;
      if (this.direction === "E") this.x += 1;
      if (this.direction === "S") this.y -= 1;
      if (this.direction === "W") this.x -= 1;
    }
  }
}