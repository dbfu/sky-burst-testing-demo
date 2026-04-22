# 测试报告目录结构

本目录用于存储 Sky Burst 游戏的测试执行报告。

## 目录规范

```
reports/
├── 2026-04-22.md           # 按日期命名的报告文件
├── 2026-04-23.md
├── artifacts/              # 执行证据目录
│   ├── screenshots/
│   ├── videos/
│   └── logs/
│       ├── TC-CTRL-007-position.json
│       └── TC-MECH-008-timing.json
└── README.md               # 本说明文件
```

## 报告文件命名

- 单日多次执行: `2026-04-22_run-001.md`, `2026-04-22_run-002.md`
- 模块专项测试: `2026-04-22_controls-module.md`

## 报告模板

参见 `report_template.md`（已创建在上级目录）

## 证据文件命名

- 截图: `TC-{用例ID}-{描述}.png`
- 视频: `TC-{用例ID}-{描述}.webm`
- 日志: `TC-{用例ID}-{类型}.json`