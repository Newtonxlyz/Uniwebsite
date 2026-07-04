// 抓 light 主题下的 safety-training 页面，确认深紫底生效
async function main() {
  const BASE = "https://www.lvyz.org";
  // 直接抓 HTML（不带 light class），看默认 dark 模式
  const r = await fetch(`${BASE}/crashai/safety-training`);
  const html = await r.text();

  // 检查关键颜色
  const checks = {
    hasDarkPageBg: html.includes("dark-page-bg"),
    hasVarPageBg: html.includes("--page-bg"),
    hasGlassCard: html.includes("glass-card"),
    hasGradientTitle: html.includes("text-gradient"),
    bodyBgDark: html.includes("bg-[#0a0a1a]") || html.includes("#0a0a1a"),
    hasLightClass: html.includes('class="light"'),
    hasDarkClass: html.includes('class="dark"'),
  };
  console.log("页面 HTML 检查:");
  Object.entries(checks).forEach(([k, v]) => console.log(`  ${v ? "✓" : "✗"} ${k}`));

  // 找 hero 标题颜色（className 包含）
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log("\nH1:", h1Match?.[1]?.trim().slice(0, 50));
}
main();