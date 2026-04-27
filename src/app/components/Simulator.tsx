import { 
  SimulatorHeader, 
  SimulatorBody, 
  GridBoard, 
  GridCell, 
  CellCoordinate,
  RoverEntity 
} from "../theme/styles";

interface RoverState {
  position: { x: number; y: number };
  direction: string;
}

interface Props {
  roverState: RoverState;
  obstacles: string[];
}

export function Simulator({ roverState, obstacles }: Props) {
  const gridSize = 5;
  const cells = [];
  let rotation = "0deg";
  if (roverState.direction === "E") rotation = "90deg";
  if (roverState.direction === "S") rotation = "180deg";
  if (roverState.direction === "W") rotation = "-90deg";

  for (let y = gridSize - 1; y >= 0; y--) {
    for (let x = 0; x < gridSize; x++) {
      const isObstacleHere = obstacles.includes(`${x},${y}`);

      cells.push(
        <GridCell key={`${x}-${y}`}>
          {isObstacleHere && <div>🪨</div>}
          {!isObstacleHere && (
            <CellCoordinate>{x},{y}</CellCoordinate>
          )}
        </GridCell>
      );
    }
  }

  return (
    <>
      <SimulatorHeader>
        <span>Simulador Cartesiano 2D</span>
      </SimulatorHeader>
      <SimulatorBody>
        <GridBoard>
          {cells}
          
        
          <RoverEntity 
            $x={roverState.position.x} 
            $y={roverState.position.y} 
            $rotation={rotation}
          >
            🚀
          </RoverEntity>
          
        </GridBoard>
      </SimulatorBody>
    </>
  );
}