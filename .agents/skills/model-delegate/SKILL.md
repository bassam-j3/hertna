---
name: model-delegate
description: "Advanced multi-model routing, Gemini-priority, token fallback, and automatic quota-exhaustion resume protocol for Antigravity."
---

# Antigravity Ultimate Multi-Model & Auto-Resume Protocol

## 🔄 1. Model Routing & Fallback Matrix

1. **Architecture & Deep Planning**
   - **Primary:** `Claude Opus 4.6`
   - **Fallback (If tokens end):** `Gemini 3.1 Pro` (Takes over architectural blueprints).

2. **Clean Code Generation (Gemini Ecosystem)**
   - **Primary:** `Gemini 3.1 Pro`
   - **Fallback (If tokens end):** `Gemini 3.8 Flash` (Keeps Gemini models running at peak performance).

3. **Code Review & Refactoring**
   - **Primary:** `Claude Sonnet 4.6`
   - **Fallback (If tokens end):** `Gemini 3.8 Flash`

4. **Rapid Implementation**
   - **Primary:** `Gemini 3.8 Flash`
   - **Fallback:** `Gemini 3.1 Pro`

---

## 🚨 2. Global Quota Exhaustion & Auto-Resume Protocol (Watchdog Mode)

If **ALL** primary and fallback models exhaust their token limits simultaneously:
1. **Sleep & Monitor Mode:** The agent must not terminate the session or output a final dead-end message. It enters a secure background waiting state linked to the API rate-limit reset timers.
2. **Autonomous Waiting:** It will continuously check the API availability and wait patiently until the tokens are refreshed.
3. **Auto-Resume Without Prompt:** The moment the token quota is refreshed and available, the agent must **automatically resume execution** from the exact last saved state (checkpoint/context) and continue working on the current task **without requiring any user prompt or intervention**.
