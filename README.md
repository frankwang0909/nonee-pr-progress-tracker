# Nonee PR Progress Tracker (Simplified)

## 目标
- 抓取公开共享的 Google Sheets 数据源
- 清洗后只输出以下指标：
  - AOR 推进到哪天提交
  - Portal 1 推进到哪天提交
  - Portal 2 推进到哪天提交
  - eCOPR 推进到哪天提交
  - PR Card 推进到哪天提交
  - Return 条数 + 原因
- 前端含 4 个 tab：
  - `退件原因`
  - `缩写说明`（移民常见简写对照全称）
  - `PR流程步骤`（高层流程说明）
  - `PR流程图`（简化可视化流程）

## 使用
1. 抓取并清洗数据
```bash
npm run fetch
```

2. 启动前端
```bash
npm run start
```

3. 打开
- `http://localhost:4173`
- 主页可点击 `贡献数据 / 查看全部数据源` 按钮进入 `contribute.html`

## 输出文件
- 原始数据（每个 source 一份）：`data/raw/*.json`
- 合并清洗记录：`data/clean/records.json`
- Dashboard 数据：`data/dashboard-summary.json`
