# 复测（回归验证）流程规范

## 流程概览

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Issue Open  │ ──▶ │ 开发修复    │ ──▶ │ Issue Fixed │ ──▶ │ 触发复测    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Issue Closed│ ──▶ │ 更新用例    │ ──▶ │ 归档报告    │ ──▶ │ 通知团队    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │
       │ 复测不通过
       ▼
┌─────────────┐     ┌─────────────┐
│ Issue Reopen│ ──▶ │ 补充信息    │
└─────────────┘     └─────────────┘
```

---

## 详细步骤

### Step 1: 监控 Issue 状态

关注 Issue 状态变化：

| 状态 | 含义 | 测试动作 |
|------|------|---------|
| `Open` | 待处理 | 等待 |
| `In Progress` | 开发处理中 | 等待 |
| `Fixed` | 已提交修复 | **触发复测** |
| `Verified` | 复测通过 | 准备关闭 |
| `Closed` | 已关闭 | 归档 |
| `Reopened` | 复测失败 | 补充信息 |

监控方式：
```bash
# 查看指定 Issue 状态
gh issue view 12 --json state,title

# 查看所有待复测 Issue
gh issue list --label fixed --state open
```

---

### Step 2: 确认修复信息

开发修复后，Issue 应包含以下信息：

| 信息 | 来源 | 用途 |
|------|------|------|
| 修复 commit | 开发评论 | 确认修复范围 |
| 修复版本 | 开发评论 | 确认测试版本 |
| 修复范围 | 开发评论 | 确定复测范围 |
| 修复说明 | Issue 评论 | 理解修复逻辑 |

示例 Issue 评论：
```markdown
## 修复完成

- 修复 commit: abc1234
- 修复内容: 调整边界计算逻辑，将边界值从 28 改为 25
- 影响范围: controls 模块边界验证
- 建议复测: TC-CTRL-001 ~ TC-CTRL-008
```

---

### Step 3: 确定复测范围

#### 范围确定原则

| 范围类型 | 说明 | 用例数 |
|----------|------|--------|
| **最小范围** | 仅复测失败用例 | 1-3 个 |
| **模块范围** | 复测相关模块全部用例 | 5-10 个 |
| **关联范围** | 复测可能受影响的用例 | 10-20 个 |
| **全量回归** | 版本发布前全部用例 | 全部 |

#### 范围选择依据

```markdown
最小范围适用:
- 修复范围明确且独立
- 不影响其他功能
- 快速验证

模块范围适用:
- 修复涉及模块核心逻辑
- 可能影响模块内其他用例
- 常规回归

关联范围适用:
- 修复涉及公共组件
- 可能影响多个模块
- 跨模块回归

全量回归适用:
- 版本发布前
- 大范围重构后
- 核心架构变更
```

---

### Step 4: 执行复测

#### 创建复测执行批次

```bash
#!/bin/bash
# create_regression_batch.sh

DATE=$(date +%Y-%m-%d)
BUG_ID=$1  # 例如 bug-002

# 创建复测目录
mkdir -p "test-cases/reports/${DATE}_bug-${BUG_ID}/artifacts"

# 复制用例模板
echo "Created: test-cases/reports/${DATE}_bug-${BUG_ID}"
```

#### 执行用例

按照原测试用例执行，重点验证：

1. **原失败断言** — 是否已修复
2. **边界场景** — 修复是否引入新问题
3. **关联场景** — 其他用例是否受影响

---

### Step 5: 记录复测结果

#### 复测报告字段

```markdown
## 回归验证记录

| 项目 | 内容 |
|------|------|
| 关联缺陷 | BUG-002 |
| 关联 Issue | #12 |
| 修复 commit | abc1234 |
| 修复版本 | v1.0.1 |
| 首次失败批次 | 2026-04-22_run-001 |
| 复测批次 | 2026-04-22_run-002 |
| 复测结果 | ✅ 通过 / ❌ 失败 |
```

---

### Step 6: 处理复测结果

#### 复测通过

```bash
# 1. 更新 Issue 状态
gh issue comment 12 --body "复测通过，验证记录: [TC-CTRL-007.md](链接)"
gh issue edit 12 --add-label verified

# 2. 关闭 Issue
gh issue close 12 --comment "修复验证通过，Issue 关闭"

# 3. 更新测试用例版本（如有变更）
# 编辑 controls.yaml，更新 TC-CTRL-007 版本号

# 4. 更新当日索引
# 编辑 2026-04-22_index.md，添加复测记录
```

#### 复测失败

```bash
# 1. Reopen Issue
gh issue reopen 12

# 2. 补充失败信息
gh issue comment 12 --body "$(cat <<EOF
## 复测失败

复测批次: 2026-04-22_run-002
复测报告: [TC-CTRL-007.md](链接)

失败详情:
- 预期: player.x >= 25
- 实际: player.x = 22 (仍然超界)

问题分析:
修复后边界值仍有问题，建议重新检查 clamp 逻辑。

证据:
- 截图: [TC-CTRL-007-fail-v2.png](链接)
EOF
)"

# 3. 添加标签
gh issue edit 12 --add-label regression-failed
```

---

### Step 7: 更新用例版本（可选）

如果修复导致预期值变化，需更新用例：

```yaml
- id: TC-CTRL-007
  version: 1.2               # 版本升级
  updated_at: 2026-04-22
  status: active
  history:
    - version: 1.0
      change: 初始创建，边界值 28
    - version: 1.1
      change: BUG-002 修复后，边界值改为 25
    - version: 1.2
      change: 回归验证通过，更新断言值
  assertions:
    - validate:
        - player.x >= 25     # 从 28 改为 25
```

---

## 复测报告模板

参见：`test-cases/reports/TEMPLATE_regression.md`

---

## 自动化复测脚本

```bash
#!/bin/bash
# scripts/run_regression.sh

ISSUE_ID=$1
BUG_ID=$2
DATE=$(date +%Y-%m-%d)
BATCH="${DATE}_bug-${BUG_ID}"

# 创建复测目录
mkdir -p "test-cases/reports/${BATCH}/artifacts"

# 获取关联用例（从 Issue 提取）
CASE_ID=$(gh issue view $ISSUE_ID --json body --jq '.body' | grep "用例编号" | cut -d'|' -f3)

echo "===== 复测执行 ====="
echo "Issue: #$ISSUE_ID"
echo "Bug: $BUG_ID"
echo "Case: $CASE_ID"
echo "Batch: $BATCH"

# 执行测试（手动或自动化）
echo "请执行测试用例: $CASE_ID"
echo "完成后将报告保存至: test-cases/reports/${BATCH}/${CASE_ID}.md"

# 等待用户输入结果
read -p "复测结果 (pass/fail): " RESULT

if [ "$RESULT" == "pass" ]; then
  gh issue comment $ISSUE_ID --body "✅ 复测通过，批次: $BATCH"
  gh issue close $ISSUE_ID --comment "验证通过，关闭 Issue"
  echo "Issue #$ISSUE_ID 已关闭"
else
  gh issue reopen $ISSUE_ID
  gh issue comment $ISSUE_ID --body "❌ 复测失败，批次: $BATCH，请查看报告"
  echo "Issue #$ISSUE_ID 已 reopen"
fi
```

---

## 复测时机

| 时机 | 触发方式 | 范围 |
|------|---------|------|
| Issue 标记 Fixed | 自动/手动通知 | 模块范围 |
| 每日构建 | CI 自动触发 | 冒烟范围 |
| 版本发布前 | 发布流程触发 | 全量回归 |
| 代码合并后 | CI 触发 | 关联范围 |

---

## 复测与 Issue 状态流转

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐ │
│  Open   │───▶│In Prog. │───▶│  Fixed  │───▶│ 复测执行 │ │
└─────────┘    └─────────┘    └─────────┘    └─────────┘ │
                                                    │     │
                                           ┌───────┴─────┐
                                           │             │
                                    通过   ▼      不通过  ▼
                                  ┌─────────┐      ┌─────────┐
                                  │Verified │      │Reopened │
                                  └─────────┘      └─────────┘
                                       │               │
                                       ▼               │
                                  ┌─────────┐          │
                                  │ Closed  │◀─────────┘
                                  └─────────┘  (修复后重新复测)
```

---

## 复测完成清单

| 检查项 | 状态 |
|--------|------|
| 复测执行完成 | ✅/❌ |
| 复测报告已保存 | ✅/❌ |
| Issue 已评论结果 | ✅/❌ |
| Issue 状态已更新 | ✅/❌ |
| 当日索引已更新 | ✅/❌ |
| 用例版本已更新（如有变更） | ✅/❌ |
| 团队已通知 | ✅/❌ |