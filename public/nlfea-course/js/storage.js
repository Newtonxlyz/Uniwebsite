// storage.js - localStorage + JSON import/export
// 所有数据存 localStorage，key 前缀 'nlfea_'

const NS = "nlfea_";

function key(name) { return NS + name; }

const Storage = {
  // 读
  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("Storage.get error:", name, e);
      return fallback;
    }
  },

  // 别名 getObject（与 get 等价，更语义化）
  getObject(name, fallback = null) {
    return this.get(name, fallback);
  },

  // 清空所有 nlfea_* 前缀数据
  clearAll() {
    this.clear();
  },

  // 写
  set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage.set error:", name, e);
      return false;
    }
  },

  // 删
  remove(name) {
    localStorage.removeItem(key(name));
  },

  // 全部清除
  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => localStorage.removeItem(k));
  },

  // 全部导出
  exportAll() {
    const data = {};
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => {
        data[k] = localStorage.getItem(k);
      });
    return {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        app: "NLFEA Course Local",
      },
      data,
    };
  },

  // 全部导入（合并模式：覆盖同 key）
  importAll(payload) {
    if (!payload || !payload.data) {
      throw new Error("无效的备份文件");
    }
    let count = 0;
    for (const [k, v] of Object.entries(payload.data)) {
      if (k.startsWith(NS)) {
        localStorage.setItem(k, v);
        count++;
      }
    }
    return count;
  },

  // importBackup - 适配两种格式：{_meta, data} 或 {version, payloads}
  importBackup(payload) {
    if (payload && payload.data) {
      return this.importAll(payload);
    }
    if (payload && payload.payloads) {
      let count = 0;
      for (const [k, v] of Object.entries(payload.payloads)) {
        if (k.startsWith(NS)) {
          localStorage.setItem(k, JSON.stringify(v));
          count++;
        }
      }
      return count;
    }
    throw new Error("无法识别的备份格式");
  },

  // 下载 JSON 文件
  downloadBackup() {
    const data = this.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.download = `nlfea-backup-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // 触发文件选择
  async uploadBackup() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return reject(new Error("未选择文件"));
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          const count = this.importAll(data);
          resolve(count);
        } catch (err) {
          reject(err);
        }
      };
      input.click();
    });
  },

  // 统计当前占用
  size() {
    let total = 0;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => {
        total += (localStorage.getItem(k) || "").length;
      });
    return total;
  },
};

window.NLStorage = Storage;
