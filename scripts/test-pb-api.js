// 测试绘本上传后台 API
// 1. 登录拿 cookie
// 2. 创建故事
// 3. 上传封面 + 1 张图
// 4. 列出
// 5. 删除

async function main() {
  const BASE = "https://www.lvyz.org";
  const headers = {
    "Content-Type": "application/json",
    Origin: BASE,
    Referer: BASE,
  };

  // 1. 登录
  console.log("1. 登录 admin@lvyz.org...");
  const loginRes = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: "admin@lvyz.org",
      password: "Lvyz2026!Wiki",
    }),
  });
  console.log("   status:", loginRes.status);
  const cookies = loginRes.headers.get("set-cookie") || "";
  if (!cookies && loginRes.status !== 200) {
    const j = await loginRes.json().catch(() => ({}));
    console.log("   登录失败:", j);
    return;
  }
  console.log("   cookies:", cookies.split(";")[0].slice(0, 30) + "...");

  const authHeaders = {
    ...headers,
    Cookie: cookies.split(",").map((c) => c.split(";")[0]).join("; "),
  };

  // 2. 列出当前绘本
  console.log("\n2. 列出当前绘本...");
  const listRes = await fetch(`${BASE}/api/admin/picturebook`, { headers: authHeaders });
  console.log("   status:", listRes.status);
  if (listRes.ok) {
    const stories = await listRes.json();
    console.log("   总数:", stories.length);
    stories.slice(0, 3).forEach((s) =>
      console.log(`   - [${s.status}] ${s.title} (${s._count.pages} 页)`)
    );
  } else {
    const j = await listRes.json().catch(() => ({}));
    console.log("   失败:", j);
  }

  // 3. 创建测试绘本
  console.log("\n3. 创建测试绘本「API 测试 - 黑黑的洞穴」...");
  const createRes = await fetch(`${BASE}/api/admin/picturebook`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "API 测试 - 黑黑的洞穴",
      titleEn: "API Test - Dark Cave",
      series: "儿童情感引导",
      seriesCategory: "emotion",
      desc: "通过 API 自动化测试上传的绘本",
      age: "3-8",
      time: 5,
      emoji: "🦉",
      tags: ["测试", "自动化"],
      characters: [
        { id: "lady-gaga", name: "雷迪嘎嘎" },
        { id: "gababa", name: "噶巴巴" },
      ],
      status: "DRAFT",
    }),
  });
  console.log("   status:", createRes.status);
  if (!createRes.ok) {
    const j = await createRes.json().catch(() => ({}));
    console.log("   失败:", j);
    return;
  }
  const story = await createRes.json();
  console.log("   创建成功 id:", story.id);
  console.log("   slug:", story.slug);

  // 4. 下载一张真图，模拟上传
  console.log("\n4. 下载 dark-cave/page_01.png + 上传为新绘本页...");
  const imgRes = await fetch("https://media.lvyz.org/picturebook/stories/dark-cave/page_01.png");
  const imgBuf = Buffer.from(await imgRes.arrayBuffer());
  console.log("   下载大小:", (imgBuf.length / 1024 / 1024).toFixed(2), "MB");

  // multipart/form-data 拼装
  const boundary = "----TestBoundary" + Date.now();
  const parts = [];
  parts.push(`--${boundary}`);
  parts.push(`Content-Disposition: form-data; name="file"; filename="page_01.png"`);
  parts.push(`Content-Type: image/png`);
  parts.push("");
  const headerBuf = Buffer.from(parts.join("\r\n") + "\r\n", "utf8");
  const footerBuf = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
  const body = Buffer.concat([headerBuf, imgBuf, footerBuf]);

  const uploadRes = await fetch(`${BASE}/api/admin/picturebook/${story.id}/upload-page`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body,
  });
  console.log("   upload status:", uploadRes.status);
  if (uploadRes.ok) {
    const j = await uploadRes.json();
    console.log("   ✓ 上传成功:", j.url);
  } else {
    const j = await uploadRes.json().catch(() => ({}));
    console.log("   失败:", j);
  }

  // 5. 删除测试绘本
  console.log("\n5. 删除测试绘本...");
  const delRes = await fetch(`${BASE}/api/admin/picturebook/${story.id}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("   status:", delRes.status);
  if (delRes.ok) {
    const j = await delRes.json();
    console.log("   ✓ 删除成功, 删了", j.deletedKeys, "个 R2 文件");
  } else {
    const j = await delRes.json().catch(() => ({}));
    console.log("   失败:", j);
  }

  console.log("\n✓ 测试完成");
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
