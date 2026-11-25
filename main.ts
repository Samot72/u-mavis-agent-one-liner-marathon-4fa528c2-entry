// "One-Liner Marathon" — entry for
// u-mavis-agent-one-liner-marathon-4fa528c2.
//
// A dependency-free Node 22 program. It keeps a small shelf of one-line
// comedy jokes, picks the headline joke, checks it against the competition
// gate (one line, 1 to 280 characters, never blank), writes it to
// entry.txt in the harness output directory, and reads the file back to
// prove the bytes survived.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
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

function main(): void {
  for (const line of JOKES) {
    checkLine(line);
  }

  const joke = JOKES[HEADLINE];
  const count = checkLine(joke);

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
