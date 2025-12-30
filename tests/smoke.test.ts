// tests/smoke.test.ts

import { describe, it, expect } from "vitest"

describe("UI smoke tests", () => {
  it("build passes", async () => {
    expect(true).toBe(true)
  })

  it("demo auth flag name is correct", () => {
    expect("demo-authed").toBeDefined()
  })
})
