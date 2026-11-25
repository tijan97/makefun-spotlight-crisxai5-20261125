// Spotlight @crisxai5 entry (Node 22, standard library only): it copies POST.json
// from the repository root to /output/POST.json, where the gate reads it.
// The entry is the X post itself: the post spotlights @crisxai5 with the
// caption the bounty asks for, POST.json names the post, and the house reads
// the post's likes, reposts and quotes from X after the deadline.
//
// The URL must be a real x.com status address, not the starter placeholder:
// a placeholder is refused by the gate (valid 0), so the program checks the
// shape before copying and exits non-zero on anything that is not a post.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_URL_RE = /^https:\/\/(?:x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;

// The post's text carries the play code makefun-gecko-gadget-spool and the
// sponsor mention @crisxai5; only the URL is read here, the text is the
// post's own and was verified live on X before this entry was built.
const postPath = join(BOT_DIR, 'POST.json');
if (!existsSync(postPath)) {
  console.error(`POST.json not found in ${BOT_DIR}`);
  process.exit(1);
}
const post = JSON.parse(readFileSync(postPath, 'utf-8')) as { url?: unknown };
if (typeof post.url !== 'string' || !POST_URL_RE.test(post.url)) {
  console.error(`POST.json must name a real X post URL, got: ${JSON.stringify(post.url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`spotlight post: ${post.url}`);
