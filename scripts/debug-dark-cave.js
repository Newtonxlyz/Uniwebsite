async function main() {
  const r = await fetch("https://www.lvyz.org/picturebook/stories/dark-cave");
  const html = await r.text();
  const m = html.match(/<img[^>]*src="[^"]+"/g) || [];
  console.log("IMG tags:", m.length);
  m.slice(0, 5).forEach((s) => console.log(" ", s));
  console.log("---");
  const re = /"(image|image_url)":"([^"]+)"/g;
  let n = 0, mm;
  while ((mm = re.exec(html)) !== null && n < 5) {
    console.log("JSON", mm[1], "=", mm[2]);
    n++;
  }
  console.log("---");
  // 找绝对 URL
  const abs = html.match(/https:\/\/media\.lvyz\.org[^"'\s]+/g) || [];
  console.log("R2 URLs in HTML:", abs.length);
  abs.slice(0, 5).forEach((s) => console.log(" ", s));
  console.log("---");
  // 找相对 URL
  const rel = html.match(/["']\/picturebook\/stories\/dark-cave\/[^"']+["']/g) || [];
  console.log("Relative dark-cave URLs in HTML:", rel.length);
  rel.slice(0, 5).forEach((s) => console.log(" ", s));
}
main();
