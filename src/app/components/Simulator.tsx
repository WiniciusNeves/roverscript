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
  onRandomizeBoard: () => void;
}

export function Simulator({ roverState, obstacles, onRandomizeBoard }: Props) {
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
      <SimulatorHeader style={{ justifyContent: 'space-between' }}>
        <span>Simulador Cartesiano 2D</span>
        <button 
          onClick={onRandomizeBoard}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          title="Gerar Terreno Aleatório"
        >
          🎲
        </button>
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