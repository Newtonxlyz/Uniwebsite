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

  // 4. 用小测试图（100KB PNG）+ 预签名直传
  console.log("\n4. 创建小测试 PNG (100KB) + 预签名直传...");
  // 10x10 红色 PNG
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAEklEQVR4nGP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "base64"
  );
  // 扩展到 50KB
  const pngBuf = Buffer.concat([png, Buffer.alloc(50 * 1024, 0)]);
  const imgBuf = pngBuf;
  console.log("   测试图大小:", (imgBuf.length / 1024).toFixed(1), "KB");

  // 4a. 预签名
  const presignRes = await fetch(`${BASE}/api/admin/picturebook/presign`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      storyId: story.id,
      fileName: "test_page_01.png",
      fileType: "image/png",
      fileSize: imgBuf.length,
      kind: "page",
    }),
  });
  console.log("   presign status:", presignRes.status);
  if (!presignRes.ok) {
    const j = await presignRes.json().catch(() => ({}));
    console.log("   失败:", j);
    return;
  }
  const { uploadUrl, publicUrl, pageNum } = await presignRes.json();
  console.log("   pageNum:", pageNum);
  console.log("   publicUrl:", publicUrl);

  // 4b. PUT 到 R2
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: imgBuf,
  });
  console.log("   R2 PUT status:", putRes.status);
  if (!putRes.ok) {
    const t = await putRes.text();
    console.log("   R2 失败:", t.slice(0, 200));
    return;
  }
  console.log("   ✓ R2 上传成功");

  // 4c. confirm
  const confirmRes = await fetch(`${BASE}/api/admin/picturebook/confirm-upload`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ storyId: story.id, publicUrl, kind: "page", pageNum, size: imgBuf.length }),
  });
  console.log("   confirm status:", confirmRes.status);
  if (confirmRes.ok) {
    const j = await confirmRes.json();
    console.log("   ✓ 写库成功, total:", j.total);
  } else {
    const j = await confirmRes.json().catch(() => ({}));
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
