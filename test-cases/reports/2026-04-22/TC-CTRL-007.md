# TC-CTRL-007 测试执行报告

## 用例信息

| 项目 | 内容 |
|------|------|
| 用例编号 | TC-CTRL-007 |
| 用例标题 | 移动边界限制 |
| 所属模块 | 键盘控制 |
| 优先级 | P0 |
| 标签 | boundary, movement, regression |

## 执行信息

| 项目 | 内容 |
|------|------|
| 执行日期 | 2026-04-22 |
| 执行时间 | 14:31:00 |
| 执行人 | Claude |
| 执行方式 | 手工验证 |
| 执行时长 | 8.3s |
| 重试次数 | 3 |

---

## 执行结果

**状态**: ❌ 失败

---

## 前置条件

- 游戏运行中

---

## 执行步骤

| 序号 | 操作 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| 1 | 长按 ArrowLeft 直到贴边 | 玩家停止在左边界 x=28 | 玩家 x 降至 25 | ❌ |
| 2 | 长按 ArrowRight 直到贴边 | 玩家停止在右边界 | 未执行 | ⏭️ |
| 3 | 长按 ArrowUp 直到贴边 | 玩家停止在上边界 | 未执行 | ⏭️ |
| 4 | 长按 ArrowDown 直到贴边 | 玩家停止在下边界 | 未执行 | ⏭️ |

---

## 断言验证

| 断言 | 预期值 | 实际值 | 状态 |
|------|--------|--------|------|
| player.x >= 28 | true | **false (x=25)** | ❌ |
| player.x <= canvas.width-28 | true | 未验证 | ⏭️ |
| player.y >= 36 | true | 未验证 | ⏭️ |
| player.y <= canvas.height-36 | true | 未验证 | ⏭️ |

---

## 错误详情

### 错误类型

`boundary_violation` — 边界限制失效

### 错误描述

长按左方向键后，玩家 x 坐标超出左边界。

```
预期最小值: x >= 28
实际观测值: x = 25
偏差: -3 (超出边界)
```

### 复现步骤

1. 打开 index.html，点击"开始游戏"
2. 长按 ArrowLeft 或 A 键 3 秒以上
3. 观察玩家位置持续左移并超出边界

### 问题定位

疑似问题在 `game.js:203` 的 clamp 边界计算逻辑：

```javascript
player.x = clamp(player.x + moveX * player.speed * delta, 28, canvas.width - 28);
```

边界值 28 可能与玩家实际碰撞区域不匹配。

---

## 关联缺陷

| 项目 | 内容 |
|------|------|
| 缺陷编号 | BUG-002 |
| 缺陷标题 | 玩家移动边界限制失效 |
| 严重等级 | 🔴 Critical |
| 状态 | Open |

---

## 证据

| 类型 | 文件路径 |
|------|---------|
| 截图 | [artifacts/screenshots/TC-CTRL-007-fail.png](artifacts/screenshots/TC-CTRL-007-fail.png) |
| 视频 | [artifacts/videos/TC-CTRL-007-fail.webm](artifacts/videos/TC-CTRL-007-fail.webm) |
| 位置日志 | [artifacts/logs/TC-CTRL-007-position.json](artifacts/logs/TC-CTRL-007-position.json) |

---

## 备注

该问题为严重缺陷，阻塞了后续部分测试用例的执行。建议优先修复边界计算逻辑，修复后重新执行 controls 模块测试。

---

*报告生成时间: 2026-04-22 14:31:08*