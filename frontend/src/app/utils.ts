export function toCapitalCase(inputString: string): string {
  return inputString
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

type PunctuationMark = {
  index: number;
  character: "," | "." | "?";
};

export function findPunctuationMarks(text: string): PunctuationMark[] {
  const result: PunctuationMark[] = [];

  // Loop through each character in the string
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    // Check if the character is a comma or full stop
    if (character === "," || character === "." || character === "?") {
      result.push({
        index: i,
        character: character as "," | ".",
      });
    }
  }

  return result;
}
