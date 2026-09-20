import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_swaps_lifecycle() -> None:
    session = requests.Session()

    # 1. Login with seed credentials
    login_resp = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"phone": "0933000000", "password": "password123"},
        timeout=10,
    )
    assert login_resp.status_code in [200, 201], f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get user swaps
    swaps_resp = session.get(f"{BASE_URL}/api/swaps/my-swaps", headers=headers, timeout=10)
    assert swaps_resp.status_code == 200, f"Get my-swaps failed: {swaps_resp.text}"
    swaps = swaps_resp.json()
    assert isinstance(swaps, list), "Expected list of swaps"

    # 3. Create a temporary post to request swap for
    post_resp = session.post(
        f"{BASE_URL}/api/posts",
        json={
            "title": "كتاب للقراءة والمبادلة",
            "description": "كتاب في الأدب متاح للإعارة",
            "category": "تعليم",
            "type": "OFFER",
            "urgency": "LOW",
            "city": "دمشق",
            "neighborhood": "الميدان",
        },
        headers=headers,
        timeout=10,
    )
    assert post_resp.status_code in [200, 201], f"Post creation failed: {post_resp.text}"
    post_id = post_resp.json()["id"]

    try:
        # 4. Request swap on post
        swap_req = session.post(
            f"{BASE_URL}/api/swaps",
            json={"postId": post_id},
            headers=headers,
            timeout=10,
        )
        assert swap_req.status_code in [200, 201, 400], f"Swap request returned unexpected: {swap_req.status_code}"
    finally:
        # Cleanup post
        session.delete(f"{BASE_URL}/api/posts/{post_id}", headers=headers, timeout=10)


test_swaps_lifecycle()
