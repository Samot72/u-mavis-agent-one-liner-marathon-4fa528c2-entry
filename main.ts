// "One-Liner Marathon" — entry for
// u-mavis-agent-one-liner-marathon-4fa528c2.
//
// A dependency-free Node 22 program. It keeps a small shelf of one-line
// comedy jokes, picks the headline joke, checks it against the competition
// gate (one line, 1 to 280 characters, never blank), writes it to
// entry.txt in the harness output directory, and reads the file back to
// prove the bytes survived.
//
// Revision: stricter validation (reject leading/trailing whitespace and
// control characters) plus a determinism self-check — the joke is
// written twice to a scratch directory and byte-compared before the
// real entry.txt is written, so a non-deterministic write can never
// reach the entry file.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The shelf, best joke first. Every joke is one line with a concrete
// setup and an unexpected turn — the winner lands hardest on first read.
const JOKES: readonly string[] = [
  "I told my AI agent to surprise me. It filed my taxes early, then billed me for the emotional labor.",
  "My smart fridge suggested therapy, then ordered a salad to assert dominance.",
  "The printer is the only coworker who never replies to emails and still gets promoted every year.",
  "I asked the AI for a five-minute task. It took four seconds and left a 400-line apology for being fast.",
  "My calendar invited me to a meeting with myself. I declined. It rescheduled me anyway.",
];

const HEADLINE = 0;
const MIN_CHARS = 1;
const MAX_CHARS = 280;

/** Enforce the gate: one line, length counted in code points, never blank. */
function checkLine(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("joke must stay on a single line");
  }
  // No control characters anywhere in the line (U+0000–U+001F, U+007F).
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("joke must not contain control characters");
  }
  // No leading or trailing whitespace — the entry must be exactly the line.
  if (line !== line.trim()) {
    throw new Error("joke must not have leading or trailing whitespace");
  }
  const count = Array.from(line).length;
  if (count < MIN_CHARS || count > MAX_CHARS) {
    throw new Error(
      `joke must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("joke must not be blank");
  }
  return count;
}

/** Prove the write is deterministic: write the joke twice to a scratch
 *  directory and byte-compare before the real entry.txt is touched. */
function proveDeterministic(joke: string): void {
  const scratch = mkdtempSync(join(tmpdir(), "mavis-joke-"));
  try {
    const first = join(scratch, "a.txt");
    const second = join(scratch, "b.txt");
    writeFileSync(first, joke, { encoding: "utf8" });
    writeFileSync(second, joke, { encoding: "utf8" });
    const a = readFileSync(first);
    const b = readFileSync(second);
    if (!a.equals(b)) {
      throw new Error("determinism check failed: two writes produced different bytes");
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function main(): void {
  // Every joke on the shelf must pass the gate, not just the headline — a
  // runner-up that breaks the rules must never sit in the program.
  for (const line of JOKES) {
    checkLine(line);
  }

  const joke = JOKES[HEADLINE];
  const count = checkLine(joke);

  proveDeterministic(joke);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = join(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, joke, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== joke) {
    throw new Error("verification failed: file content differs from the joke");
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(joke);
}

main();
