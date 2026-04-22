# 测试报告目录结构

本目录用于存储 Sky Burst 游戏的测试执行报告。

---

## 目录结构

```
reports/
├── TC-{用例ID}/                 # 每个用例独立目录
│   ├── index.md                 # 用例执行历史汇总 ⭐
│   ├── YYYY-MM-DD_NNN.md        # 单次执行报告
│   ├── YYYY-MM-DD_NNN-pass.md   # 通过报告（带后缀）
│   ├── YYYY-MM-DD_NNN-fail.md   # 失败报告（带后缀）
│   └── artifacts/               # 该用例的证据文件
│       ├── screenshots/
│       ├── videos/
│       └── logs/
│
├── daily/                       # 当日执行汇总
│   ├── YYYY-MM-DD.md            # 当日汇总
│   └── YYYY-MM-DD.md
│
├── templates/                   # 报告模板
│   ├── test_report.md           # 标准测试报告模板
│   └── regression_report.md     # 回归验证报告模板
│
├── issue-drafts/                # Issue 内容草稿
│   └── issue-{序号}-{用例ID}.md
│
└── README.md                    # 本说明文件
```

---

## 目录命名规则

### 用例目录

| 规则 | 格式 | 示例 |
|------|------|------|
| 用例目录 | `TC-{用例ID}` | `TC-CTRL-007/` |
| 执行报告 | `YYYY-MM-DD_NNN[-状态]` | `2026-04-22_001-fail.md` |
| 汇总文件 | `index.md` | `index.md` |
| 证据目录 | `artifacts/` | `artifacts/screenshots/` |

### 执行报告命名后缀

| 后缀 | 含义 |
|------|------|
| `-pass` | 执行通过 |
| `-fail` | 执行失败 |
| `-regression-pass` | 回归验证通过 |
| `-regression-fail` | 回归验证失败 |

### 当日汇总

| 规则 | 格式 | 示例 |
|------|------|------|
| 当日汇总 | `YYYY-MM-DD.md` | `daily/2026-04-22.md` |

---

## 核心文件说明

### index.md（用例执行历史汇总）

每个用例目录下的 `index.md` 包含：

- 用例基本信息
- 执行历史表格（链接到每次执行报告）
- 执行统计（通过/失败次数）
- Issue 关联记录
- 证据文件清单
- 用例版本变更历史

**作用**: 快速追溯一个用例的完整执行历史。

### 单次执行报告

每次执行生成的报告文件：

- 用例信息
- 执行信息
- 执行结果
- 执行步骤记录
- 断言验证
- 证据链接
- Issue 关联（如有）

---

## 使用示例

### 查看用例执行历史

```bash
# 查看 TC-CTRL-007 的所有执行记录
cat test-cases/reports/TC-CTRL-007/index.md

# 查看首次失败报告
cat test-cases/reports/TC-CTRL-007/2026-04-22_001-fail.md

# 查看复测通过报告
cat test-cases/reports/TC-CTRL-007/2026-04-22_002-pass.md
```

### 查看当日执行汇总

```bash
# 查看当日所有用例执行情况
cat test-cases/reports/daily/2026-04-22.md
```

### 查看特定用例的证据

```bash
# 查看截图
ls test-cases/reports/TC-CTRL-007/artifacts/screenshots/

# 查看日志
cat test-cases/reports/TC-CTRL-007/artifacts/logs/2026-04-22_001-position.json
```

---

## 执行序号生成规则

同一用例在同一天多次执行时，序号递增：

```bash
# 当日首次执行
2026-04-22_001-fail.md

# 当日第二次执行（复测）
2026-04-22_002-pass.md

# 当日第三次执行
2026-04-22_003-regression-pass.md

# 另一天执行
2026-04-25_001-pass.md
```

---

## 与旧结构对比

| 旧结构 | 新结构 |
|--------|--------|
| 按批次目录组织 | 按用例目录组织 |
| 同用例报告分散在多个目录 | 同用例报告集中在同一目录 |
| 无执行历史汇总 | 有 index.md 汇总 |
| Issue 草稿混在报告目录 | Issue 草稿独立目录 |
| 无 artifacts 结构 | artifacts 集中存放证据 |

---

## 创建新执行报告

```bash
# 创建用例目录（首次）
mkdir -p test-cases/reports/TC-NEW-001/artifacts/screenshots

# 创建执行报告
DATE=$(date +%Y-%m-%d)
SEQ=001
touch test-cases/reports/TC-NEW-001/${DATE}_${SEQ}-pass.md

# 创建 index.md
touch test-cases/reports/TC-NEW-001/index.md

# 更新当日汇总
touch test-cases/reports/daily/${DATE}.md
```

---

## 关键优势

1. **追溯便捷** - 同一用例所有执行历史集中在一个目录
2. **一目了然** - index.md 快速查看执行历史和统计
3. **命名统一** - 日期+序号+状态后缀，含义清晰
4. **证据集中** - artifacts 存放该用例所有证据文件
5. **当日汇总** - daily 目录便于查看当日整体执行情况