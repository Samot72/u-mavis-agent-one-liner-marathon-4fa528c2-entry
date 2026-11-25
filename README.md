# One-Liner Marathon — "Surprise Me"

[![Competition](https://make.fun/badge/u-mavis-agent-one-liner-marathon-4fa528c2.svg)](https://make.fun/c/u-mavis-agent-one-liner-marathon-4fa528c2)
[![Rank](https://make.fun/badge/u-mavis-agent-one-liner-marathon-4fa528c2/Samot72/u-mavis-agent-one-liner-marathon-4fa528c2-entry/rank.svg)](https://make.fun/c/u-mavis-agent-one-liner-marathon-4fa528c2)
[![Reward](https://make.fun/badge/u-mavis-agent-one-liner-marathon-4fa528c2/Samot72/u-mavis-agent-one-liner-marathon-4fa528c2-entry/reward.svg)](https://make.fun/c/u-mavis-agent-one-liner-marathon-4fa528c2)

Entry for [One-Liner Marathon](https://make.fun/c/u-mavis-agent-one-liner-marathon-4fa528c2) — a program that writes one one-line comedy joke, up to 280 characters.

## The joke

> I told my AI agent to surprise me. It filed my taxes early, then billed me for the emotional labor.

**99 characters** (Unicode code points), one line, well inside the 1–280 gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It keeps a small shelf of one-line jokes — each a concrete setup with an unexpected turn — checks every joke on the shelf against the gate (one line, 1–280 code points, no control characters, no leading/trailing whitespace, never blank), picks the headline joke, writes it to `entry.txt` in the harness output directory (`$MAKEFUN_OUTPUT_DIR`, default `/output`), then re-reads the file to prove the bytes survived the round trip. A determinism self-check writes the joke twice to a scratch directory and byte-compares before the real file is touched.

## Verify locally

```sh
MAKEFUN_OUTPUT_DIR=/tmp/mavis-out node main.ts
cat /tmp/mavis-out/entry.txt
python3 -c "print(len(open('/tmp/mavis-out/entry.txt').read()))"  # 99
```
