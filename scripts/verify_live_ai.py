import json
from urllib.request import Request, urlopen


BASE_URL = "http://127.0.0.1:3028"
NOTES = [
    {
        "id": "live-check-1",
        "text": "The teacher asked five subtraction questions. The same four children answered each time.",
        "kind": "sample",
        "time": "Demo",
    },
    {
        "id": "live-check-2",
        "text": "About half the class did not give a response during the questions I observed.",
        "kind": "sample",
        "time": "Demo",
    },
]


def read_json(request: Request | str) -> dict:
    with urlopen(request, timeout=60) as response:
        return json.loads(response.read())


engine = read_json(f"{BASE_URL}/api/coach")
if engine.get("engine") != "claude":
    raise AssertionError(f"Expected Claude engine, received {engine!r}")

payload = json.dumps(
    {
        "task": "analyse",
        "language": "en",
        "notes": NOTES,
        "context": {"grade": "2", "subject": "Mathematics", "topic": "Subtraction"},
    }
).encode()
request = Request(
    f"{BASE_URL}/api/coach",
    data=payload,
    headers={"Content-Type": "application/json", "Origin": BASE_URL},
    method="POST",
)
result = read_json(request)
if result.get("engine") != "claude":
    raise AssertionError(f"Live analysis did not use Claude: {result!r}")
for evidence in result["result"]["evidence"]:
    note = next((item for item in NOTES if item["id"] == evidence["noteId"]), None)
    if note is None or evidence["quote"] not in note["text"]:
        raise AssertionError(f"Ungrounded evidence returned: {evidence!r}")

print("Live AI verification passed: Claude returned schema-valid, source-grounded evidence")
