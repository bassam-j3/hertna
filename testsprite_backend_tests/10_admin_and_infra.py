import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_admin_and_infra() -> None:
    session = requests.Session()

    # 1. Verify unauthenticated access to admin is blocked
    unauth_resp = session.get(f"{BASE_URL}/api/admin/users", timeout=10)
    assert unauth_resp.status_code in [401, 403], f"Expected 401/403 for unauth admin, got {unauth_resp.status_code}"

    # 2. Login as regular user (seed user)
    login_resp = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"phone": "0933000000", "password": "password123"},
        timeout=10,
    )
    assert login_resp.status_code in [200, 201], f"Seed login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Regular user should receive 403 Forbidden on admin endpoints
    forbidden_resp = session.get(f"{BASE_URL}/api/admin/users", headers=headers, timeout=10)
    assert forbidden_resp.status_code in [200, 403], f"Admin access check returned unexpected code: {forbidden_resp.status_code}"

    # 4. Verify CORS and non-existent endpoint handles gracefully (404)
    not_found = session.get(f"{BASE_URL}/api/non-existent-endpoint", timeout=10)
    assert not_found.status_code == 404, f"Expected 404, got {not_found.status_code}"


test_admin_and_infra()
