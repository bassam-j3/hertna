import os
import time
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_auth_lifecycle() -> None:
    session = requests.Session()
    unique_phone = f"09{int(time.time()) % 100000000:08d}"

    # 1. Register a new user
    reg_payload = {
        "phone": unique_phone,
        "name": "مستخدم تجريبي",
        "password": "password123",
        "city": "دمشق",
        "neighborhood": "الميدان",
    }
    reg_resp = session.post(f"{BASE_URL}/api/auth/register", json=reg_payload, timeout=10)
    assert reg_resp.status_code in [200, 201], f"Registration failed: {reg_resp.status_code} {reg_resp.text}"
    reg_data = reg_resp.json()
    assert "access_token" in reg_data or "id" in reg_data, "Expected token or user id in registration response"

    # 2. Login with valid credentials
    login_payload = {
        "phone": unique_phone,
        "password": "password123",
    }
    login_resp = session.post(f"{BASE_URL}/api/auth/login", json=login_payload, timeout=10)
    assert login_resp.status_code in [200, 201], f"Login failed: {login_resp.status_code} {login_resp.text}"
    login_data = login_resp.json()
    assert "access_token" in login_data, "Login response missing access_token"
    token = login_data["access_token"]

    # 3. Fetch authenticated profile /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = session.get(f"{BASE_URL}/api/auth/me", headers=headers, timeout=10)
    assert me_resp.status_code == 200, f"Get /api/auth/me failed: {me_resp.status_code} {me_resp.text}"
    me_data = me_resp.json()
    assert me_data.get("phone") == unique_phone, f"Expected phone {unique_phone}, got {me_data.get('phone')}"

    # 4. Login with invalid password rejects
    bad_login = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"phone": unique_phone, "password": "wrong_password"},
        timeout=10,
    )
    assert bad_login.status_code in [400, 401], f"Expected 401 for bad login, got {bad_login.status_code}"


test_auth_lifecycle()
