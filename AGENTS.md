# 仓库指南

## 项目结构与模块组织

本仓库包含 Vue 3 前端和 FastAPI 模拟后端：

- `frontend/src/`：Vue 页面、组件、Pinia 数据层和全局样式。
- `frontend/src/__tests__/`：Vitest 组件测试。
- `backend/app/`：FastAPI 路由、Pydantic 模型和内存数据仓库。
- `backend/tests/`：pytest API 测试。
- `docs/`：架构说明、设计决策和协作文档。
- `.ulpi/design/`：锁定的视觉语言和交互规范。

不要将生成文件与源文件混放。生成结果应放入 `dist/`、`build/` 或其他已记录并加入忽略规则的目录。

## 构建、测试与开发命令

```text
pytest backend/tests -q       # 运行后端接口测试
cd frontend && npm run dev    # 启动 Vue 开发服务器
cd frontend && npm test -- --run  # 运行前端组件测试
cd frontend && npm run build  # 类型检查并生成发布产物
```

文档中列出的命令必须能够在仓库根目录直接执行。

## 编码风格与命名规范

统一使用 UTF-8、LF 和空格缩进。TypeScript/Vue 使用 2 空格、`camelCase` 变量和 `PascalCase.vue` 组件；Python 使用 4 空格、`snake_case`，遵循 PEP 8。目录和文档使用 `kebab-case`。界面必须复用 `.ulpi/design/DESIGN.md` 的锁定令牌和 Element Plus，不得另建视觉体系。

## 测试指南

每项行为变更和缺陷修复都必须先写失败测试，再实现。前端使用 Vitest 与 Vue Test Utils，后端使用 pytest 与 FastAPI TestClient。测试文件使用 `*.test.ts` 或 `test_*.py`，必须可重复且不得依赖真实厂区系统。

## 提交与合并请求规范

当前没有 Git 历史可供归纳既有规范。提交标题应简短并使用祈使语气，可采用 Conventional Commits，例如 `feat: add process diagram` 或 `fix: correct sensor label`。

合并请求应说明目的、概述主要变更、列出验证方式，并关联相关问题。视觉变更需附修改前后截图；新增依赖、配置调整或生成文件必须明确说明。

## 安全与配置

禁止提交凭据、非公开的工厂数据或仅适用于个人计算机的路径。本地设置应保存在已忽略的环境文件中；引入配置项时，同时提供经过脱敏的 `.env.example`。
