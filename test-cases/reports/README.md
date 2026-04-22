# 测试报告目录结构

本目录用于存储 Sky Burst 游戏的测试执行报告。

## 目录命名规范

格式：`YYYY-MM-DD_类型`

| 类型 | 格式 | 示例 | 用途 |
|------|------|------|------|
| 全量测试 | `YYYY-MM-DD_run-NNN` | `2026-04-22_run-001` | 日常全量回归 |
| 模块专项 | `YYYY-MM-DD_module名` | `2026-04-22_controls` | 模块专项验证 |
| 版本回归 | `vX.Y_类型` | `v1.1_regression` | 版本发布前回归 |
| 缺陷验证 | `YYYY-MM-DD_bug-ID` | `2026-04-25_bug-002` | 单缺陷验证 |
| 冒烟测试 | `YYYY-MM-DD_smoke` | `2026-04-22_smoke` | 快速冒烟 |

---

## 目录结构示例

```
reports/
├── 2026-04-22_index.md          # 当日执行索引
├── 2026-04-22_run-001/          # 当日首次全量回归
│   ├── summary.md               # 汇总报告
│   ├── TC-UI-001.md             # 单用例报告
│   ├── TC-CTRL-007.md
│   └── artifacts/               # 执行证据
│       ├── screenshots/
│       ├── videos/
│       └── logs/
│
├── 2026-04-22_run-002/          # 当日第二次回归（修复后）
│   ├── summary.md
│   ├── TC-CTRL-007.md           # 回归验证报告
│   └── artifacts/
│
├── 2026-04-22_controls/         # 当日模块专项
│   ├── summary.md
│   └── ...
│
├── 2026-04-25_run-001/          # v1.1 道具系统测试
│   ├── summary.md
│   ├── TC-ITEM-001.md
│   └── artifacts/
│
├── DIRECTORY_SPEC.md            # 目录命名规范详细说明
└── README.md                    # 本说明文件
```

---

## 当日索引文件

每个测试日期创建一个索引文件 `YYYY-MM-DD_index.md`：

```markdown
# 2026-04-22 测试执行索引

| 执行批次 | 开始时间 | 类型 | 用例数 | 通过 | 失败 | 详情 |
|---------|---------|------|--------|------|------|------|
| run-001 | 14:30 | 全量回归 | 32 | 28 | 2 | [summary](2026-04-22_run-001/summary.md) |
| run-002 | 16:30 | 回归验证 | 10 | 10 | 0 | [summary](2026-04-22_run-002/summary.md) |
```

---

## 执行批次命名规则

### 序号生成

```bash
# 当日首次执行
2026-04-22_run-001

# 当日第二次执行
2026-04-22_run-002

# 当日第三次执行
2026-04-22_run-003
```

### 自动生成脚本

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
COUNT=$(ls -d reports/${DATE}_run-* 2>/dev/null | wc -l | tr -d ' ')
NEXT=$((COUNT + 1))
BATCH_ID="${DATE}_run-$(printf '%03d' $NEXT)"

mkdir -p "reports/${BATCH_ID}/artifacts"
echo "Created: reports/${BATCH_ID}"
```

---

## 报告文件规范

### 单用例报告命名

- 文件名：`TC-{用例ID}.md`
- 示例：`TC-CTRL-007.md`

### 汇总报告命名

- 文件名：`summary.md`
- 内容：执行统计、用例列表、缺陷汇总

---

## 证据文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 截图 | `TC-{ID}-{描述}.png` | `TC-CTRL-007-fail.png` |
| 视频 | `TC-{ID}-{描述}.webm` | `TC-CTRL-007-fail.webm` |
| 日志 | `TC-{ID}-{类型}.json` | `TC-CTRL-007-position.json` |

---

## 快速检索

```bash
# 查看当日所有执行批次
ls reports/2026-04-22_*

# 查看当日索引
cat reports/2026-04-22_index.md

# 查看特定批次汇总
cat reports/2026-04-22_run-001/summary.md

# 查看特定用例所有执行记录
find reports -name "TC-CTRL-007.md"
```

---

## 与 Issue 关联

每份测试报告包含 Issue 关联字段：

```markdown
## 关联缺陷

| 项目 | 内容 |
|------|------|
| GitHub Issue | [#12](https://github.com/.../issues/12) |
| 发现批次 | 2026-04-22_run-001 |
| 验证批次 | 2026-04-22_run-002 |
```