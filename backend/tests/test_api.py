from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_overview_contains_monitoring_domain():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["plant_name"] == "遵义氧化铝厂"
    assert data["communication"] == "在线"
    assert len(data["metrics"]) == 4
    assert {node["name"] for node in data["nodes"]} >= {"新水池", "赤泥洗涤", "热电站"}
    assert len(data["pools"]) == 2
    assert len(data["pumps"]) == 3


def test_trends_return_actual_plan_and_zones():
    response = client.get("/api/trends")
    assert response.status_code == 200
    data = response.json()
    assert len(data["total"]) == 24
    assert all({"time", "actual", "plan"} <= point.keys() for point in data["total"])
    assert "蒸发" in data["zones"]


def test_alarm_can_be_acknowledged():
    alarms = client.get("/api/alarms").json()
    alarm = next(item for item in alarms if item["status"] == "未确认")
    response = client.post(f"/api/alarms/{alarm['id']}/ack")
    assert response.status_code == 200
    assert response.json()["status"] == "已确认"


def test_dispatch_is_rejected_while_offline():
    client.app.state.store.communication = "离线"
    response = client.post(
        "/api/dispatch",
        json={"plan_id": "PLAN-A", "pump_ids": ["P-01"], "target_level": 4.2},
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "通信中断，禁止下发调度方案"
    client.app.state.store.communication = "在线"


def test_valid_dispatch_creates_auditable_record():
    response = client.post(
        "/api/dispatch",
        json={"plan_id": "PLAN-A", "pump_ids": ["P-01", "P-02"], "target_level": 4.2},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "已下发"
    assert data["operator"] == "张伟"
    assert data["pump_ids"] == ["P-01", "P-02"]
    assert data["record_id"].startswith("DSP-")
