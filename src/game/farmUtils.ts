/**
 * Farm grid utilities - converts mission JSON to game state
 */

export type TileType =
  | 'soil'
  | 'crop'
  | 'crop_dry'
  | 'weed'
  | 'water'
  | 'obstacle'
  | 'recharge'
  | 'sample'
  | 'target';

export interface FarmTile {
  x: number;
  y: number;
  type: TileType;
  state?: 'dry' | 'healthy' | 'affected' | 'wet';
}

export interface FarmGrid {
  width: number;
  height: number;
  tiles: FarmTile[][];
  droneStart: { x: number; y: number };
  targetPosition: { x: number; y: number } | null;
}

export function parseMissionToFarm(mission: {
  gridWidth: number;
  gridHeight: number;
  tiles: string[][];
  droneStart: { x: number; y: number };
  targetPosition?: { x: number; y: number } | null;
}): FarmGrid {
  const tiles: FarmTile[][] = [];
  for (let y = 0; y < mission.gridHeight; y++) {
    const row: FarmTile[] = [];
    for (let x = 0; x < mission.gridWidth; x++) {
      const cell = mission.tiles[y]?.[x] ?? 'soil';
      let type: TileType = 'soil';
      let state: 'dry' | 'healthy' | 'affected' | 'wet' | undefined;
      if (cell === 'crop_dry') {
        type = 'crop';
        state = 'dry';
      } else if (cell === 'crop') {
        type = 'crop';
        state = 'healthy';
      } else if (['soil', 'weed', 'water', 'obstacle', 'recharge', 'sample', 'target'].includes(cell)) {
        type = cell as TileType;
      }
      row.push({ x, y, type, state });
    }
    tiles.push(row);
  }
  return {
    width: mission.gridWidth,
    height: mission.gridHeight,
    tiles,
    droneStart: mission.droneStart,
    targetPosition: mission.targetPosition ?? null,
  };
}
