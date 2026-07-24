# Water Dispatch Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可运行的 Vue 3 + FastAPI 氧化铝厂用水管网监控与赤泥集水池调度原型。

**Architecture:** `frontend/` 为 Vite Vue 3 SPA，通过 `/api` 访问 `backend/` FastAPI。后端以进程内模拟数据提供只读监控与可审计的告警确认、调度下发接口；前端以单页调度台完成监控和操作闭环。

**Tech Stack:** Vue 3、TypeScript、Vite、Pinia、Element Plus、ECharts、Vitest、FastAPI、Pydantic、pytest。

## Global Constraints

- 严格遵循 `.ulpi/design/DESIGN.md` 与 `.ulpi/design/water-network-dispatch.md`。
- 所有可见文案使用中文，设备编号与数值使用等宽字体。
- 生产代码前必须先写失败测试并确认按预期失败。
- 不接入真实 PLC；所有控制均为明确标注的模拟操作。

---

### Task 1: FastAPI monitoring domain

**Files:** Create `backend/app/main.py`, `backend/app/models.py`, `backend/app/store.py`, `backend/tests/test_api.py`, `backend/requirements.txt`.

**Interfaces:** Produces `GET /api/overview`, `GET /api/trends`, `GET /api/alarms`, `POST /api/alarms/{id}/ack`, `POST /api/dispatch`.

- [ ] 写 API 测试，覆盖响应字段、告警确认、离线时拒绝调度和合法调度记录。
- [ ] 运行 `pytest backend/tests -q`，确认因模块缺失失败。
- [ ] 实现 Pydantic 模型、模拟数据仓库和路由，返回稳定的中文工艺数据。
- [ ] 再次运行测试，预期全部通过。

### Task 2: Vue application shell and data layer

**Files:** Create `frontend/package.json`, `frontend/src/main.ts`, `frontend/src/App.vue`, `frontend/src/api.ts`, `frontend/src/types.ts`, `frontend/src/stores/plant.ts`, `frontend/src/styles.css`, `frontend/src/__tests__/app.test.ts`.

**Interfaces:** Consumes Task 1 APIs. Produces `usePlantStore()` with `loadDashboard`, `acknowledgeAlarm`, and `submitDispatch`.

- [ ] 写组件测试，断言厂区标题、加载态、关键指标和导航可见。
- [ ] 运行 `npm test -- --run`，确认应用尚未实现而失败。
- [ ] 配置 Vite/Vitest，建立 Pinia 数据层和调度台外壳。
- [ ] 再次运行测试，预期通过。

### Task 3: Monitoring and dispatch components

**Files:** Create `frontend/src/components/PlantHeader.vue`, `MetricStrip.vue`, `WaterNetworkMap.vue`, `TrendPanel.vue`, `RedMudPoolPanel.vue`, `PumpDispatch.vue`, `AlarmList.vue`, `ConfirmDialog.vue`; modify `frontend/src/App.vue`.

**Interfaces:** Components receive typed props from `types.ts` and emit `select-node`, `acknowledge`, `dispatch`, and `close`.

- [ ] 扩展测试，覆盖节点选择、告警确认、调度确认、离线禁用和错误恢复。
- [ ] 运行测试并确认新增断言按预期失败。
- [ ] 实现所有组件、设计令牌、键盘路径、ARIA、响应式与减少动效规则。
- [ ] 运行前端测试，预期全部通过。

### Task 4: Integration and operator handoff

**Files:** Create root `README.md`, `.gitignore`; modify `AGENTS.md`.

**Interfaces:** Documents two-terminal startup and safety boundary.

- [ ] 运行 `pytest backend/tests -q` 与 `npm test -- --run`。
- [ ] 运行 `npm run build` 并确认生成 `frontend/dist/`。
- [ ] 启动后端和前端，确认 `/api/overview` 可访问且 SPA 无构建错误。
- [ ] 在 README 记录安装、启动、测试、模拟数据声明和目录结构。
