# 测试报告目录结构规范

## 目录命名方案

采用 **日期 + 执行序号** 或 **日期 + 时间戳** 方式：

```
reports/
├── 2026-04-22_run-001/        # 方案 A: 日期 + 序号
├── 2026-04-22_run-002/        # 同日第二次执行
├── 2026-04-22_143000/         # 方案 B: 日期 + 时间戳
├── 2026-04-22_controls/       # 方案 C: 日期 + 模块专项
├── v1.1_regression/           # 方案 D: 版本 + 类型
└── README.md
```

---

## 推荐方案：日期 + 序号

格式：`YYYY-MM-DD_run-NNN`

```
reports/
├── 2026-04-22_run-001/
│   ├── summary.md
│   ├── TC-UI-001.md
│   ├── TC-CTRL-007.md
│   └── artifacts/
│       ├── screenshots/
│       ├── videos/
│       └── logs/
│
├── 2026-04-22_run-002/        # 当天第二次全量回归
│   ├── summary.md
│   └── ...
│
├── 2026-04-22_controls/       # 当天模块专项测试
│   ├── summary.md
│   ├── TC-CTRL-001.md
│   ├── ...
│
└── 2026-04-25_run-001/        # v1.1 道具系统测试
│   ├── summary.md
│   ├── TC-ITEM-001.md
│   └── ...
```

---

## 目录命名规则

| 类型 | 格式 | 示例 | 用途 |
|------|------|------|------|
| 全量测试 | `YYYY-MM-DD_run-NNN` | `2026-04-22_run-001` | 日常全量回归 |
| 模块专项 | `YYYY-MM-DD_module名` | `2026-04-22_controls` | 模块专项验证 |
| 版本回归 | `vX.Y_类型` | `v1.1_regression` | 版本发布前回归 |
| 缺陷验证 | `YYYY-MM-DD_bug-ID` | `2026-04-25_bug-002` | 单缺陷验证 |
| 冒烟测试 | `YYYY-MM-DD_smoke` | `2026-04-22_smoke` | 快速冒烟 |

---

## 序号生成规则

```bash
# 自动获取当天下一个序号
get_next_run_number() {
  date=$1
  count=$(ls -d reports/${date}_run-* 2>/dev/null | wc -l)
  echo $((count + 1))
}

# 示例
next_run=$(get_next_run_number "2026-04-22")
# 结果: 001 (首次), 002 (第二次), 003 (第三次)
```

---

## 执行信息字段

报告文件内添加执行批次信息：

```yaml
execution:
  batch_id: "2026-04-22_run-002"
  date: 2026-04-22
  run_number: 002
  start_time: "15:30:00"
  trigger: regression-after-fix
```

---

## 快速检索

通过 summary.md 索引文件快速定位：

```markdown
# 2026-04-22 测试执行索引

| 执行批次 | 时间 | 类型 | 结果 | 详情 |
|---------|------|------|------|------|
| run-001 | 14:30 | 全量 | 28/32 通过 | [summary](2026-04-22_run-001/summary.md) |
| run-002 | 15:30 | 回归 | 32/32 通过 | [summary](2026-04-22_run-002/summary.md) |
| controls | 16:00 | 专项 | 8/8 通过 | [summary](2026-04-22_controls/summary.md) |
```

---

## 与旧目录对比

| 旧方案 | 新方案 |
|--------|--------|
| `2026-04-22/` | `2026-04-22_run-001/` |
| 同日第二次覆盖或混乱 | `2026-04-22_run-002/` 清晰独立 |
| 无法区分测试类型 | `_controls`, `_smoke` 明确类型 |