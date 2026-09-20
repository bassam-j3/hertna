import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_tickets_api() -> None:
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

    # 2. Submit support ticket
    ticket_payload = {
        "type": "TECHNICAL",
        "message": "استفسار بخصوص طريقة تحديث الموقع الجغرافي للمنطقة",
    }
    ticket_resp = session.post(f"{BASE_URL}/api/tickets", json=ticket_payload, headers=headers, timeout=10)
    assert ticket_resp.status_code in [200, 201], f"Create ticket failed: {ticket_resp.status_code} {ticket_resp.text}"


test_tickets_api()
