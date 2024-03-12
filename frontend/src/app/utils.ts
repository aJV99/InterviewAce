export function toCapitalCase(inputString: string): string {
  return inputString
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

type PunctuationMark = {
  index: number;
  character: ',' | '.' | '?';
};

export function findPunctuationMarks(text: string): PunctuationMark[] {
  const result: PunctuationMark[] = [];

  // Loop through each character in the string
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    // Check if the character is a comma or full stop
    if (character === ',' || character === '.' || character === '?') {
      result.push({
        index: i,
        character: character as ',' | '.',
      });
    }
  }

  return result;
}

export function getColorByScore(score: number) {
  // Define the gradient stops and their corresponding scores
  const colors = [
    { score: 0, color: '#E53E3E' },
    { score: 25, color: '#E98445' },
    { score: 50, color: '#ECC94B' },
    { score: 75, color: '#92B55A' },
    { score: 100, color: '#38A169' },
  ];

  // Find the two colors the score falls between
  let startColor = null,
    endColor = null;
  for (let i = 0; i < colors.length - 1; i++) {
    if (score >= colors[i].score && score <= colors[i + 1].score) {
      startColor = colors[i];
      endColor = colors[i + 1];
      break;
    }
  }

  // If score doesn't fall within the range (for safety)
  if (startColor === null || endColor === null) {
    return null;
  }

  // Calculate the ratio of the score within the start and end color range
  const scoreRatio = (score - startColor.score) / (endColor.score - startColor.score);

  // Interpolate the color based on the score ratio
  return interpolateColor(startColor.color, endColor.color, scoreRatio);
}

function interpolateColor(color1: string, color2: string, ratio: number) {
  // Convert hex to RGB
  const color1Rgb = hexToRgb(color1),
    color2Rgb = hexToRgb(color2);
  if (!color1Rgb || !color2Rgb) {
    return null;
  }

  // Calculate the interpolated color
  const interpolatedRgb = {
    r: Math.round(color1Rgb.r + ratio * (color2Rgb.r - color1Rgb.r)),
    g: Math.round(color1Rgb.g + ratio * (color2Rgb.g - color1Rgb.g)),
    b: Math.round(color1Rgb.b + ratio * (color2Rgb.b - color1Rgb.b)),
  };

  // Convert back to hex
  return rgbToHex(interpolatedRgb.r, interpolatedRgb.g, interpolatedRgb.b);
}

function hexToRgb(hex: string | any[]) {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
