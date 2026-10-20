// Marching squares: traces the iso-level contour of a 2D height grid one 2x2 cell at a time.

// Corner bitmask (1–14) → pairs of edge indices (0 top, 1 right, 2 bottom, 3 left).
const MS_TABLE: Record<number, [number, number][]> = {
  1: [[3, 2]],
  2: [[2, 1]],
  3: [[3, 1]],
  4: [[1, 0]],
  5: [
    [3, 0],
    [1, 2],
  ], // saddle case
  6: [[2, 0]],
  7: [[3, 0]],
  8: [[0, 3]],
  9: [[0, 2]],
  10: [
    [0, 1],
    [3, 2],
  ], // saddle case
  11: [[0, 1]],
  12: [[1, 3]],
  13: [[1, 2]],
  14: [[2, 3]],
};

// Linear interpolation: finds where the iso-level crosses between two height values
const lerp = (iso: number, a: number, b: number): number =>
  Math.abs(b - a) < 1e-8 ? 0 : (iso - a) / (b - a);

/** Traces the iso-level contour into a flat [x1, y1, 0, x2, y2, 0, ...] array in grid units. */
export function marchingSquaresPositions(
  map: Float32Array,
  gridSize: number,
  isoLevel: number,
): Float32Array {
  // Grow-as-needed buffer; typical levels need a few thousand segments.
  let buf = new Float32Array(6 * 2048);
  let n = 0;

  const push = (x1: number, y1: number, x2: number, y2: number) => {
    if (n + 6 > buf.length) {
      const next = new Float32Array(buf.length * 2);
      next.set(buf);
      buf = next;
    }
    buf[n++] = x1;
    buf[n++] = y1;
    buf[n++] = 0;
    buf[n++] = x2;
    buf[n++] = y2;
    buf[n++] = 0;
  };

  // Edge crossing points for the current cell: 0 = top, 1 = right, 2 = bottom, 3 = left
  const ex = [0, 0, 0, 0];
  const ey = [0, 0, 0, 0];

  for (let y = 0; y < gridSize - 1; y++) {
    const row = y * gridSize;
    const rowBelow = row + gridSize;
    for (let x = 0; x < gridSize - 1; x++) {
      const tl = map[row + x];
      const tr = map[row + x + 1];
      const br = map[rowBelow + x + 1];
      const bl = map[rowBelow + x];

      const idx =
        (tl >= isoLevel ? 8 : 0) |
        (tr >= isoLevel ? 4 : 0) |
        (br >= isoLevel ? 2 : 0) |
        (bl >= isoLevel ? 1 : 0);

      if (idx === 0 || idx === 15) continue;

      ex[0] = x + lerp(isoLevel, tl, tr);
      ey[0] = y;
      ex[1] = x + 1;
      ey[1] = y + lerp(isoLevel, tr, br);
      ex[2] = x + lerp(isoLevel, bl, br);
      ey[2] = y + 1;
      ex[3] = x;
      ey[3] = y + lerp(isoLevel, tl, bl);

      const pairs = MS_TABLE[idx];
      for (let p = 0; p < pairs.length; p++) {
        const [a, b] = pairs[p];
        push(ex[a], ey[a], ex[b], ey[b]);
      }
    }
  }

  // Trim to the exact size so the transferred buffer isn't oversized.
  return buf.slice(0, n);
}
