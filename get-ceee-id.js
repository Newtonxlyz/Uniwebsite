// 用文件读 deploys.json, 找 ceee44e 的 id
const fs = require('fs');
const d = fs.readFileSync('deploys.json', 'utf8');
const lines = d.split('},{');
for (const l of lines) {
  const idRe = new RegExp('"id":"(dpl_[A-Za-z0-9]+)"');
  const commitRe = new RegExp('"githubCommitSha":"(ceee44e[a-f0-9]+)"');
  const idMatch = l.match(idRe);
  const commitMatch = l.match(commitRe);
  if (idMatch && commitMatch) {
    console.log('ceee44e deploy id:', idMatch[1]);
  }
}
