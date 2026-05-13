import { describe, expect, it } from "vitest";
import {
  AI_MARKING_DEFAULT_TIMEOUT_MS,
  AI_MARKING_MAX_TIMEOUT_MS,
  AI_MARKING_RATE_LIMIT_MAX_JOBS,
  getAiMarkingActiveJobCutoff,
  getAiMarkingRateLimitCutoff,
  getOpenAiRequestTimeoutMs,
  isAiMarkingRateLimited,
} from "./mock-exam-ai-marking-guards";

describe("AI marking guards", () => {
  const now = new Date("2026-05-08T12:00:00.000Z");

  it("builds stable active-job and rate-limit cutoffs", () => {
    expect(getAiMarkingActiveJobCutoff(now)).toBe("2026-05-08T11:45:00.000Z");
    expect(getAiMarkingRateLimitCutoff(now)).toBe("2026-05-08T11:50:00.000Z");
  });

  it("treats the rate limit as reached at the configured maximum", () => {
    expect(isAiMarkingRateLimited(AI_MARKING_RATE_LIMIT_MAX_JOBS - 1)).toBe(false);
    expect(isAiMarkingRateLimited(AI_MARKING_RATE_LIMIT_MAX_JOBS)).toBe(true);
    expect(isAiMarkingRateLimited(null)).toBe(false);
  });

  it("normalizes OpenAI timeout configuration", () => {
    expect(getOpenAiRequestTimeoutMs("120000")).toBe(120_000);
    expect(getOpenAiRequestTimeoutMs("999999")).toBe(AI_MARKING_MAX_TIMEOUT_MS);
    expect(getOpenAiRequestTimeoutMs("not-a-number")).toBe(AI_MARKING_DEFAULT_TIMEOUT_MS);
  });
});
