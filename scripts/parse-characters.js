const fs = require("fs");
const ts = fs.readFileSync("src/content/picturebook/characters.ts", "utf8");
const m = ts.matchAll(/id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g);
for (const x of m) console.log(x[1] + "|" + x[2]);
