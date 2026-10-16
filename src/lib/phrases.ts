export function splitPhrases(text: string): string[] {
  return text.split(/(?<=[.,;:!?…]["”')]?)\s+/).filter(Boolean);
}

export function keyedPhrases(text: string): { key: number; text: string }[] {
  let offset = 0;
  return splitPhrases(text).map((phrase) => {
    const key = text.indexOf(phrase, offset);
    offset = key + phrase.length;
    return { key, text: phrase };
  });
}
