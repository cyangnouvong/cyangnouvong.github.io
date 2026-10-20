// Web Worker: builds the contour lines off the main thread and transfers the arrays back.
import { generateHeightMap, type NoiseConfig } from "./noise";
import { marchingSquaresPositions } from "./marchingSquares";

export interface ContourRequest {
  id: number;
  noise: NoiseConfig;
  levels: number;
}

export interface ContourResponse {
  id: number;
  /** One flat [x1, y1, 0, x2, y2, 0, ...] array per level, in grid units. */
  positions: Float32Array[];
}

// Minimal worker-global typing; the WebWorker lib conflicts with the DOM lib.
interface WorkerScope {
  onmessage: ((e: MessageEvent<ContourRequest>) => void) | null;
  postMessage(message: ContourResponse, transfer: Transferable[]): void;
}

const scope = self as unknown as WorkerScope;

scope.onmessage = (e) => {
  const { id, noise, levels } = e.data;
  const map = generateHeightMap(noise);

  const positions: Float32Array[] = [];
  for (let i = 0; i < levels; i++) {
    const isoLevel = (i + 1) / (levels + 1);
    positions.push(marchingSquaresPositions(map, noise.gridSize, isoLevel));
  }

  scope.postMessage(
    { id, positions },
    positions.map((p) => p.buffer),
  );
};
