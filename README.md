# 遵义氧化铝厂水网与赤泥集水池调度原型

本项目是用于方案评审的可运行原型：Vue 3 调度台展示全厂用水管网、24 小时趋势、告警和赤泥集水池预测；FastAPI 提供稳定的中文模拟数据及可审计的告警确认、调度下发接口。

> 安全边界：系统不连接真实 PLC、DCS 或生产数据库，所有数据及控制操作均为模拟。禁止将本原型直接用于生产控制。

## 安装

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
cd frontend
npm install
```

## 本地启动

打开两个终端，在仓库根目录分别运行：

```powershell
# 终端 1：API
python -m uvicorn backend.app.main:app --reload

# 终端 2：页面
cd frontend
npm run dev
```

访问 `http://localhost:5173`。Vite 将 `/api` 请求代理到 `http://127.0.0.1:8000`，接口文档位于 `http://127.0.0.1:8000/docs`。

## 测试与构建

```powershell
pytest backend/tests -q
cd frontend
npm test -- --run
npm run build
```

前端发布产物生成到 `frontend/dist/`。

## 目录

- `backend/app/`：Pydantic 领域模型、内存数据仓库与 FastAPI 路由。
- `backend/tests/`：API 行为测试。
- `frontend/src/components/`：监控与调度组件。
- `frontend/src/stores/`：Pinia 数据和操作状态。
- `.ulpi/design/`：锁定的设计语言与页面规范。
- `docs/superpowers/plans/`：实施计划。
