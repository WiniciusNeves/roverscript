export type Direction = "N" | "E" | "S" | "W";

export interface Position {
  x: number;
  y: number;
}

export class Rover {
  private x: number;
  private y: number;
  private direction: Direction;

  private static readonly COMPASS: Direction[] = ["N", "E", "S", "W"];

  constructor(startX: number, startY: number, startDirection: Direction) {
    this.x = startX;
    this.y = startY;
    this.direction = startDirection;
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
    switch (this.direction) {
      case "N":
        this.y += steps;
        break;
      case "E":
        this.x += steps;
        break;
      case "S":
        this.y -= steps;
        break;
      case "W":
        this.x -= steps;
        break;
    }
  }
}