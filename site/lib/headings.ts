export interface Heading {
  depth: 2 | 3;
  text: string;
  slug: string;
}

const FENCE_RE = /^(```|~~~)/;
const HEADING_RE = /^(#{2,3})\s+(.+?)\s*$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(source: string): Heading[] {
  const lines = source.split("\n");
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of lines) {
    if (FENCE_RE.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = HEADING_RE.exec(line);
    if (!m) continue;

    const depth = m[1].length === 2 ? 2 : 3;
    const rawText = m[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^"(.+)"$/, "$1")
      .trim();

    headings.push({
      depth: depth as 2 | 3,
      text: rawText,
      slug: slugify(rawText),
    });
  }

  return headings;
}
