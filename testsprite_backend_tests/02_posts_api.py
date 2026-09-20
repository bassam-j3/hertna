import os
import requests

BASE_URL = os.getenv("TARGET_URL", "http://localhost:3000")


def test_posts_api() -> None:
    session = requests.Session()

    # 1. Login with seed credentials
    login_resp = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"phone": "0933000000", "password": "password123"},
        timeout=10,
    )
    assert login_resp.status_code in [200, 201], f"Seed login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get list of posts
    list_resp = session.get(f"{BASE_URL}/api/posts", timeout=10)
    assert list_resp.status_code == 200, f"Get posts failed: {list_resp.text}"
    posts = list_resp.json()
    assert isinstance(posts, list), "Expected list of posts"

    # 3. Create a new post
    post_payload = {
        "title": "إعارة مثقاب كهربائي (اختبار)",
        "description": "مثقاب كهربائي بحالة ممتازة متاح للإعارة لأهالي الحي",
        "category": "أدوات",
        "type": "OFFER",
        "urgency": "LOW",
        "city": "دمشق",
        "neighborhood": "الميدان",
        "latitude": 33.5138,
        "longitude": 36.2765,
    }
    create_resp = session.post(f"{BASE_URL}/api/posts", json=post_payload, headers=headers, timeout=10)
    assert create_resp.status_code in [200, 201], f"Create post failed: {create_resp.text}"
    created_post = create_resp.json()
    post_id = created_post["id"]

    # 4. Filter posts by category
    filter_resp = session.get(f"{BASE_URL}/api/posts?category=أدوات", timeout=10)
    assert filter_resp.status_code == 200, f"Filter posts failed: {filter_resp.text}"

    # 5. Get post by ID
    get_resp = session.get(f"{BASE_URL}/api/posts/{post_id}", timeout=10)
    assert get_resp.status_code == 200, f"Get post by ID failed: {get_resp.text}"
    assert get_resp.json()["id"] == post_id

    # 6. Delete the created post
    del_resp = session.delete(f"{BASE_URL}/api/posts/{post_id}", headers=headers, timeout=10)
    assert del_resp.status_code in [200, 204], f"Delete post failed: {del_resp.text}"


test_posts_api()
