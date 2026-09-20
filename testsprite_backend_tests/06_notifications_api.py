import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_notifications_api() -> None:
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

    # 2. Get notifications
    notifs_resp = session.get(f"{BASE_URL}/api/notifications", headers=headers, timeout=10)
    assert notifs_resp.status_code == 200, f"Get notifications failed: {notifs_resp.text}"
    notifs = notifs_resp.json()
    assert isinstance(notifs, list), "Expected list of notifications"

    # 3. Create a notification
    create_resp = session.post(
        f"{BASE_URL}/api/notifications",
        json={
            "title": "إشعار اختبار",
            "message": "تم إرسال إشعار تجريبي لاختبار واجهة برمجة التطبيقات",
            "type": "INFO",
        },
        headers=headers,
        timeout=10,
    )
    assert create_resp.status_code in [200, 201], f"Create notification failed: {create_resp.text}"

    # 4. Mark all as read
    mark_all = session.patch(f"{BASE_URL}/api/notifications/read-all", headers=headers, timeout=10)
    assert mark_all.status_code in [200, 204], f"Mark all read failed: {mark_all.status_code}"


test_notifications_api()
