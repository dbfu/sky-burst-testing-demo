# 测试失败提交 GitHub Issue 流程

## 流程概览

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  测试执行   │ ──▶ │  结果分析   │ ──▶ │  收集证据   │ ──▶ │  创建 Issue │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                     │
                                                                     ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  回归验证   │ ──▶ │  关闭 Issue │ ──▶ │  更新状态   │ ──▶ │  通知团队   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 详细步骤

### Step 1: 测试执行并确认失败

执行测试用例后，确认失败状态：

| 状态 | 含义 | 是否创建 Issue |
|------|------|---------------|
| ✅ 通过 | 用例通过 | ❌ 不创建 |
| ❌ 失败 | 断言不通过 | ✅ 需创建 |
| ⏸️ 阻塞 | 前置条件未满足 | ⚠️ 视情况 |
| ⏭️ 跳过 | 未执行 | ❌ 不创建 |

### Step 2: 分析失败原因

失败类型判断：

| 类型 | 描述 | Issue 标签 |
|------|------|-----------|
| `assertion_failed` | 断言验证失败 | `bug` |
| `precondition_failed` | 前置条件失败 | `blocked` |
| `timeout` | 超时 | `performance` |
| `unexpected_behavior` | 非预期行为 | `bug` |
| `test_case_error` | 用例设计问题 | `test-issue` |

**关键判断**: 是否是真正的代码缺陷？

- ✅ 是缺陷 → 创建 Bug Issue
- ❌ 是用例问题 → 更新用例，不创建 Issue
- ❌ 是环境问题 → 重新执行，不创建 Issue

### Step 3: 收集证据

必须收集的证据：

```
artifacts/
├── screenshots/
│   └── TC-CTRL-007-fail.png      # 失败截图
├── videos/
│   └── TC-CTRL-007-fail.webm     # 失败录屏
└── logs/
    └── TC-CTRL-007-position.json # 位置数据日志
```

### Step 4: 创建 GitHub Issue

#### 方式 A: 使用 gh CLI（推荐）

```bash
# 创建 Issue
gh issue create \
  --title "[TEST-FAIL] TC-CTRL-007 - 玩家移动边界限制失效" \
  --body-file test-cases/reports/2026-04-22/TC-CTRL-007-issue.md \
  --label "test-failure,bug,P0,module:controls" \
  --assignee @me

# 输出示例
Creating issue in your-org/sky-burst...
https://github.com/your-org/sky-burst/issues/12
```

#### 方式 B: 使用自动化脚本

```bash
# 执行脚本
./scripts/create-issue-from-failure.sh TC-CTRL-007

# 脚本自动:
# 1. 读取测试报告
# 2. 提取关键信息
# 3. 生成 Issue 内容
# 4. 调用 gh issue create
```

#### 方式 C: 手动创建（备用）

1. 访问 GitHub 仓库 Issues 页面
2. 点击 "New Issue"
3. 选择 "Test Failure" 模板
4. 填写信息并提交

### Step 5: 关联 Issue 到测试报告

更新测试报告，添加 Issue 链接：

```markdown
## 关联缺陷

| 项目 | 内容 |
|------|------|
| GitHub Issue | [#12](https://github.com/your-org/sky-burst/issues/12) |
| Issue 创建时间 | 2026-04-22 14:35 |
```

### Step 6: 在 Issue 中反向引用

Issue 中添加测试报告链接：

```markdown
### 证据链接

- 测试报告: [TC-CTRL-007.md](../test-cases/reports/2026-04-22/TC-CTRL-007.md)
```

---

## Issue 标签体系

| 标签 | 颜色 | 用途 |
|------|------|------|
| `test-failure` | 🔴 红色 | 测试失败 |
| `bug` | 🟠 橙色 | 代码缺陷 |
| `P0` | 🔴 红色 | 最高优先级 |
| `P1` | 🟡 黄色 | 高优先级 |
| `P2` | 🟢 绿色 | 中优先级 |
| `blocked` | 🔵 蓝色 | 阻塞其他测试 |
| `module:controls` | 🟣 紫色 | 所属模块 |
| `needs-investigation` | ⚪ 白色 | 待调查 |

---

## Issue 状态流转

```
Open ──▶ In Progress ──▶ Fixed ──▶ Verified ──▶ Closed
  │           │            │          │
  │           │            │          └─▶ 回归通过
  │           │            └─▶ 代码修复完成
  │           └─▶ 开发开始处理
  └─▶ 新创建
```

---

## 自动化脚本示例

### scripts/create-issue-from-failure.sh

```bash
#!/bin/bash
set -e

CASE_ID=$1
REPORT_DIR="test-cases/reports"
LATEST_DATE=$(ls -t "$REPORT_DIR" | head -1)
REPORT_FILE="$REPORT_DIR/$LATEST_DATE/$CASE_ID.md"

if [[ ! -f "$REPORT_FILE" ]]; then
  echo "Error: Report file not found: $REPORT_FILE"
  exit 1
fi

# 检查是否是失败报告
STATUS=$(grep "状态" "$REPORT_FILE" | head -1 | grep -o "❌ 失败" || true)
if [[ -z "$STATUS" ]]; then
  echo "Info: Test case passed, no issue needed"
  exit 0
fi

# 提取信息
TITLE=$(grep "用例标题" "$REPORT_FILE" | cut -d'|' -f3 | tr -d ' ')
MODULE=$(grep "所属模块" "$REPORT_FILE" | cut -d'|' -f3 | tr -d ' ')
PRIORITY=$(grep "优先级" "$REPORT_FILE" | cut -d'|' -f3 | tr -d ' ')

# 创建 Issue
ISSUE_TITLE="[TEST-FAIL] $CASE_ID - $TITLE"
LABELS="test-failure,bug,$PRIORITY,module:$MODULE"

echo "Creating issue..."
gh issue create \
  --title "$ISSUE_TITLE" \
  --body-file "$REPORT_FILE" \
  --label "$LABELS"

echo "Issue created successfully!"
```

---

## Issue 与测试用例的双向关联

```
GitHub Issue #12
│
├── 链接到 ──▶ test-cases/reports/2026-04-22/TC-CTRL-007.md
│                   │
│                   └── 链接到 ──▶ test-cases/controls.yaml (TC-CTRL-007)
│                                       │
│                                       └── history 字段记录变更
│
└── 修复后 ──▶ 用例版本升级 (v1.1 → v1.2)
              │
              └── 回归测试 ──▶ 新报告 TC-CTRL-007.md (✅ 通过)
                              │
                              └── Issue 状态 ──▶ Closed
```

---

## 总结

| 步骤 | 操作 | 工具 |
|------|------|------|
| 1 | 确认失败状态 | 测试报告 |
| 2 | 分析失败原因 | 人工判断 |
| 3 | 收集证据 | 截图/视频/日志 |
| 4 | 创建 Issue | `gh issue create` |
| 5 | 关联 Issue ID | 更新测试报告 |
| 6 | 追踪状态 | Issue 状态流转 |
| 7 | 回归验证 | 重新执行用例 |
| 8 | 关闭 Issue | `gh issue close` |