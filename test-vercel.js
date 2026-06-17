// 测 build output 路径
const https = require('https');
const token = require('fs').readFileSync('verceltoken.txt','utf8').trim();

// 测 vercel 函数访问
const url = 'https://uniwebsite-2hgmzowp0-newtonx-s-projects.vercel.app/';
const urlBlog = 'https://uniwebsite-2hgmzowp0-newtonx-s-projects.vercel.app/blog';

[url, urlBlog].forEach(u => {
  https.get(u, res => {
    console.log('GET', u);
    console.log('  Status:', res.statusCode);
    console.log('  X-Vercel-Id:', res.headers['x-vercel-id']);
    console.log('  X-Matched-Path:', res.headers['x-matched-path']);
    console.log('  Server:', res.headers['server']);
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('  Body (first 300):', d.substring(0, 300));
    });
  });
});
