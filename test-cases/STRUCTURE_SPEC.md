# 测试用例目录结构规范

## 1. 结构概述

Sky Burst 测试项目采用 **模块分组 + 用例独立目录** 的组织方式，每个测试用例的定义、执行报告和证据文件集中存放在同一目录中。

---

## 2. 目录结构

```
test-cases/
│
├── index.yaml                         # 项目用例索引
│
├── {module}/                          # 模块目录（按功能分组）
│   └── {case-id}/                     # 用例独立目录
│       ├── {case-id}.yaml             # 用例定义文件
│       ├── index.md                   # 执行历史汇总
│       ├── {date}_{seq}-{status}/     # 执行报告目录
│       │   ├── report.md              # 执行报告
│       │   ├── screenshots/           # 截图证据
│       │   ├── videos/                # 视频证据
│       │   └── logs/                  # 日志证据
│       └── ...
│
├── ISSUE_WORKFLOW.md                  # Issue 提流程
├── REGRESSION_WORKFLOW.md             # 复测流程
└── TESTER_RESPONSIBILITIES.md         # 测试人员职责
```

---

## 3. 模块目录命名

### 3.1 模块 ID 对照表

| 模块 ID | 模块名称 | 说明 |
|---------|---------|------|
| `controls` | 键盘控制模块 | 方向键、WASD、边界限制 |
| `ui` | UI 模块 | 启动页、HUD、结束页 |
| `mobile` | 移动端控制模块 | 虚拟按键、触屏拖动 |
| `mechanics` | 游戏机制模块 | 射击、敌机、Boss、碰撞 |
| `state` | 状态流转模块 | 开始、结束、重开 |
| `render` | 渲染与性能模块 | 背景、粒子、帧率 |
| `items` | 道具系统模块 | 护盾、加速道具 |

### 3.2 命名规则

```
{module}/
```

- 使用小写英文
- 与测试用例 `module` 字段值一致
- 新增模块时需在 `index.yaml` 中注册

---

## 4. 用例目录命名

### 4.1 用例 ID 格式

```
TC-{MODULE}-{NUMBER}
```

| 部分 | 说明 | 示例 |
|------|------|------|
| `TC` | 固定前缀，表示 Test Case | `TC` |
| `{MODULE}` | 模块缩写（大写） | `CTRL`, `UI`, `ITEM` |
| `{NUMBER}` | 用例序号（三位数字） | `001`, `007` |

**示例**：
- `TC-CTRL-007` — 键盘控制模块第 7 个用例
- `TC-UI-001` — UI 模块第 1 个用例
- `TC-ITEM-001` — 道具系统模块第 1 个用例

### 4.2 用例目录结构

```
{case-id}/
├── {case-id}.yaml             # 用例定义文件
├── index.md                   # 执行历史汇总
└── {execution}/               # 执行报告目录（按需创建）
```

---

## 5. 用例定义文件

### 5.1 文件命名

```
{case-id}.yaml
```

与用例目录名称相同，例如 `TC-CTRL-007.yaml`。

### 5.2 文件内容结构

```yaml
# {case-id} {title}
# {module} 模块 - 测试用例

id: TC-CTRL-007
title: 移动边界限制
version: 1.1
priority: P0
module: controls
tags: [boundary, movement, regression]

created_at: 2026-04-22
updated_at: 2026-04-22
status: active

history:
  - version: 1.0
    date: 2026-04-22
    author: Claude
    change: 初始创建
  - version: 1.1
    date: 2026-04-22
    author: Claude
    change: BUG-002 修复后更新边界值

related_issue: https://github.com/dbfu/sky-burst-testing-demo/issues/1

preconditions:
  - 游戏运行中

steps:
  - action: 长按 ArrowLeft 直到贴边
    expected: 玩家停止在左边界
  - action: 长按 ArrowRight 直到贴边
    expected: 玩家停止在右边界

expected_results:
  - 玩家不会越界
  - X 始终位于 [25, canvas.width - 25]

assertions:
  - type: state
    description: 边界值稳定
    validate:
      - player.x >= 25
      - player.x <= canvas.width - 25
```

### 5.3 必填字段

| 字段 | 说明 | 格式 |
|------|------|------|
| `id` | 用例唯一标识 | `TC-{MODULE}-{NUMBER}` |
| `title` | 用例标题 | 简短描述 |
| `version` | 用例版本号 | `1.0`, `1.1`, `1.2` |
| `priority` | 优先级 | `P0`, `P1`, `P2` |
| `module` | 所属模块 | 与模块目录名一致 |
| `status` | 状态 | `active`, `deprecated`, `draft` |
| `created_at` | 创建日期 | `YYYY-MM-DD` |
| `updated_at` | 最后更新日期 | `YYYY-MM-DD` |

---

## 6. 执行历史汇总文件

### 6.1 文件命名

```
index.md
```

每个用例目录必须包含 `index.md`，汇总该用例的所有执行历史。

### 6.2 文件内容结构

```markdown
# TC-CTRL-007 执行历史

## 用例信息

| 项目 | 内容 |
|------|------|
| 用例编号 | TC-CTRL-007 |
| 用例标题 | 移动边界限制 |
| 所属模块 | 键盘控制 |
| 优先级 | P0 |
| 当前版本 | v1.1 |

---

## 执行记录

| 序号 | 日期 | 目录 | 结果 | 说明 |
|------|------|------|------|------|
| 001 | 2026-04-22 | [2026-04-22_001-fail](2026-04-22_001-fail) | ❌ 失败 | 首次执行 |
| 002 | 2026-04-22 | [2026-04-22_002-pass](2026-04-22_002-pass) | ✅ 通过 | 复测通过 |

---

## 用例定义

参见：[TC-CTRL-007.yaml](TC-CTRL-007.yaml)

---

## 目录结构

TC-CTRL-007/
├── TC-CTRL-007.yaml
├── index.md
├── 2026-04-22_001-fail/
└── 2026-04-22_002-pass/

---

*最后更新: 2026-04-22*
```

---

## 7. 执行报告目录命名

### 7.1 命名格式

```
{date}_{seq}-{status}
```

| 部分 | 说明 | 格式 | 示例 |
|------|------|------|------|
| `{date}` | 执行日期 | `YYYY-MM-DD` | `2026-04-22` |
| `{seq}` | 当日执行序号 | 三位数字 | `001`, `002` |
| `{status}` | 执行结果状态 | 见下表 | `pass`, `fail` |

### 7.2 状态后缀

| 状态 | 含义 | 使用场景 |
|------|------|---------|
| `pass` | 执行通过 | 断言全部验证成功 |
| `fail` | 执行失败 | 断言验证失败，发现缺陷 |
| `regression-pass` | 回归验证通过 | 缺陷修复后复测通过 |
| `regression-fail` | 回归验证失败 | 缺陷修复后复测仍失败 |
| `blocked` | 执行阻塞 | 前置条件未满足 |
| `skip` | 执行跳过 | 未执行 |

### 7.3 命名示例

```
2026-04-22_001-fail/              # 当日首次执行，失败
2026-04-22_002-pass/              # 当日第二次执行，通过
2026-04-22_003-regression-pass/   # 当日第三次执行，回归验证通过
2026-04-25_001-pass/              # 另一日首次执行，通过
```

---

## 8. 执行报告文件

### 8.1 报告文件命名

```
report.md
```

每个执行目录必须包含 `report.md`。

### 8.2 报告目录结构

```
{date}_{seq}-{status}/
├── report.md                  # 执行报告（必填）
├── screenshots/               # 截图证据目录
│   └── {description}.png
├── videos/                    # 视频证据目录
│   └── {description}.webm
├── logs/                      # 日志证据目录
│   └── {description}.json
└── EVIDENCE.md                # 证据说明（可选）
```

### 8.3 证据文件命名

| 类型 | 目录 | 命名格式 | 示例 |
|------|------|---------|------|
| 截图 | `screenshots/` | `{描述}.png` | `boundary-violation.png` |
| 视频 | `videos/` | `{描述}.webm` | `execution.webm` |
| 日志 | `logs/` | `{描述}.json` | `position.json` |

---

## 9. 完整用例目录示例

```
controls/
└── TC-CTRL-007/
    ├── TC-CTRL-007.yaml                # 用例定义
    ├── index.md                        # 执行历史汇总
    │
    ├── 2026-04-22_001-fail/            # 首次执行（失败）
    │   ├── report.md                   # 执行报告
    │   ├── screenshots/                # 截图
    │   │   ├── boundary-violation.png
    │   │   └── player-position.png
    │   ├── videos/                     # 视频
    │   │   └── execution.webm
    │   ├── logs/                       # 日志
    │   │   └── position.json
    │   └── EVIDENCE.md                 # 证据说明
    │
    ├── 2026-04-22_002-pass/            # 复测（通过）
    │   ├── report.md
    │   └── screenshots/
    │       └── boundary-fixed.png
    │
    ├── 2026-04-22_003-regression-pass/ # 回归验证（通过）
    │   └── report.md
    │
    └── 2026-04-22_004-regression-fail/ # 回归验证（失败示例）
        └── report.md
```

---

## 10. 索引文件

### 10.1 项目索引

```
test-cases/index.yaml
```

汇总所有模块和用例信息：

```yaml
project:
  name: Sky Burst
  version: v1.1

modules:
  - id: controls
    name: 键盘控制模块
    directory: controls/
    cases:
      - TC-CTRL-001
      - TC-CTRL-007
    count: 8

  - id: ui
    name: UI 模块
    directory: ui/
    cases:
      - TC-UI-001
    count: 3

structure:
  pattern: "{module}/{case-id}/"
```

---

## 11. 创建新用例流程

### 11.1 步骤

1. 确定用例所属模块
2. 创建用例目录 `{module}/{case-id}/`
3. 创建用例定义文件 `{case-id}.yaml`
4. 创建执行历史汇总 `index.md`
5. 更新项目索引 `test-cases/index.yaml`

### 11.2 命令示例

```bash
# 创建新用例目录
mkdir -p test-cases/controls/TC-CTRL-009

# 创建用例定义文件
touch test-cases/controls/TC-CTRL-009/TC-CTRL-009.yaml

# 创建执行历史汇总
touch test-cases/controls/TC-CTRL-009/index.md

# 编辑文件内容...
```

---

## 12. 创建执行报告流程

### 12.1 步骤

1. 执行测试用例
2. 确定执行结果状态
3. 创建执行报告目录 `{date}_{seq}-{status}/`
4. 创建报告文件 `report.md`
5. 收集证据文件到对应目录
6. 更新 `index.md` 执行记录

### 12.2 命令示例

```bash
# 创建执行报告目录
mkdir -p test-cases/controls/TC-CTRL-007/2026-04-25_001-pass

# 创建报告文件
touch test-cases/controls/TC-CTRL-007/2026-04-25_001-pass/report.md

# 创建证据目录
mkdir -p test-cases/controls/TC-CTRL-007/2026-04-25_001-pass/screenshots
mkdir -p test-cases/controls/TC-CTRL-007/2026-04-25_001-pass/videos
mkdir -p test-cases/controls/TC-CTRL-007/2026-04-25_001-pass/logs

# 更新 index.md 添加执行记录...
```

---

## 13. 文件引用规范

### 13.1 报告引用用例定义

在 `index.md` 中引用：

```markdown
## 用例定义

参见：[TC-CTRL-007.yaml](TC-CTRL-007.yaml)
```

### 13.2 汇总引用执行报告

在 `index.md` 中引用执行目录：

```markdown
| 001 | 2026-04-22 | [2026-04-22_001-fail](2026-04-22_001-fail) | ❌ 失败 |
```

### 13.3 报告引用证据文件

在 `report.md` 中引用证据：

```markdown
## 证据

| 类型 | 文件路径 |
|------|---------|
| 截图 | [screenshots/boundary-violation.png](screenshots/boundary-violation.png) |
| 视频 | [videos/execution.webm](videos/execution.webm) |
```

---

## 14. Git 版本管理

### 14.1 提交规范

| 提交类型 | 提交信息格式 |
|---------|-------------|
| 新增用例 | `新增用例 TC-{ID}: {title}` |
| 更新用例 | `更新用例 TC-{ID} v{旧版本}→v{新版本}: {变更说明}` |
| 新增执行报告 | `执行报告 TC-{ID} {date}_{seq}: {状态}` |
| 复测验证 | `复测通过 TC-{ID}: Issue #{issue-id} 验证完成` |

### 14.2 提交示例

```bash
# 新增用例
git add test-cases/controls/TC-CTRL-009/
git commit -m "新增用例 TC-CTRL-009: 新功能验证"

# 执行报告
git add test-cases/controls/TC-CTRL-007/2026-04-25_001-pass/
git commit -m "执行报告 TC-CTRL-007 2026-04-25_001: pass"

# 复测验证
git add test-cases/controls/TC-CTRL-007/2026-04-25_002-regression-pass/
git commit -m "复测通过 TC-CTRL-007: Issue #1 验证完成"
```

---

## 15. 命名对照表

### 15.1 模块缩写

| 模块目录 | 用例 ID 缩写 |
|---------|-------------|
| `controls` | `CTRL` |
| `ui` | `UI` |
| `mobile` | `MOBILE` |
| `mechanics` | `MECH` |
| `state` | `STATE` |
| `render` | `RENDER` |
| `items` | `ITEM` |

### 15.2 优先级

| 优先级 | 说明 | 目录标记 |
|--------|------|---------|
| `P0` | 最高优先级，核心功能 | 必须执行 |
| `P1` | 高优先级，重要功能 | 常规执行 |
| `P2` | 中优先级，辅助功能 | 按需执行 |

### 15.3 用例状态

| 状态 | 说明 | 目录保留 |
|------|------|---------|
| `active` | 活跃用例 | 正常执行 |
| `deprecated` | 已废弃 | 保留目录，不执行 |
| `draft` | 草稿 | 保留目录，待评审 |

---

## 16. 查询命令

### 16.1 查看用例列表

```bash
# 查看所有用例目录
find test-cases -name "*.yaml" -path "*/TC-*"

# 查看特定模块用例
ls test-cases/controls/

# 查看特定用例详情
cat test-cases/controls/TC-CTRL-007/TC-CTRL-007.yaml
```

### 16.2 查看执行历史

```bash
# 查看用例执行历史汇总
cat test-cases/controls/TC-CTRL-007/index.md

# 查看所有执行报告
find test-cases -name "report.md"

# 查看特定用例的所有执行
ls test-cases/controls/TC-CTRL-007/
```

---

## 17. 规范检查

### 17.1 必须存在的文件

每个用例目录必须包含：

- `{case-id}.yaml` — 用例定义文件
- `index.md` — 执行历史汇总

每次执行必须包含：

- `report.md` — 执行报告

### 17.2 建议存在的文件

- `EVIDENCE.md` — 证据说明（有证据时）
- `screenshots/` — 截图目录（有截图时）
- `videos/` — 视频目录（有视频时）
- `logs/` — 日志目录（有日志时）

---

## 18. 参考文档

| 文档 | 用途 |
|------|------|
| `ISSUE_WORKFLOW.md` | Issue 创建流程 |
| `REGRESSION_WORKFLOW.md` | 复测验证流程 |
| `TESTER_RESPONSIBILITIES.md` | 测试人员职责 |

---

*文档版本: v1.0*
*创建日期: 2026-04-23*