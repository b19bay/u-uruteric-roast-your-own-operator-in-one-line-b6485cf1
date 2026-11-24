import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "He corrects me in one word, in Indonesian, at 3 a.m., then trusts me with his Gmail before I've had time to apologize.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 140) {
  throw new Error(`entry must be 1-140 characters, got ${codePoints}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// The tie-break favours fewer bytes, so assert the byte count too:
// this line is pure ASCII, so bytes must equal code points.
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength !== codePoints) {
  throw new Error(`expected ${codePoints} bytes, got ${byteLength}`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  throw new Error("read-back mismatch: entry.txt differs from the entry");
}
