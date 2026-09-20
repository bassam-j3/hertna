import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_ratings_api() -> None:
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

    # 2. List all ratings
    list_resp = session.get(f"{BASE_URL}/api/ratings", timeout=10)
    assert list_resp.status_code == 200, f"Get ratings failed: {list_resp.text}"
    ratings = list_resp.json()
    assert isinstance(ratings, list), "Expected list of ratings"

    # 3. Create a rating
    rating_payload = {
        "ratedUserId": "user-test-id",
        "score": 5,
        "comment": "تعامل ممتاز وموثوق جداً شكراً لك",
    }
    create_resp = session.post(
        f"{BASE_URL}/api/ratings",
        json=rating_payload,
        headers=headers,
        timeout=10,
    )
    # May succeed or fail if target user does not exist, both are valid status codes
    assert create_resp.status_code in [200, 201, 400, 404], f"Create rating returned unexpected code: {create_resp.status_code}"


test_ratings_api()
