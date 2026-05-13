export const AI_MARKING_ACTIVE_JOB_WINDOW_MS = 15 * 60 * 1000;
export const AI_MARKING_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const AI_MARKING_RATE_LIMIT_MAX_JOBS = 10;
export const AI_MARKING_DEFAULT_TIMEOUT_MS = 60_000;
export const AI_MARKING_MAX_TIMEOUT_MS = 180_000;

export function getAiMarkingActiveJobCutoff(now = new Date()) {
  return new Date(now.getTime() - AI_MARKING_ACTIVE_JOB_WINDOW_MS).toISOString();
}

export function getAiMarkingRateLimitCutoff(now = new Date()) {
  return new Date(now.getTime() - AI_MARKING_RATE_LIMIT_WINDOW_MS).toISOString();
}

export function isAiMarkingRateLimited(jobCount: number | null | undefined) {
  return (jobCount ?? 0) >= AI_MARKING_RATE_LIMIT_MAX_JOBS;
}

export function getOpenAiRequestTimeoutMs(value = process.env.OPENAI_TIMEOUT_MS) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return AI_MARKING_DEFAULT_TIMEOUT_MS;
  }

  return Math.min(parsed, AI_MARKING_MAX_TIMEOUT_MS);
}
