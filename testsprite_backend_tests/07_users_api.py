import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_users_api() -> None:
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

    # 2. Update user profile via PATCH /api/users/me
    update_payload = {
        "bio": "مهتم بالتكافل الاجتماعي ومساعدة الجيران",
        "job": "متطوع مجتمعي",
    }
    update_resp = session.patch(f"{BASE_URL}/api/users/me", json=update_payload, headers=headers, timeout=10)
    assert update_resp.status_code in [200, 204], f"Update profile failed: {update_resp.status_code} {update_resp.text}"

    # 3. Verify updated profile via GET /api/auth/me
    me_resp = session.get(f"{BASE_URL}/api/auth/me", headers=headers, timeout=10)
    assert me_resp.status_code == 200, f"Get me failed: {me_resp.text}"
    me_data = me_resp.json()
    assert me_data.get("bio") == "مهتم بالتكافل الاجتماعي ومساعدة الجيران"


test_users_api()
