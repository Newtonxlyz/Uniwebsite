const fs = require('fs');
const data = JSON.parse(fs.readFileSync('ceee44e-events.json', 'utf8').replace(/^\uFEFF/, ''));
data.forEach(e => {
  if (e.text && e.text.length < 500) {
    const prefix = e.level === 'error' ? '[E]' : (e.level === 'warning' ? '[W]' : '   ');
    console.log(prefix + ' ' + e.text);
  }
});
