'use strict';
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Seed Concepts Data ────────────────────────────────────────────────────────

const conceptsData = require('./conceptsData.json');

// ─── Seed Challenges Data ──────────────────────────────────────────────────────

const challengesData = {
  rest: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'What does REST stand for?',
      explanation: 'REST stands for Representational State Transfer, introduced by Roy Fielding in 2000.',
      options: [
        { text: 'Representational State Transfer', isCorrect: true },
        { text: 'Remote Execution State Technology', isCorrect: false },
        { text: 'Resource Endpoint Specification Tool', isCorrect: false },
        { text: 'Relational Entity Service Tier', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'EASY', xpReward: 20,
      question: 'Which HTTP method should you use to CREATE a new resource in REST?',
      explanation: 'POST is standard for resource creation where the server assigns the ID.',
      options: [
        { text: 'POST', isCorrect: true },
        { text: 'GET', isCorrect: false },
        { text: 'PUT', isCorrect: false },
        { text: 'PATCH', isCorrect: false },
      ],
    },
    {
      level: 3, requiredXp: 35, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'A client requests GET /api/users/999 but the user does not exist. What status code is expected?',
      explanation: '404 Not Found is returned when the target resource is missing.',
      options: [
        { text: '404 Not Found', isCorrect: true },
        { text: '400 Bad Request', isCorrect: false },
        { text: '204 No Content', isCorrect: false },
        { text: '500 Internal Server Error', isCorrect: false },
      ],
    },
    {
      level: 4, requiredXp: 60, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'Which REST constraint states that the server must NOT store client session state between requests?',
      explanation: 'Statelessness ensures every request carries all necessary context.',
      options: [
        { text: 'Statelessness', isCorrect: true },
        { text: 'Uniform Interface', isCorrect: false },
        { text: 'Cacheability', isCorrect: false },
        { text: 'Layered System', isCorrect: false },
      ],
    },
    {
      level: 5, requiredXp: 85, type: 'PREDICT_RESPONSE', difficulty: 'MEDIUM', xpReward: 30,
      question: `Request: GET https://jsonplaceholder.typicode.com/posts/1\nWhat is returned?`,
      explanation: 'Returns a single post JSON object with keys id, userId, title, and body.',
      options: [
        { text: 'A single JSON object with id, userId, title, and body', isCorrect: true },
        { text: 'An array of post objects', isCorrect: false },
        { text: 'An XML document', isCorrect: false },
        { text: '404 error', isCorrect: false },
      ],
    },
    {
      level: 6, requiredXp: 115, type: 'FIX_REQUEST', difficulty: 'HARD', xpReward: 35,
      question: `PUT /api/posts/5 wipes all unspecified fields. Which method updates ONLY sent fields?\n\nPUT /api/posts/5\n{ "title": "New Title" }`,
      explanation: 'PATCH performs partial updates, modifying only submitted fields.',
      options: [
        { text: 'PATCH', isCorrect: true },
        { text: 'POST', isCorrect: false },
        { text: 'UPDATE', isCorrect: false },
        { text: 'GET', isCorrect: false },
      ],
    },
    {
      level: 7, requiredXp: 150, type: 'QUIZ', difficulty: 'HARD', xpReward: 40,
      question: 'What header allows browsers to check if a cached REST response is still fresh using validation?',
      explanation: 'ETag (entity tag) paired with If-None-Match lets the server return 304 Not Modified if unchanged.',
      options: [
        { text: 'ETag / If-None-Match', isCorrect: true },
        { text: 'Authorization / Bearer', isCorrect: false },
        { text: 'Content-Type / JSON', isCorrect: false },
        { text: 'X-Forwarded-For', isCorrect: false },
      ],
    },
    {
      level: 8, requiredXp: 190, type: 'QUIZ', difficulty: 'HARD', xpReward: 45,
      question: 'Which HTTP method is IDEMPOTENT (calling it N times has the same server side effect as 1 call)?',
      explanation: 'PUT, GET, DELETE, and HEAD are idempotent. POST is NOT idempotent.',
      options: [
        { text: 'PUT', isCorrect: true },
        { text: 'POST', isCorrect: false },
        { text: 'PATCH (in all cases)', isCorrect: false },
        { text: 'CONNECT', isCorrect: false },
      ],
    },
  ],
  soap: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'What data format does SOAP strictly require for all messages?',
      explanation: 'SOAP exclusively uses XML wrapped inside an Envelope structure.',
      options: [
        { text: 'XML', isCorrect: true },
        { text: 'JSON', isCorrect: false },
        { text: 'YAML', isCorrect: false },
        { text: 'Protocol Buffers', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'EASY', xpReward: 20,
      question: 'What does WSDL stand for in SOAP services?',
      explanation: 'WSDL (Web Services Description Language) defines operations, datatypes, and endpoints.',
      options: [
        { text: 'Web Services Description Language', isCorrect: true },
        { text: 'Web Standard Data Layer', isCorrect: false },
        { text: 'Wireless Service Data Link', isCorrect: false },
        { text: 'Workflow System Definition List', isCorrect: false },
      ],
    },
    {
      level: 3, requiredXp: 35, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'What XML element communicates operation errors inside a SOAP response?',
      explanation: 'The soap:Fault element inside soap:Body conveys formal error codes and details.',
      options: [
        { text: 'soap:Fault', isCorrect: true },
        { text: 'soap:Error', isCorrect: false },
        { text: 'soap:Exception', isCorrect: false },
        { text: 'HTTP 404 Status', isCorrect: false },
      ],
    },
    {
      level: 4, requiredXp: 60, type: 'PREDICT_RESPONSE', difficulty: 'MEDIUM', xpReward: 30,
      question: 'What HTTP status code is typically returned by a SOAP server even when a SOAP Fault occurs?',
      explanation: 'SOAP usually returns HTTP 200 (or 500 in some specifications) with the error inside soap:Fault.',
      options: [
        { text: 'HTTP 200 OK (with soap:Fault in body)', isCorrect: true },
        { text: 'HTTP 404 Not Found', isCorrect: false },
        { text: 'HTTP 401 Unauthorized', isCorrect: false },
        { text: 'HTTP 422 Unprocessable', isCorrect: false },
      ],
    },
    {
      level: 5, requiredXp: 90, type: 'FIX_REQUEST', difficulty: 'HARD', xpReward: 35,
      question: `This SOAP message is missing a mandatory envelope component. What is it?\n\n<soap:Envelope>\n  <soap:Header><token>123</token></soap:Header>\n</soap:Envelope>`,
      explanation: 'soap:Body is mandatory in every valid SOAP Envelope.',
      options: [
        { text: 'Add <soap:Body> containing the operation payload', isCorrect: true },
        { text: 'Add <soap:Footer>', isCorrect: false },
        { text: 'Remove soap:Header', isCorrect: false },
        { text: 'Add JSON payload', isCorrect: false },
      ],
    },
    {
      level: 6, requiredXp: 125, type: 'QUIZ', difficulty: 'HARD', xpReward: 40,
      question: 'Which enterprise specification provides message-level encryption and digital signatures for SOAP?',
      explanation: 'WS-Security provides end-to-end message security independent of HTTP transport layer.',
      options: [
        { text: 'WS-Security', isCorrect: true },
        { text: 'WS-ReliableMessaging', isCorrect: false },
        { text: 'WS-AtomicTransaction', isCorrect: false },
        { text: 'OAuth 2.0', isCorrect: false },
      ],
    },
  ],
  graphql: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'What is the primary problem GraphQL solves compared to REST?',
      explanation: 'GraphQL eliminates over-fetching and under-fetching by letting clients request specific fields.',
      options: [
        { text: 'Over-fetching and under-fetching of data', isCorrect: true },
        { text: 'Lack of HTTPS support', isCorrect: false },
        { text: 'Slow database connections', isCorrect: false },
        { text: 'Browser CORS issues', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'EASY', xpReward: 20,
      question: 'What are the three core operation types defined in GraphQL schemas?',
      explanation: 'Query (read), Mutation (write), and Subscription (real-time stream).',
      options: [
        { text: 'Query, Mutation, Subscription', isCorrect: true },
        { text: 'GET, POST, DELETE', isCorrect: false },
        { text: 'Select, Insert, Listen', isCorrect: false },
        { text: 'Read, Write, Execute', isCorrect: false },
      ],
    },
    {
      level: 3, requiredXp: 35, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'Where are application errors delivered in a standard GraphQL HTTP response?',
      explanation: 'GraphQL returns HTTP 200 with an "errors" array alongside the "data" field.',
      options: [
        { text: 'In the "errors" array within the JSON response body', isCorrect: true },
        { text: 'Via HTTP 404 status header', isCorrect: false },
        { text: 'In the HTTP response headers', isCorrect: false },
        { text: 'As a plain text string', isCorrect: false },
      ],
    },
    {
      level: 4, requiredXp: 60, type: 'PREDICT_RESPONSE', difficulty: 'MEDIUM', xpReward: 30,
      question: `Query:\nquery { user(id: "1") { name email } }\nWhat is the shape of the data property?`,
      explanation: 'Response data matches exact selection: { data: { user: { name, email } } }.',
      options: [
        { text: '{ "user": { "name": "...", "email": "..." } }', isCorrect: true },
        { text: '[{ "name": "...", "email": "...", "id": "1" }]', isCorrect: false },
        { text: '{ "name": "..." }', isCorrect: false },
        { text: 'Raw SQL result string', isCorrect: false },
      ],
    },
    {
      level: 5, requiredXp: 90, type: 'QUIZ', difficulty: 'HARD', xpReward: 35,
      question: 'What performance issue occurs when nested GraphQL resolvers issue N individual database queries?',
      explanation: 'The N+1 problem occurs with naive nested field resolvers; solved by DataLoader batching.',
      options: [
        { text: 'The N+1 Query Problem (solved by DataLoader)', isCorrect: true },
        { text: 'The CORS Lock Problem', isCorrect: false },
        { text: 'The Schema Drift Problem', isCorrect: false },
        { text: 'The Deadlock Cascade', isCorrect: false },
      ],
    },
    {
      level: 6, requiredXp: 125, type: 'FIX_REQUEST', difficulty: 'HARD', xpReward: 40,
      question: `Fix this query error:\nquery { user(id: "1") name email }`,
      explanation: 'Selection sets for object types must be wrapped in curly braces { } after the field name.',
      options: [
        { text: 'Wrap fields inside { name email } after user(id: "1")', isCorrect: true },
        { text: 'Replace query with GET', isCorrect: false },
        { text: 'Remove user(id: "1")', isCorrect: false },
        { text: 'Add SQL SELECT statement', isCorrect: false },
      ],
    },
  ],
  auth: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'Which HTTP header is standard for transmitting Bearer tokens in API requests?',
      explanation: 'The Authorization header format is: Authorization: Bearer <token>.',
      options: [
        { text: 'Authorization: Bearer <token>', isCorrect: true },
        { text: 'X-Api-Token: <token>', isCorrect: false },
        { text: 'Content-Auth: <token>', isCorrect: false },
        { text: 'Cookie: bearer=<token>', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'EASY', xpReward: 20,
      question: 'What are the three dot-separated components of a JSON Web Token (JWT)?',
      explanation: 'JWT consists of Header.Payload.Signature (e.g. eyJ....eyJ....sig).',
      options: [
        { text: 'Header, Payload, Signature', isCorrect: true },
        { text: 'User, Role, Expiry', isCorrect: false },
        { text: 'Issuer, Audience, Subject', isCorrect: false },
        { text: 'Key, Secret, Nonce', isCorrect: false },
      ],
    },
    {
      level: 3, requiredXp: 35, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'In OAuth 2.0, what token is issued alongside an Access Token to obtain a new Access Token upon expiration?',
      explanation: 'Refresh Tokens allow client apps to obtain fresh Access Tokens without re-authenticating the user.',
      options: [
        { text: 'Refresh Token', isCorrect: true },
        { text: 'Identity Token', isCorrect: false },
        { text: 'CSRF Token', isCorrect: false },
        { text: 'Master Token', isCorrect: false },
      ],
    },
    {
      level: 4, requiredXp: 60, type: 'FIX_REQUEST', difficulty: 'HARD', xpReward: 35,
      question: `This API request receives HTTP 401 Unauthorized. What is wrong?\n\nGET /v1/profile\nAuthorization: token_xyz123`,
      explanation: 'Bearer authentication requires the "Bearer " prefix in the Authorization header value.',
      options: [
        { text: 'Add "Bearer " prefix: Authorization: Bearer token_xyz123', isCorrect: true },
        { text: 'Change GET to POST', isCorrect: false },
        { text: 'Send token in query params only', isCorrect: false },
        { text: 'Add Content-Type: application/json', isCorrect: false },
      ],
    },
  ],
  pagination: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'What are the two typical query parameters used in simple offset-based pagination?',
      explanation: 'page/limit or offset/limit (e.g., ?page=2&limit=20 or ?offset=20&limit=20).',
      options: [
        { text: 'page (or offset) and limit', isCorrect: true },
        { text: 'start and finish', isCorrect: false },
        { text: 'min and max', isCorrect: false },
        { text: 'key and index', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'Why is Cursor-based pagination preferred over Offset pagination for rapidly changing real-time data feeds?',
      explanation: 'Cursor pagination avoids missing or duplicating items when new records are inserted between page requests.',
      options: [
        { text: 'Prevents skipped or duplicated items when records are added/deleted', isCorrect: true },
        { text: 'Cursor pagination uses fewer HTTP headers', isCorrect: false },
        { text: 'Offset pagination doesn\'t work with JSON', isCorrect: false },
        { text: 'Cursor pagination doesn\'t require database indexes', isCorrect: false },
      ],
    },
    {
      level: 3, requiredXp: 40, type: 'PREDICT_RESPONSE', difficulty: 'MEDIUM', xpReward: 30,
      question: 'Which standard HTTP header is recommended by RFC 5988 for conveying pagination links (next, prev, first, last)?',
      explanation: 'The Link header contains RFC 5988 web link relations: Link: <url>; rel="next".',
      options: [
        { text: 'Link', isCorrect: true },
        { text: 'X-Pagination-Next', isCorrect: false },
        { text: 'Location', isCorrect: false },
        { text: 'Content-Range', isCorrect: false },
      ],
    },
  ],
  'rate-limiting': [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'Which HTTP status code signifies that a client has exceeded their rate limit?',
      explanation: 'HTTP 429 Too Many Requests indicates rate limit exhaustion.',
      options: [
        { text: '429 Too Many Requests', isCorrect: true },
        { text: '403 Forbidden', isCorrect: false },
        { text: '503 Service Unavailable', isCorrect: false },
        { text: '400 Bad Request', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'What header tells the client how many seconds to wait before retrying after a 429 response?',
      explanation: 'Retry-After (e.g. Retry-After: 60) instructs clients when it is safe to retry.',
      options: [
        { text: 'Retry-After', isCorrect: true },
        { text: 'X-Wait-Time', isCorrect: false },
        { text: 'Cache-Control', isCorrect: false },
        { text: 'X-RateLimit-Delay', isCorrect: false },
      ],
    },
    {
      level: 3, requiredXp: 40, type: 'QUIZ', difficulty: 'HARD', xpReward: 35,
      question: 'Which rate limiting algorithm allows sudden bursts up to capacity while refilling at a steady rate?',
      explanation: 'Token Bucket allows bursts up to the bucket size as long as tokens are available.',
      options: [
        { text: 'Token Bucket', isCorrect: true },
        { text: 'Fixed Window Counter', isCorrect: false },
        { text: 'Strict Round Robin', isCorrect: false },
        { text: 'First In First Out (FIFO)', isCorrect: false },
      ],
    },
  ],
  security: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'What browser security mechanism blocks frontend web apps on Domain A from calling APIs on Domain B unless explicitly allowed?',
      explanation: 'CORS (Cross-Origin Resource Sharing) enforces origin checks in web browsers.',
      options: [
        { text: 'CORS (Cross-Origin Resource Sharing)', isCorrect: true },
        { text: 'CSP (Content Security Policy)', isCorrect: false },
        { text: 'TLS (Transport Layer Security)', isCorrect: false },
        { text: 'HSTS (HTTP Strict Transport Security)', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'What vulnerability occurs when an API endpoint exposes object IDs (e.g. GET /orders/102) without checking if the current user owns record 102?',
      explanation: 'BOLA (Broken Object Level Authorization), formerly IDOR, is #1 on the OWASP API Top 10.',
      options: [
        { text: 'BOLA / IDOR (Broken Object Level Authorization)', isCorrect: true },
        { text: 'SQL Injection', isCorrect: false },
        { text: 'CSRF (Cross-Site Request Forgery)', isCorrect: false },
        { text: 'Rate Limit Exhaustion', isCorrect: false },
      ],
    },
  ],
  webhooks: [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'What HTTP method do webhook providers use to send event notifications to your server?',
      explanation: 'Webhooks send HTTP POST requests containing JSON or XML event payloads.',
      options: [
        { text: 'POST', isCorrect: true },
        { text: 'GET', isCorrect: false },
        { text: 'PUT', isCorrect: false },
        { text: 'LISTEN', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'How do you verify that an incoming webhook request was actually sent by Stripe/GitHub and not an attacker?',
      explanation: 'Verify the HMAC signature header using your shared webhook secret key.',
      options: [
        { text: 'Compute and verify the HMAC SHA-256 signature in request headers', isCorrect: true },
        { text: 'Check if the IP address matches Google', isCorrect: false },
        { text: 'Trust the User-Agent header string', isCorrect: false },
        { text: 'Perform a reverse DNS query', isCorrect: false },
      ],
    },
  ],
  'error-handling': [
    {
      level: 1, requiredXp: 0, type: 'QUIZ', difficulty: 'EASY', xpReward: 15,
      question: 'Which 4xx status code should be returned when a request is missing authentication credentials?',
      explanation: '401 Unauthorized indicates unauthenticated requests; 403 Forbidden is for authenticated but unauthorized requests.',
      options: [
        { text: '401 Unauthorized', isCorrect: true },
        { text: '403 Forbidden', isCorrect: false },
        { text: '400 Bad Request', isCorrect: false },
        { text: '405 Method Not Allowed', isCorrect: false },
      ],
    },
    {
      level: 2, requiredXp: 15, type: 'QUIZ', difficulty: 'MEDIUM', xpReward: 25,
      question: 'What standard Content-Type media header is specified by RFC 7807 for Problem Details JSON error payloads?',
      explanation: 'RFC 7807 specifies Content-Type: application/problem+json.',
      options: [
        { text: 'application/problem+json', isCorrect: true },
        { text: 'application/error+json', isCorrect: false },
        { text: 'text/json-error', isCorrect: false },
        { text: 'application/json', isCorrect: false },
      ],
    },
  ],
};

// ─── Main Seed Function ────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  await prisma.completedChallenge.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.sandboxLog.deleteMany();
  await prisma.challengeOption.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.comparisonPoint.deleteMany();
  await prisma.concept.deleteMany();
  console.log('✓ Cleared existing seed data');

  let totalChallenges = 0;

  for (const conceptDef of conceptsData) {
    const { comparisonPoints, ...conceptFields } = conceptDef;

    const concept = await prisma.concept.create({
      data: {
        ...conceptFields,
        comparisonPoints: {
          create: comparisonPoints.map((cp) => ({ label: cp.label, value: cp.value })),
        },
      },
    });

    const protocolKey = conceptFields.slug;
    const challenges = challengesData[protocolKey] || [];

    for (const ch of challenges) {
      const { options, ...challengeFields } = ch;
      await prisma.challenge.create({
        data: {
          ...challengeFields,
          conceptId: concept.id,
          options: {
            create: options.map((o) => ({ optionText: o.text, isCorrect: o.isCorrect })),
          },
        },
      });
      totalChallenges++;
    }

    console.log(`✓ Seeded topic "${conceptFields.title}" (${challenges.length} challenges)`);
  }

  console.log(`\n✅ Database seed complete!`);
  console.log(`   • ${conceptsData.length} concepts/topics seeded`);
  console.log(`   • ${totalChallenges} challenges total`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
