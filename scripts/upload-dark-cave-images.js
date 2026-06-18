// 上传黑黑的洞穴我不怕 20 张真实绘本图到 R2
// 源：D:/儿童绘本计划/雷迪嘎嘎系列/绘本/儿童情感引导系列/001_儿童情感引导_001_黑黑的洞穴我不怕/03_生图素材/
// 目标：R2 bucket=lvyzorg, key=picturebook/stories/dark-cave/page_NN.png
// 总大小 ~94MB，分批串行上传（避免内存峰值）
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// 手动解析 .env
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?/);
    if (m) process.env[m[1]] = m[2];
  }
}

const SRC = "D:/儿童绘本计划/雷迪嘎嘎系列/绘本/儿童情感引导系列/001_儿童情感引导_001_黑黑的洞穴我不怕/03_生图素材";
const DST_PREFIX = "picturebook/stories/dark-cave";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  const files = fs.readdirSync(SRC).filter((f) => f.match(/^page_\d{2}\.png$/)).sort();
  console.log(`准备上传 ${files.length} 张图到 R2 ${DST_PREFIX}/`);

  let ok = 0, fail = 0;
  for (const f of files) {
    const buf = fs.readFileSync(path.join(SRC, f));
    const key = `${DST_PREFIX}/${f}`;
    try {
      await s3.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buf,
        ContentType: "image/png",
        CacheControl: "public, max-age=31536000, immutable",
      }));
      const mb = (buf.length / 1024 / 1024).toFixed(2);
      console.log(`  ✓ ${f}  (${mb} MB)`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${f}  ${e.message}`);
      fail++;
    }
  }
  console.log(`\n完成: ${ok} 成功 / ${fail} 失败`);
  console.log(`R2 URL 模板: https://media.lvyz.org/${DST_PREFIX}/page_NN.png`);
}

main();
