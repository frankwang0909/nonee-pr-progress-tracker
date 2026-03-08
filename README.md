# NON EE PR 进度看板

> [English README](./README.en.md)

抓取公开共享的 Google Sheets 数据，清洗后生成可视化看板，展示 NON EE 类别 PR 申请进度。

**在线地址**：[nonee-pr-progress-tracker.vercel.app](https://nonee-pr-progress-tracker.vercel.app)

---

## 功能

- **进度卡片**：显示 AOR / Final Decision / Portal 1 / Portal 2 / eCOPR / PR Card 各阶段最新推进日期
- **PR 流程图**：内嵌可交互流程图（节点悬停显示说明）
- **PR 流程步骤**：基于社区经验整理的申请流程说明
- **退件原因**：汇总历史退件原因及出现频次
- **简写对照表**：移民常见缩写的全称对照
- **中英文切换**：页面右上角一键切换，语言偏好自动保存

---

## 数据更新

数据来源为公开共享的 Google Sheets，通过 GitHub Actions 每天**温哥华时间早 8 点**自动抓取并更新，抓取结果提交回仓库后 Vercel 自动重新部署。

也可在 [Actions 页面](https://github.com/frankwang0909/nonee-pr-progress-tracker/actions) 手动触发更新。

---

## 本地运行

```bash
# 抓取并清洗数据
npm run fetch

# 启动本地服务器
npm run start
```

启动后访问 `http://localhost:4173`。

---

## 项目结构

```
├── index.html                  # 主页
├── contribute.html             # 数据源贡献页
├── app.js                      # 前端逻辑 + 国际化
├── styles.css                  # 样式
├── scripts/
│   ├── fetch-and-clean.mjs     # 数据抓取与清洗脚本
│   └── serve.mjs               # 本地开发服务器
├── data/
│   ├── dashboard-summary.json  # 最终输出（被静态站直接读取）
│   ├── raw/                    # 原始抓取数据（gitignored）
│   └── clean/                  # 中间清洗数据（gitignored）
├── .github/workflows/
│   └── daily-fetch.yml         # 每日定时抓取 Action
└── vercel.json                 # Vercel 部署配置
```

---

## 贡献数据

可在对应月份的共享 Google Sheet 中补充或修正记录，点击页面中的「贡献数据 / 查看全部数据源」进入数据源列表。
