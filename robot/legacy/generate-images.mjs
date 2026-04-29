// ATTENTION: This is a draft. Not tested yet.

import fs from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) throw new Error("Missing OPENAI_API_KEY");

const prompts = JSON.parse(await fs.readFile("./prompts.json", "utf8"));
// prompts.json: [{ "tile": 1, "filename": "tile-01.png", "prompt": "..." }, ...]

const outDir = "./out";
await fs.mkdir(outDir, { recursive: true });

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

for (const item of prompts) {
  const { filename, prompt, size } = item;
  console.log(`Generating ${filename}...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1.5",
      prompt,
      size,
      // quality: "high",          // optional; supported for GPT image models
      // output_format: "png",      // default is png
      n: 1
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error for ${filename}: ${res.status} ${err}`);
  }

  const data = await res.json();

  // GPT image models return base64 image data (not short-lived URLs). :contentReference[oaicite:4]{index=4}
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image data for ${filename}`);

  const bytes = Buffer.from(b64, "base64");
  await fs.writeFile(path.join(outDir, filename), bytes);

  // gentle pacing helps avoid rate/risk spikes
  await sleep(500);
}

console.log("Done.");
