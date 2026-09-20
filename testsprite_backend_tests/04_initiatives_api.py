import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_initiatives_api() -> None:
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

    # 2. Get list of initiatives (public)
    init_resp = session.get(f"{BASE_URL}/api/initiatives", timeout=10)
    assert init_resp.status_code == 200, f"Get initiatives failed: {init_resp.text}"
    initiatives = init_resp.json()
    assert isinstance(initiatives, list), "Expected list of initiatives"

    # 3. Create a new initiative
    create_payload = {
        "title": "مبادرة تشجير حديقة الحي (اختبار)",
        "description": "حملة تطوعية لغرس الأشجار والزهور في الحديقة العامة",
        "category": "بيئة",
        "city": "دمشق",
        "neighborhood": "الميدان",
        "targetVolunteers": 15,
    }
    create_resp = session.post(
        f"{BASE_URL}/api/initiatives",
        json=create_payload,
        headers=headers,
        timeout=10,
    )
    assert create_resp.status_code in [200, 201], f"Create initiative failed: {create_resp.text}"
    created_init = create_resp.json()
    init_id = created_init["id"]

    # 4. Toggle join the initiative
    join_resp = session.post(
        f"{BASE_URL}/api/initiatives/{init_id}/join",
        headers=headers,
        timeout=10,
    )
    assert join_resp.status_code in [200, 201], f"Join initiative failed: {join_resp.text}"


test_initiatives_api()
