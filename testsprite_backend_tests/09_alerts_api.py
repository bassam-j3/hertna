import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_alerts_api() -> None:
    session = requests.Session()

    # 1. Login
    login_resp = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"phone": "0933000000", "password": "password123"},
        timeout=10,
    )
    assert login_resp.status_code in [200, 201], f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. List user alerts
    alerts_resp = session.get(f"{BASE_URL}/api/alerts", headers=headers, timeout=10)
    assert alerts_resp.status_code == 200, f"Get alerts failed: {alerts_resp.text}"
    alerts = alerts_resp.json()
    assert isinstance(alerts, list), "Expected list of alerts"

    # 3. Create keyword alert subscription
    create_resp = session.post(
        f"{BASE_URL}/api/alerts",
        json={"keyword": "دواء", "category": "صحة"},
        headers=headers,
        timeout=10,
    )
    assert create_resp.status_code in [200, 201], f"Create alert failed: {create_resp.text}"
    created_alert = create_resp.json()
    alert_id = created_alert.get("id")

    # 4. Remove alert if ID exists
    if alert_id:
        del_resp = session.delete(f"{BASE_URL}/api/alerts/{alert_id}", headers=headers, timeout=10)
        assert del_resp.status_code in [200, 204], f"Delete alert failed: {del_resp.status_code}"


test_alerts_api()
