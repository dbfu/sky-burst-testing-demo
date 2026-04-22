name: Test Failure
about: 测试用例执行失败报告
title: '[TEST-FAIL] {{ test_case_id }} - {{ failure_reason }}'
labels: test-failure, needs-investigation
assignees: ''

---

## 测试失败报告

### 用例信息

| 项目 | 内容 |
|------|------|
| 用例编号 | {{ test_case_id }} |
| 用例标题 | {{ test_case_title }} |
| 用例版本 | {{ test_case_version }} |
| 所属模块 | {{ module }} |
| 优先级 | {{ priority }} |

### 执行信息

| 项目 | 内容 |
|------|------|
| 执行日期 | {{ execution_date }} |
| 执行环境 | {{ environment }} |
| 执行方式 | 手工 / 自动化 |

### 失败详情

**失败类型**: assertion_failed / precondition_failed / timeout / unexpected_behavior

**失败断言**:
```
{{ failed_assertion }}
```

**预期值**: {{ expected_value }}
**实际值**: {{ actual_value }}

### 错误信息

```
{{ error_message }}
```

### 复现步骤

参照测试用例执行步骤:
1. 
2. 
3. 

### 证据链接

- 测试报告: [{{ report_file }}](reports/{{ date }}/{{ test_case_id }}.md)
- 截图: 
- 视频: 
- 日志: 

### 初步分析

<!-- 测试人员对失败原因的初步判断 -->

- [ ] 是代码缺陷，需修复
- [ ] 是用例设计问题，需更新用例
- [ ] 是环境问题，需重新执行
- [ ] 需进一步调查

### 建议处理方式

<!-- 给开发团队的建议 -->