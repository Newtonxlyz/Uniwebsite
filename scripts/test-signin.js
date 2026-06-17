// 本地模拟 signIn.email 看是否成功
import { auth } from "../src/lib/auth";

async function main() {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: "admin@lvyz.org",
        password: "Lvyz2026!Wiki",
      },
    });
    console.log("登录成功:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("登录失败:", e.message);
    console.error("完整错误:", e);
  }
}

main();
