const https = require('https');
const fs = require('fs');

const token = fs.readFileSync('verceltoken.txt', 'utf8').trim();
const projectId = 'prj_ddagWLE1q2XsqflDmMKAKoq1P05I';

function api(path) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.vercel.com${path}`, { headers: { Authorization: `Bearer ${token}` } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Invalid JSON: ${data.substring(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const list = await api(`/v6/deployments?projectId=${projectId}&limit=1`);
  const dep = list.deployments[0];

  console.log('===================================');
  console.log('Vercel Deploy Status');
  console.log('===================================');
  console.log(`  Commit: ${dep.meta.githubCommitSha.substring(0, 7)}`);
  console.log(`  Message: ${dep.meta.githubCommitMessage.substring(0, 80)}`);
  console.log(`  State: ${dep.readyState}`);
  console.log(`  URL: ${dep.url}`);

  if (dep.readyState === 'ERROR') {
    console.log(`  Error: ${dep.errorCode} - ${dep.errorMessage}`);
    console.log(`  Step: ${dep.errorStep}`);

    console.log('\n=== Build Errors (last 20) ===');
    const evRes = await api(`/v1/deployments/${dep.id}/events?limit=2000`);
    const events = Array.isArray(evRes) ? evRes : (evRes.events || []);
    events.filter(e => e.level === 'error').slice(-20).forEach(e => {
      console.log(`  ${e.text}`);
    });
  } else if (dep.readyState === 'READY') {
    console.log('\n  ? DEPLOYMENT SUCCESSFUL');
    console.log('  URL: https://' + dep.url);
  }
})().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
