from pathlib import Path

from playwright.sync_api import sync_playwright, expect


BASE_URL = "http://127.0.0.1:3027"
ARTIFACT_DIR = Path("output/validation")


def run() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    browser_errors: list[str] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        page.on("console", lambda message: browser_errors.append(f"console: {message.text}") if message.type == "error" else None)
        page.on("pageerror", lambda error: browser_errors.append(f"page: {error}"))

        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        page.evaluate("localStorage.clear()")
        page.reload()
        page.wait_for_load_state("networkidle")

        api_payload = {
            "task": "analyse",
            "language": "en",
            "notes": [{"id": "api-check", "text": "The teacher asked one question.", "kind": "sample", "time": "Demo"}],
            "context": {"grade": "2", "subject": "Mathematics", "topic": "Subtraction"},
        }
        same_origin = page.request.post(f"{BASE_URL}/api/coach", data=api_payload, headers={"Origin": BASE_URL})
        if same_origin.status != 200 or same_origin.json().get("engine") != "demo":
            raise AssertionError(f"Same-origin demo API failed: {same_origin.status}")
        cross_origin = page.request.post(f"{BASE_URL}/api/coach", data=api_payload, headers={"Origin": "https://example.com"})
        if cross_origin.status != 403:
            raise AssertionError(f"Cross-origin API request was not rejected: {cross_origin.status}")

        expect(page.get_by_role("heading", name="See one complete coaching loop.")).to_be_visible()
        page.get_by_role("button", name="Start guided sample").click()
        expect(page.get_by_role("heading", name="What did you notice?")).to_be_visible()
        expect(page.locator(".captured-note")).to_have_count(3)

        page.get_by_role("button", name="Reflect on observations").click()
        expect(page.get_by_role("heading", name="Make every child’s thinking visible")).to_be_visible()
        expect(page.locator(".evidence-card blockquote")).to_have_count(3)

        page.get_by_role("button", name="Review & agree a plan").click()
        page.locator(".checkbox-label input").check()
        page.get_by_role("button", name="Save coaching plan").click()
        expect(page.get_by_role("heading", name="Return to what matters.")).to_be_visible()

        sunita_card = page.locator(".followup-card").filter(has_text="Sunita Devi")
        expect(sunita_card).to_be_visible()
        sunita_card.get_by_role("button", name="View coaching record").click()
        expect(page.get_by_role("heading", name="Coaching record")).to_be_visible()
        expect(page.locator(".print-sheet")).to_contain_text("Subtraction with regrouping")
        page.screenshot(path=str(ARTIFACT_DIR / "guided-flow-record.png"), full_page=True)
        page.emulate_media(media="print")
        page.pdf(path=str(ARTIFACT_DIR / "coaching-record.pdf"), format="A4", print_background=True)
        page.emulate_media(media="screen")

        page.get_by_role("button", name="Close", exact=True).click()
        context.set_offline(True)
        page.get_by_role("button", name="My workspace").click()
        expect(page.get_by_text("Offline · saved on device")).to_be_visible()
        expect(page.get_by_role("heading", name="See one complete coaching loop.")).to_be_visible()
        context.set_offline(False)

        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.goto(BASE_URL)
        mobile.wait_for_load_state("networkidle")
        expect(mobile.get_by_role("button", name="Open navigation")).to_be_visible()
        expect(mobile.get_by_role("heading", name="See one complete coaching loop.")).to_be_visible()
        overflow = mobile.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        if overflow:
            raise AssertionError("Mobile layout has horizontal overflow")
        mobile.screenshot(path=str(ARTIFACT_DIR / "mobile-home.png"), full_page=True)

        browser.close()

    if browser_errors:
        raise AssertionError("Browser errors:\n" + "\n".join(browser_errors))
    print("UI verification passed: guided flow, record, offline shell, and 390px layout")


if __name__ == "__main__":
    run()
