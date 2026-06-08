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
          {isObstacleHere && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#555" stroke="#3c3c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 20 8 20 18 12 22 4 18 4 8 12 2"/>
            </svg>
          )}
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          Simulador Cartesiano 2D
        </span>
        <button
          onClick={onRandomizeBoard}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#858585', display: 'flex', alignItems: 'center' }}
          title="Gerar Terreno Aleatório"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
          </svg>
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4af626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2" fill="#4af62644"/>
            </svg>
          </RoverEntity>
          
        </GridBoard>
      </SimulatorBody>
    </>
  );
}