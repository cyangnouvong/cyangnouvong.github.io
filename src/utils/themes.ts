export const themes = {
  Light: {
    bg: "#e4e4df",
    contour: {
      major: {
        color: normalizeArray([153, 151, 129]),
        opacity: 0.78,
      },
      mid: {
        color: normalizeArray([117, 94, 88]),
        opacity: 0.42,
      },
      fine: {
        color: normalizeArray([87, 77, 54]),
        opacity: 0.22,
      },
    },
  },

  Dark: {
    bg: "#1a1a17",
    contour: {
      major: {
        color: normalizeArray([122, 118, 117]),
        opacity: 0.78,
      },
      mid: {
        color: normalizeArray([153, 148, 130]),
        opacity: 0.42,
      },
      fine: {
        color: normalizeArray([102, 97, 85]),
        opacity: 0.22,
      },
    },
  },
};

function normalizeArray(arr: number[]) {
  return arr.map((v) => v / 255);
}
