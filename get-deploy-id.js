// robust-deploy-id.js
const https = require('https');
const fs = require('fs');
const token = fs.readFileSync('verceltoken.txt','utf8').trim();

https.get('https://api.vercel.com/v6/deployments?projectId=prj_ddagWLE1q2XsqflDmMKAKoq1P05I&limit=20', {headers: {Authorization: 'Bearer '+token}}, res => {
  let d=''; res.on('data',c=>d+=c); res.on('end',()=>{
    // 用正则提取 id 和 commit
    const re = /"id":"(dpl_[^"]+)".*?"githubCommitSha":"(ceee44e[a-f0-9]+)"/g;
    let m;
    while ((m = re.exec(d)) !== null) {
      console.log('deploy:', m[1], 'commit:', m[2]);
    }
  });
});
