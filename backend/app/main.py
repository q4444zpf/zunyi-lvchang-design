from fastapi import FastAPI, HTTPException, status

from .models import Alarm, DispatchRecord, DispatchRequest, Overview
from .store import PlantStore


app = FastAPI(title="遵义氧化铝厂水网与赤泥集水池调度模拟 API", version="0.1.0")
app.state.store = PlantStore()


@app.get("/api/overview", response_model=Overview)
def get_overview() -> Overview:
    return app.state.store.overview()


@app.get("/api/trends")
def get_trends() -> dict:
    return app.state.store.trends()


@app.get("/api/alarms", response_model=list[Alarm])
def get_alarms() -> list[Alarm]:
    severity_order = {"危险": 0, "预警": 1, "提示": 2}
    return sorted(app.state.store.alarms, key=lambda item: (severity_order[item.severity], -item.occurred_at.timestamp()))


@app.post("/api/alarms/{alarm_id}/ack", response_model=Alarm)
def acknowledge_alarm(alarm_id: str) -> Alarm:
    alarm = app.state.store.acknowledge(alarm_id)
    if alarm is None:
        raise HTTPException(status_code=404, detail="告警不存在")
    return alarm


@app.post("/api/dispatch", response_model=DispatchRecord, status_code=status.HTTP_201_CREATED)
def create_dispatch(request: DispatchRequest) -> DispatchRecord:
    if app.state.store.communication != "在线":
        raise HTTPException(status_code=409, detail="通信中断，禁止下发调度方案")
    overview = app.state.store.overview()
    if any(pool.status == "危险" for pool in overview.pools) and not request.pump_ids:
        raise HTTPException(status_code=422, detail="危险液位时禁止停止全部泵组")
    valid_pumps = {pump.id for pump in overview.pumps}
    if not set(request.pump_ids) <= valid_pumps:
        raise HTTPException(status_code=422, detail="调度方案包含未知泵组")
    return app.state.store.dispatch(request)
