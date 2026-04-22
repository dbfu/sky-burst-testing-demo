# 测试失败 Issue 内容示例

以下是基于 TC-CTRL-007 失败创建的 GitHub Issue 内容：

---

## Issue Title
```
[TEST-FAIL] TC-CTRL-007 - 玩家移动边界限制失效
```

## Issue Body

### 用例信息

| 项目 | 内容 |
|------|------|
| 用例编号 | TC-CTRL-007 |
| 用例标题 | 移动边界限制 |
| 用例版本 | v1.1 |
| 所属模块 | 键盘控制 |
| 优先级 | P0 |

### 执行信息

| 项目 | 内容 |
|------|------|
| 执行日期 | 2026-04-22 |
| 执行环境 | macOS 14.4 / Chromium 124.0 |
| 执行方式 | 手工验证 |

### 失败详情

**失败类型**: assertion_failed

**失败断言**:
```
player.x >= 28
```

**预期值**: x >= 28 (左边界)
**实际值**: x = 25 (超出边界 3px)

### 错误描述

长按左方向键后，玩家 x 坐标可降至 25，超出预期的最小边界 28。问题定位在 `game.js:203` 的 clamp 边界计算逻辑。

### 复现步骤

1. 打开 `index.html`，点击"开始游戏"
2. 长按 `ArrowLeft` 或 `A` 键 3 秒以上
3. 观察玩家位置持续左移并超出边界
4. 实际坐标: x = 25，预期最小值: x = 28

### 证据链接

- 测试报告: [TC-CTRL-007.md](test-cases/reports/2026-04-22/TC-CTRL-007.md)
- 截图: [TC-CTRL-007-fail.png](artifacts/screenshots/TC-CTRL-007-fail.png)
- 视频: [TC-CTRL-007-fail.webm](artifacts/videos/TC-CTRL-007-fail.webm)
- 位置日志: [TC-CTRL-007-position.json](artifacts/logs/TC-CTRL-007-position.json)

### 代码定位

疑似问题在 `game.js:203`:
```javascript
player.x = clamp(player.x + moveX * player.speed * delta, 28, canvas.width - 28);
```

边界值 `28` 可能与玩家实际碰撞区域（宽度 34px）不匹配。

### 初步分析

- [x] 是代码缺陷，需修复
- [ ] 是用例设计问题，需更新用例
- [ ] 是环境问题，需重新执行

### 建议修复方案

1. 检查玩家碰撞区域宽度（34px），确认边界计算逻辑
2. 可能需要将边界值调整为 `player.width / 2 = 17` 或其他正确值
3. 修复后更新用例断言值

---

## Labels
- `test-failure`
- `bug`
- `priority: P0`
- `module: controls`

## Assignees
- 开发负责人（待分配）

---

## 使用 gh CLI 创建此 Issue

```bash
# 1. 首先添加 GitHub remote（如果仓库尚未关联）
gh repo create sky-burst --public --source=. --push
# 或关联已有仓库
git remote add origin https://github.com/your-org/sky-burst.git

# 2. 使用 gh CLI 创建 Issue
gh issue create \
  --title "[TEST-FAIL] TC-CTRL-007 - 玩家移动边界限制失效" \
  --body-file test-cases/reports/2026-04-22/TC-CTRL-007-issue.md \
  --label "test-failure,bug,P0" \
  --assignee @me

# 3. 查看创建的 Issue
gh issue view
```

---

## 自动化脚本示例

可编写脚本自动从测试报告生成 Issue：

```bash
#!/bin/bash
# create-issue-from-report.sh

REPORT_FILE=$1
CASE_ID=$(basename "$REPORT_FILE" .md)

# 从报告提取关键信息
TITLE=$(grep -A1 "用例标题" "$REPORT_FILE" | tail -1 | cut -d'|' -f2)
STATUS=$(grep "状态" "$REPORT_FILE" | head -1 | cut -d'|' -f2)

if [[ "$STATUS" == "❌ 失败" ]]; then
  gh issue create \
    --title "[TEST-FAIL] $CASE_ID - $TITLE" \
    --body-file "$REPORT_FILE" \
    --label "test-failure"
fi
```

使用:
```bash
./create-issue-from-report.sh test-cases/reports/2026-04-22/TC-CTRL-007.md
```