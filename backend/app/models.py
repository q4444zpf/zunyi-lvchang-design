from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class Metric(BaseModel):
    label: str
    value: float
    unit: str
    trend: Literal["上升", "下降", "稳定"]
    comparison: str


class Node(BaseModel):
    id: str
    name: str
    category: str
    flow: float
    pressure: float
    status: Literal["正常", "预警", "故障"]


class Pool(BaseModel):
    id: str
    name: str
    level: float
    capacity: float
    inflow: float
    outflow: float
    forecast_level: float
    status: Literal["正常", "预警", "危险"]


class Pump(BaseModel):
    id: str
    name: str
    running: bool
    frequency: float
    current: float


class Overview(BaseModel):
    plant_name: str
    data_time: datetime
    communication: Literal["在线", "离线"]
    operator: str
    metrics: list[Metric]
    nodes: list[Node]
    pools: list[Pool]
    pumps: list[Pump]


class TrendPoint(BaseModel):
    time: str
    actual: float
    plan: float


class Alarm(BaseModel):
    id: str
    severity: Literal["危险", "预警", "提示"]
    device: str
    event: str
    occurred_at: datetime
    status: Literal["未确认", "已确认"]


class DispatchRequest(BaseModel):
    plan_id: str
    pump_ids: list[str] = Field(min_length=1)
    target_level: float = Field(gt=0, lt=8)


class DispatchRecord(DispatchRequest):
    record_id: str
    status: Literal["已下发"]
    operator: str
    issued_at: datetime

