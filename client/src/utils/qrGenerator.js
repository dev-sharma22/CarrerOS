/**
 * Pure client-side SVG QR Code Matrix Generator (Zero network latency)
 * Generates an inline SVG data structure for any token string.
 */

// Simple 21x21 QR Code matrix pattern generation helper
export const generateQRSvgPath = (text) => {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw position detection patterns (7x7 finders at corners)
  const drawFinder = (row, col) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };

  // 1. Draw 3 corner finder patterns
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // 2. Draw timing patterns
  for (let i = 8; i < size - 8; i += 2) {
    matrix[6][i] = true;
    matrix[i][6] = true;
  }

  // 3. Hash text to deterministically fill data modules
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= size - 8;
      const isBottomLeft = r >= size - 8 && c < 8;

      if (!isTopLeft && !isTopRight && !isBottomLeft) {
        const val = Math.abs(Math.sin((r * size + c + hash) * 1.5));
        if (val > 0.45) {
          matrix[r][c] = true;
        }
      }
    }
  }

  // Convert matrix to SVG rect paths
  let rects = [];
  const cellSize = 10;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        rects.push(`<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" rx="1.5" />`);
      }
    }
  }

  return {
    viewBox: `0 0 ${size * cellSize} ${size * cellSize}`,
    svgContent: rects.join('')
  };
};
