from datetime import datetime, timedelta, timezone

from .models import Alarm, DispatchRecord, DispatchRequest, Metric, Node, Overview, Pool, Pump


CN_TZ = timezone(timedelta(hours=8))


class PlantStore:
    def __init__(self) -> None:
        self.communication = "在线"
        self.operator = "张伟"
        self.alarms = [
            Alarm(id="ALM-001", severity="危险", device="2#赤泥集水池", event="液位 6.42 m，接近高高限", occurred_at=datetime(2026, 7, 23, 14, 18, tzinfo=CN_TZ), status="未确认"),
            Alarm(id="ALM-002", severity="预警", device="赤泥洗涤流量计 FT-204", event="流量低于计划值 8.6%", occurred_at=datetime(2026, 7, 23, 14, 9, tzinfo=CN_TZ), status="未确认"),
            Alarm(id="ALM-003", severity="提示", device="循环水泵 P-03", event="累计运行时间达到保养阈值", occurred_at=datetime(2026, 7, 23, 13, 42, tzinfo=CN_TZ), status="已确认"),
        ]
        self.dispatches: list[DispatchRecord] = []

    def overview(self) -> Overview:
        return Overview(
            plant_name="遵义氧化铝厂",
            data_time=datetime.now(CN_TZ),
            communication=self.communication,
            operator=self.operator,
            metrics=[
                Metric(label="总供水量", value=2840, unit="m³/h", trend="上升", comparison="较计划 +2.4%"),
                Metric(label="循环利用率", value=91.6, unit="%", trend="上升", comparison="较昨日 +0.8%"),
                Metric(label="管网压力", value=0.48, unit="MPa", trend="稳定", comparison="波动 ±0.02"),
                Metric(label="日累计用水", value=42860, unit="m³", trend="下降", comparison="同比 -3.1%"),
            ],
            nodes=[
                Node(id="N-01", name="新水池", category="水源", flow=620, pressure=0.42, status="正常"),
                Node(id="N-02", name="循环水站", category="循环水", flow=1320, pressure=0.51, status="正常"),
                Node(id="N-03", name="蒸发", category="生产用水", flow=460, pressure=0.47, status="正常"),
                Node(id="N-04", name="分解", category="生产用水", flow=390, pressure=0.45, status="正常"),
                Node(id="N-05", name="赤泥洗涤", category="生产用水", flow=286, pressure=0.38, status="预警"),
                Node(id="N-06", name="热电站", category="生产用水", flow=510, pressure=0.52, status="正常"),
                Node(id="N-07", name="生活水", category="生活用水", flow=74, pressure=0.36, status="正常"),
            ],
            pools=[
                Pool(id="POOL-01", name="1#集水池", level=4.36, capacity=7, inflow=420, outflow=455, forecast_level=4.08, status="正常"),
                Pool(id="POOL-02", name="2#集水池", level=6.42, capacity=7, inflow=510, outflow=380, forecast_level=6.88, status="危险"),
            ],
            pumps=[
                Pump(id="P-01", name="1#外排泵", running=True, frequency=42, current=68.4),
                Pump(id="P-02", name="2#外排泵", running=True, frequency=38, current=61.2),
                Pump(id="P-03", name="3#备用泵", running=False, frequency=0, current=0),
            ],
        )

    def trends(self) -> dict:
        total = []
        for hour in range(24):
            plan = 2700 + (hour % 6) * 32
            actual = plan + ((hour % 5) - 2) * 27
            total.append({"time": f"{hour:02d}:00", "actual": actual, "plan": plan})
        return {
            "total": total,
            "zones": {
                "蒸发": [round(point["actual"] * 0.28) for point in total],
                "分解": [round(point["actual"] * 0.23) for point in total],
                "赤泥洗涤": [round(point["actual"] * 0.17) for point in total],
                "热电站": [round(point["actual"] * 0.32) for point in total],
            },
        }

    def acknowledge(self, alarm_id: str) -> Alarm | None:
        for alarm in self.alarms:
            if alarm.id == alarm_id:
                alarm.status = "已确认"
                return alarm
        return None

    def dispatch(self, request: DispatchRequest) -> DispatchRecord:
        record = DispatchRecord(
            **request.model_dump(),
            record_id=f"DSP-{len(self.dispatches) + 1:04d}",
            status="已下发",
            operator=self.operator,
            issued_at=datetime.now(CN_TZ),
        )
        self.dispatches.append(record)
        return record

