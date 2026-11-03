'use strict';
const missionModel = require('./mission.model');
const progressModel = require('../progress/progress.model');
const ApiError = require('../../utils/ApiError');
const axios = require('axios');
const { SANDBOX_REST_BASE_URL } = require('../../config/env');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compares the student's submitted request against the mission's expectedOutcome.
 * Returns { passed: bool, feedback: string }
 */
const evaluate = (submission, expectedOutcome, sandboxResponse) => {
  const { method, endpoint, headers = {}, body } = submission;
  const {
    method: expectedMethod,
    endpointPattern,
    requiredHeaders,
    requiredBodyKeys,
    expectedStatusRange,
    forbiddenEndpoints,
  } = expectedOutcome;

  // 1. Method check
  if (expectedMethod && method.toUpperCase() !== expectedMethod.toUpperCase()) {
    return {
      passed: false,
      feedback: `❌ Wrong HTTP method! You sent \`${method.toUpperCase()}\`, but this operation requires \`${expectedMethod.toUpperCase()}\`. HTTP methods are semantic — GET retrieves, POST creates, PUT/PATCH updates, DELETE removes. They are not interchangeable.`,
      errorCategory: 'WRONG_METHOD',
    };
  }

  // 2. Endpoint check
  if (endpointPattern) {
    const isExact = typeof endpointPattern === 'string';
    const normalised = endpoint.replace(/\/+$/, ''); // strip trailing slash
    let endpointOk = false;
    if (isExact) {
      endpointOk = normalised === endpointPattern.replace(/\/+$/, '');
    } else {
      // treat as regex string
      endpointOk = new RegExp(endpointPattern).test(normalised);
    }
    if (!endpointOk) {
      // Give a targeted hint based on common mistake patterns
      let hint = '';
      if (typeof endpointPattern === 'string') {
        const expected = endpointPattern;
        const submitted = normalised;
        if (expected.replace(/\//g, '') === submitted.replace(/\//g, '')) {
          hint = ` You're very close — check the slashes carefully.`;
        } else if (
          expected.replace(/s$/, '').toLowerCase() === submitted.replace(/s$/, '').toLowerCase()
        ) {
          hint = ` Tip: REST endpoints often use plural resource names (e.g. \`/users\` not \`/user\`).`;
        }
      }
      return {
        passed: false,
        feedback: `❌ Incorrect endpoint! You sent to \`${endpoint}\`.${hint} The API has no route matching that path — inspect the documentation or the error response carefully.`,
        errorCategory: 'WRONG_ENDPOINT',
      };
    }
  }

  // 3. Forbidden endpoint check (e.g., old broken path must not be used)
  if (forbiddenEndpoints) {
    for (const forbidden of forbiddenEndpoints) {
      if (endpoint.includes(forbidden)) {
        return {
          passed: false,
          feedback: `❌ That endpoint (\`${endpoint}\`) is the broken one you're supposed to fix! Look at the error response — it tells you exactly what went wrong.`,
          errorCategory: 'FORBIDDEN_ENDPOINT',
        };
      }
    }
  }

  // 4. Required headers check
  if (requiredHeaders) {
    for (const [key, expectedValue] of Object.entries(requiredHeaders)) {
      const actual = headers[key] || headers[key.toLowerCase()] || headers[key.toUpperCase()];
      if (!actual || !actual.toLowerCase().includes(expectedValue.toLowerCase())) {
        return {
          passed: false,
          feedback: `❌ Missing or incorrect header! The server expects \`${key}: ${expectedValue}\`. Without this header the server cannot parse your request body correctly. Check the \`Content-Type\` header — it tells the server what format your data is in.`,
          errorCategory: 'WRONG_HEADER',
        };
      }
    }
  }

  // 5. Required body keys
  if (requiredBodyKeys && requiredBodyKeys.length > 0) {
    let parsedBody = body;
    if (typeof body === 'string') {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        return {
          passed: false,
          feedback: `❌ Your request body contains invalid JSON! The server returned a parse error because the JSON syntax is malformed. Common mistakes: missing quotes around keys, trailing commas, unmatched brackets. Try validating your JSON at jsonlint.com.`,
          errorCategory: 'INVALID_JSON',
        };
      }
    }
    const missing = requiredBodyKeys.filter((k) => parsedBody == null || parsedBody[k] == null);
    if (missing.length > 0) {
      return {
        passed: false,
        feedback: `❌ Your request body is missing required fields: \`${missing.join('`, `')}\`. The API contract specifies these fields must be present to create or update this resource.`,
        errorCategory: 'MISSING_BODY_FIELDS',
      };
    }
  }

  // 6. Status range check (uses live sandbox response)
  if (expectedStatusRange && sandboxResponse) {
    const [min, max] = expectedStatusRange;
    const status = sandboxResponse.status;
    if (status < min || status > max) {
      const statusHints = {
        401: `A 401 means your credentials are missing or invalid — check the Authorization header format. Bearer tokens require "Bearer " prefix.`,
        403: `A 403 means the server knows who you are but won't let you do that — this is an authorization (permissions) issue, not an authentication issue.`,
        404: `A 404 means the server can't find that resource. The endpoint path, ID, or resource name may be wrong.`,
        405: `A 405 Method Not Allowed means the endpoint exists but doesn't support the HTTP method you used.`,
        415: `A 415 Unsupported Media Type means your Content-Type header doesn't match what the server expects. Try \`Content-Type: application/json\`.`,
        422: `A 422 means the request was well-formed but the server couldn't process it — usually a validation failure. Check all required fields are present and correctly typed.`,
        429: `A 429 Too Many Requests means you've hit a rate limit. Wait a moment and try again, or check the Retry-After header.`,
        500: `A 500 means the server crashed — this might be caused by your request (e.g., malformed body, invalid data type).`,
      };
      const specificHint = statusHints[status] || '';
      return {
        passed: false,
        feedback: `❌ Your request reached the server but got HTTP ${status} back (expected ${min}–${max}). ${specificHint}`,
        errorCategory: 'WRONG_STATUS',
      };
    }
  }

  return { passed: true, feedback: '✅ Mission complete! Your request was correct.' };
};

// ─── Service Functions ─────────────────────────────────────────────────────────

const list = async (userId) => {
  const missions = await missionModel.findAll();
  if (!userId) return missions.map((m) => ({ ...m, isCompleted: false, attempt: null }));

  const attempts = await missionModel.listAttemptsForUser(userId);
  const attemptMap = {};
  attempts.forEach((a) => { attemptMap[a.missionId] = a; });

  return missions.map((m) => ({
    ...m,
    isCompleted: !!attemptMap[m.id]?.isCorrect,
    attempt: attemptMap[m.id] || null,
  }));
};

const getById = async (id, userId) => {
  const mission = await missionModel.findById(id);
  if (!mission) throw ApiError.notFound('Mission not found');

  let isCompleted = false;
  let attempt = null;
  if (userId) {
    attempt = await missionModel.findAttempt(userId, id);
    isCompleted = !!attempt?.isCorrect;
  }

  // Never send the expected outcome to the client
  const { expectedOutcome: _hidden, ...safe } = mission;
  return { ...safe, isCompleted, attempt };
};

const getHint = async (missionId, hintIndex, userId) => {
  const mission = await missionModel.findById(missionId);
  if (!mission) throw ApiError.notFound('Mission not found');

  const hints = Array.isArray(mission.hints) ? mission.hints : [];
  const idx = parseInt(hintIndex, 10);

  if (isNaN(idx) || idx < 0 || idx >= hints.length) {
    throw ApiError.badRequest(
      hints.length === 0
        ? 'No hints available for this mission.'
        : `Hint index out of range. This mission has ${hints.length} hint(s) (index 0–${hints.length - 1}).`
    );
  }

  return {
    hint: hints[idx],
    hintIndex: idx,
    totalHints: hints.length,
    isFirst: idx === 0,
    // XP reduction only starts from the second hint
    xpReduction: idx === 0 ? 0 : Math.min(idx * 10, Math.floor(mission.xpReward * 0.25)),
  };
};

const submit = async (missionId, submission, userId) => {
  const mission = await missionModel.findById(missionId);
  if (!mission) throw ApiError.notFound('Mission not found');

  // Check if already completed correctly — don't re-award XP
  const existing = await missionModel.findAttempt(userId, missionId);
  const alreadyCorrect = !!existing?.isCorrect;

  // ── Proxy the request to the live sandbox so we can inspect the real response ──
  let sandboxResponse = null;
  if (SANDBOX_REST_BASE_URL) {
    try {
      const { method = 'GET', endpoint = '/', headers: reqHeaders = {}, body: reqBody } = submission;
      const url = `${SANDBOX_REST_BASE_URL}${endpoint}`;
      const resp = await axios({
        method: method.toUpperCase(),
        url,
        headers: { 'Content-Type': 'application/json', ...reqHeaders },
        data: reqBody || undefined,
        validateStatus: () => true,
        timeout: 8000,
      });
      sandboxResponse = { status: resp.status, data: resp.data };
    } catch (err) {
      // sandbox unreachable — evaluate without status check
      sandboxResponse = null;
    }
  }

  // ── Evaluate ──────────────────────────────────────────────────────────────────
  const { passed, feedback, errorCategory } = evaluate(
    submission,
    mission.expectedOutcome,
    sandboxResponse
  );

  const hintsUsed = submission.hintsUsed || 0;
  // Apply hint XP reduction (max 25% off, first hint is free)
  const xpReduction = hintsUsed <= 1 ? 0 : Math.min((hintsUsed - 1) * 10, Math.floor(mission.xpReward * 0.25));
  const xpAwarded = passed ? Math.max(mission.xpReward - xpReduction, Math.ceil(mission.xpReward * 0.5)) : 0;

  await missionModel.recordAttempt(userId, missionId, passed, hintsUsed, xpAwarded);

  let newBadges = [];
  let updatedProgress = null;

  if (passed && !alreadyCorrect) {
    // Award XP through the existing pipeline
    updatedProgress = await progressModel.addXp(userId, xpAwarded);
    await progressModel.updateStreak(userId);
    newBadges = await progressModel.checkAndAwardBadges(userId);

    // Increment mission-specific counters
    if (mission.type === 'DEBUGGER') {
      await missionModel.incrementBugsFixed(userId);
    } else {
      await missionModel.incrementMissionsCompleted(userId);
    }
  }

  return {
    passed,
    feedback,
    errorCategory: passed ? null : errorCategory,
    xpAwarded,
    coinReward: passed ? mission.coinReward : 0,
    newBadges,
    progress: updatedProgress,
    sandboxResponse,
    alreadyCompleted: alreadyCorrect,
  };
};

module.exports = { list, getById, getHint, submit };
