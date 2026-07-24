# Top Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将水网平台的侧栏菜单重构为 5 项顶部任务导航，并形成与产品文档一致的详细功能和界面规范。

**Architecture:** 保持现有 Vue 3 单页原型和锚点导航，不引入 Vue Router。新建单一职责的 `TopNavigation.vue`，由 `App.vue` 组合品牌、菜单和班次上下文；完整产品的信息架构写入独立文档。

**Tech Stack:** Vue 3、TypeScript、Vitest、Element Plus、CSS。

## Global Constraints

- 严格复用 `.ulpi/design/DESIGN.md` 的颜色、字体、间距和动效。
- 顶部主导航最多 5 项，控制行为继续执行权限、二次确认和审计边界。
- 每项行为变更先写失败测试，再写生产代码。

---

### Task 1: Navigation behavior

**Files:**
- Create: `frontend/src/components/TopNavigation.vue`
- Modify: `frontend/src/App.vue`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/__tests__/app.test.ts`

**Interfaces:**
- Produces: `TopNavigation` with five anchor links and local active state.
- Consumes: existing `#overview`, `#network`, `#pools`, `#alarms` anchors and new `#analysis` anchor.

- [x] 写失败测试，断言顶部导航的标签、顺序、锚点、默认当前页和侧栏移除。
- [x] 运行 `npm test -- --run`，确认因顶部导航缺失失败。
- [x] 实现 `TopNavigation.vue` 并在 `App.vue` 组合。
- [x] 增加桌面、平板和移动端顶部导航样式。
- [x] 运行测试和构建，确认无回归。

### Task 2: Product and interface specification

**Files:**
- Create: `.ulpi/design/platform-top-navigation.md`
- Create: `docs/product-functional-design.md`

**Interfaces:**
- Produces: 5 个高频顶部任务域与完整业务模块的映射。
- Consumes: 产品文档 V1.0 与 `.ulpi/design/DESIGN.md`。

- [x] 梳理角色、业务闭环、模块、规则、状态和分期。
- [x] 明确顶部、页头、页内导航三层职责。
- [x] 记录组件状态、响应式、键盘和 ARIA 规则。
- [x] 执行 Design Pre-Flight 并记录合理性评审。
