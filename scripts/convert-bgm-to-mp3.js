// 直接给 lamejs 喂 PCM（用 -ar 44100 -ac 2 -f s16le 输出 raw PCM）
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const lamejs = require("lamejs");

if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?/);
    if (m) process.env[m[1]] = m[2];
  }
}

const tmpAac = path.join(require("os").tmpdir(), "ye-xiang-chou.aac");
const tmpPcm = path.join(require("os").tmpdir(), "ye-xiang-chou.pcm");
const tmpMp3 = path.join(require("os").tmpdir(), "ye-xiang-chou.mp3");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

// 1. 下载 aac
console.log("下载 aac...");
execFileSync("curl", ["-sSL", "https://media.lvyz.org/music/ye-xiang-chou.aac", "-o", tmpAac]);
console.log("  size:", (fs.statSync(tmpAac).size / 1024 / 1024).toFixed(2), "MB");

// 2. ffmpeg 解码 aac → raw PCM s16le 44.1kHz stereo
console.log("ffmpeg 解码 aac → PCM s16le 44.1kHz stereo...");
// 用错误容忍：即使 ADTS 损坏也尝试
try {
  execFileSync(ffmpegPath, [
    "-y",
    "-f", "aac",
    "-err_detect", "ignore_err",
    "-i", tmpAac,
    "-ar", "44100",
    "-ac", "2",
    "-f", "s16le",
    "-acodec", "pcm_s16le",
    tmpPcm,
  ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 100 });
  console.log("  ✓ PCM 解码成功");
} catch (e) {
  console.error("✗ ffmpeg 解码失败。源 aac 文件 ADTS 头损坏。");
  console.error("  需要重新提供原始音频文件（m4a/mp3/wav/flac 任一）");
  process.exit(1);
}

const pcmBuf = fs.readFileSync(tmpPcm);
console.log("  PCM size:", (pcmBuf.length / 1024 / 1024).toFixed(2), "MB");

// 3. lamejs 编码 PCM → mp3
console.log("lamejs 编码 PCM → mp3 128kbps...");
const samples = new Int16Array(pcmBuf.buffer, pcmBuf.byteOffset, pcmBuf.length / 2);
const mp3encoder = new lamejs.Mp3Encoder(2, 44100, 128);
const mp3Data = [];
const blockSize = 1152;
for (let i = 0; i < samples.length; i += blockSize) {
  const sampleChunk = samples.subarray(i, i + blockSize);
  const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
  if (mp3buf.length > 0) mp3Data.push(Buffer.from(mp3buf));
}
const tail = mp3encoder.flush();
if (tail.length > 0) mp3Data.push(Buffer.from(tail));
const mp3Buf = Buffer.concat(mp3Data);
fs.writeFileSync(tmpMp3, mp3Buf);
console.log("  mp3 size:", (mp3Buf.length / 1024 / 1024).toFixed(2), "MB");

// 4. 上传 R2
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
(async () => {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "music/ye-xiang-chou.mp3",
    Body: mp3Buf,
    ContentType: "audio/mpeg",
    CacheControl: "public, max-age=31536000, immutable",
  }));
  console.log("✓ 上传 R2 music/ye-xiang-chou.mp3");
  console.log("  URL: https://media.lvyz.org/music/ye-xiang-chou.mp3");
})().catch((e) => { console.error("FAIL:", e); process.exit(1); });
