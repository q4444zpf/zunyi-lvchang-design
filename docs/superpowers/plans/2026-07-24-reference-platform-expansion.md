# Reference Platform Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将产品文档中的 21 张参考界面转化为可交互的 Vue 科技工业风平台，并补齐分析、调度、事件与报表的主要入口。

**Architecture:** 保留现有 Pinia 数据加载和总览组件，以 `App.vue` 的当前任务状态切换五个顶层工作区。新增三个聚合工作区组件分别承载分析、调度和事件闭环，页内标签只管理本任务视图，避免继续增加主菜单。

**Tech Stack:** Vue 3、TypeScript、Pinia、Element Plus、ECharts、Vitest、Vue Test Utils。

## Global Constraints

- 视觉只使用 `.ulpi/design/DESIGN.md` 的锁定令牌和 Element Plus。
- 顶部主导航保持五项，不恢复左侧主菜单。
- 每项行为变更必须先写失败测试，再做最小实现。
- 每个可独立验证的任务完成后运行测试并提交 Git。

---

### Task 1: 可切换的顶部任务导航

**Files:**
- Modify: `frontend/src/components/TopNavigation.vue`
- Modify: `frontend/src/App.vue`
- Test: `frontend/src/__tests__/app.test.ts`

**Interfaces:**
- Produces: `TopNavigation` emits `navigate` with union value `overview | network | analysis | dispatch | events`.
- Consumes: `App.vue` passes `active-task` and conditionally renders the selected workspace.

- [ ] **Step 1: Write the failing test**

```ts
it("点击运行分析后切换到分析中心并保持当前导航状态", async () => {
  const wrapper = mount(App);
  await wrapper.get('[data-task="analysis"]').trigger("click");
  expect(wrapper.get('[data-testid="analysis-center"]').exists()).toBe(true);
  expect(wrapper.get('[data-task="analysis"]').attributes("aria-current")).toBe("page");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: FAIL because `data-task="analysis"` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export type PlatformTask = "overview" | "network" | "analysis" | "dispatch" | "events";
const props = defineProps<{ activeTask: PlatformTask }>();
const emit = defineEmits<{ navigate: [task: PlatformTask] }>();
```

Render navigation items as buttons and emit the selected task. Store the value in `App.vue` with `ref<PlatformTask>("overview")`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/App.vue frontend/src/components/TopNavigation.vue frontend/src/__tests__/app.test.ts
git commit -m "feat: add task-based platform navigation"
```

### Task 2: 运行分析中心

**Files:**
- Create: `frontend/src/components/AnalysisCenter.vue`
- Modify: `frontend/src/App.vue`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/__tests__/app.test.ts`

**Interfaces:**
- Produces: `AnalysisCenter` with tabs `water | pressure | leakage | dma`.
- Consumes: no remote data; uses deterministic, factory-specific demonstration data until APIs are connected.

- [ ] **Step 1: Write the failing test**

```ts
it("运行分析提供用水压力漏损和DMA四个任务视图", async () => {
  const wrapper = mount(App);
  await wrapper.get('[data-task="analysis"]').trigger("click");
  expect(wrapper.get('[role="tablist"]').text()).toContain("用水分析");
  await wrapper.get('[data-analysis-tab="dma"]').trigger("click");
  expect(wrapper.text()).toContain("DMA-03 赤泥洗涤区");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: FAIL because `AnalysisCenter` is missing.

- [ ] **Step 3: Write minimal implementation**

Create a semantic task panel with four tabs, one KPI rail, SVG trend/pressure/leak path, ranked diagnostic table, and a text conclusion. Use only CSS variables already defined in `styles.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/AnalysisCenter.vue frontend/src/App.vue frontend/src/styles.css frontend/src/__tests__/app.test.ts
git commit -m "feat: add water network analysis center"
```

### Task 3: 智能调度中心

**Files:**
- Create: `frontend/src/components/DispatchCenter.vue`
- Modify: `frontend/src/App.vue`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/__tests__/app.test.ts`

**Interfaces:**
- Produces: `DispatchCenter` emits `dispatch` with existing `DispatchRequest`.
- Consumes: existing pools, pumps, offline and busy state from the plant store.

- [ ] **Step 1: Write the failing test**

```ts
it("智能调度提供方案任务和执行监控", async () => {
  const wrapper = mount(App);
  await wrapper.get('[data-task="dispatch"]').trigger("click");
  expect(wrapper.text()).toContain("稳妥平衡方案");
  expect(wrapper.get('[data-testid="dispatch-tabs"]').text()).toContain("执行监控");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: FAIL because `DispatchCenter` is missing.

- [ ] **Step 3: Write minimal implementation**

Create three comparable方案 rows, a task timeline, and an execution panel that reuses pool and pump data. Applying a方案 emits `{ plan_id, pump_ids, target_level }`; the parent opens the existing confirmation dialog.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/DispatchCenter.vue frontend/src/App.vue frontend/src/styles.css frontend/src/__tests__/app.test.ts
git commit -m "feat: add intelligent dispatch workspace"
```

### Task 4: 告警事件闭环与报表

**Files:**
- Create: `frontend/src/components/EventCenter.vue`
- Modify: `frontend/src/App.vue`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/__tests__/app.test.ts`

**Interfaces:**
- Produces: `EventCenter` emits `acknowledge` with alarm id and provides tabs `alarms | events | work-orders | reports`.
- Consumes: existing `Alarm[]`.

- [ ] **Step 1: Write the failing test**

```ts
it("告警事件提供事件工单和报表闭环", async () => {
  const wrapper = mount(App);
  await wrapper.get('[data-task="events"]').trigger("click");
  await wrapper.get('[data-event-tab="work-orders"]').trigger("click");
  expect(wrapper.text()).toContain("WO-20260724-018");
  await wrapper.get('[data-event-tab="reports"]').trigger("click");
  expect(wrapper.text()).toContain("水量平衡日报");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: FAIL because `EventCenter` is missing.

- [ ] **Step 3: Write minimal implementation**

Create an event stage rail, work-order table and report table. Keep alarm acknowledgement delegated to the existing store, and expose empty/error copy in the component structure.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- --run src/__tests__/app.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/EventCenter.vue frontend/src/App.vue frontend/src/styles.css frontend/src/__tests__/app.test.ts
git commit -m "feat: add event and reporting center"
```

### Task 5: 完整验证与视觉评审

**Files:**
- Modify if required: `frontend/src/styles.css`
- Test: `frontend/src/__tests__/app.test.ts`

**Interfaces:**
- Consumes: all prior workspaces.
- Produces: verified production build and review screenshots at 1920×1080 and 768px.

- [ ] **Step 1: Run all frontend tests**

Run: `cd frontend && npm test -- --run`
Expected: all tests pass with no unhandled errors.

- [ ] **Step 2: Build production assets**

Run: `cd frontend && npm run build`
Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 3: Inspect in browser**

Run the Vite development server and review each top-level task at desktop and mobile widths. Verify no menu wrapping, page overflow, clipped labels, missing focus states or illegible charts.

- [ ] **Step 4: Apply only evidence-based visual corrections**

Adjust layout tokens or component CSS for defects observed in screenshots; do not introduce new colors, fonts, radii or navigation entries.

- [ ] **Step 5: Re-run verification and commit**

```bash
git add frontend/src/styles.css frontend/src/__tests__/app.test.ts
git commit -m "fix: polish responsive platform layouts"
```
