'use strict';
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Seed Data ────────────────────────────────────────────────────────────────

const conceptsData = [
  {
    protocol: 'REST',
    title: 'REST — Representational State Transfer',
    slug: 'rest',
    sampleEndpoint: 'https://jsonplaceholder.typicode.com',
    explanation: `REST (Representational State Transfer) is an architectural style for designing networked applications, introduced by Roy Fielding in his 2000 doctoral dissertation. Unlike SOAP or GraphQL, REST is not a protocol or standard — it is a set of constraints that, when applied to a web service, produce a RESTful system.

## Core Constraints

**1. Client-Server Separation**  
The client and server are decoupled. The client handles the UI; the server handles data storage and business logic. This allows each to evolve independently.

**2. Statelessness**  
Every request from the client must contain all information needed to process it. The server stores no session state between requests. This makes REST services highly scalable — any server can handle any request.

**3. Cacheability**  
Responses must define themselves as cacheable or non-cacheable. When cacheable, clients (and intermediaries) can reuse response data to reduce load and improve performance.

**4. Uniform Interface**  
REST relies on standardised HTTP methods to operate on resources:
- **GET** — Retrieve a resource (read, idempotent, cacheable)
- **POST** — Create a new resource
- **PUT** — Replace an existing resource entirely
- **PATCH** — Partially update a resource
- **DELETE** — Remove a resource

**5. Layered System**  
Clients don't need to know if they're talking directly to the server or to an intermediary (load balancer, cache, gateway). This enables scalability and security.

**6. Code on Demand (optional)**  
Servers can send executable code to clients (e.g., JavaScript), extending client functionality dynamically.

## Resources & URIs

Everything in REST is a **resource**, identified by a URI (Uniform Resource Identifier). Resources are nouns, not verbs:
- ✅ \`GET /users/42\` — fetch user 42
- ❌ \`GET /getUser?id=42\` — not RESTful (verb in URI)

## HTTP Status Codes

REST leverages HTTP's built-in status code system:
- **2xx** — Success (200 OK, 201 Created, 204 No Content)
- **4xx** — Client error (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx** — Server error (500 Internal Server Error)

## Data Format

REST most commonly uses **JSON** (JavaScript Object Notation), though it is format-agnostic — XML, CSV, and HTML are also valid.

## When to Use REST

REST is the right choice when:
- You need a public API consumed by many clients
- You want to leverage HTTP caching
- Your data maps naturally to resources (users, products, orders)
- Your team values simplicity and wide tooling support`,
    comparisonPoints: [
      { label: 'Message Format', value: 'JSON (most common), XML, or any format' },
      { label: 'Transport Protocol', value: 'HTTP/HTTPS' },
      { label: 'Contract/Schema', value: 'Optional (OpenAPI/Swagger recommended)' },
      { label: 'Caching', value: 'Native HTTP caching support' },
      { label: 'Versioning', value: 'Via URL (/v1/users) or headers' },
      { label: 'Learning Curve', value: 'Low — familiar HTTP concepts' },
      { label: 'Error Handling', value: 'HTTP status codes + optional JSON error body' },
      { label: 'Best For', value: 'Public APIs, CRUD-heavy apps, microservices' },
      { label: 'Weaknesses', value: 'Over-fetching/under-fetching, multiple roundtrips' },
      { label: 'Adopted By', value: 'Twitter, GitHub, Stripe, Twilio, virtually all modern APIs' },
    ],
  },
  {
    protocol: 'SOAP',
    title: 'SOAP — Simple Object Access Protocol',
    slug: 'soap',
    sampleEndpoint: 'http://www.dneonline.com/calculator.asmx',
    explanation: `SOAP (Simple Object Access Protocol) is a formal, XML-based messaging protocol for exchanging structured information in web services. Originally developed by Microsoft in 1998, SOAP became a W3C standard and dominated enterprise web services throughout the 2000s.

## How SOAP Works

Unlike REST (which is architectural) or GraphQL (which is a query language), SOAP is a **protocol** — a strict specification that defines exactly how messages must be structured, sent, and processed.

Every SOAP message is an **XML envelope** with a specific structure:

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <!-- Optional: auth tokens, transaction IDs, routing -->
  </soap:Header>
  <soap:Body>
    <!-- Required: the actual request/response payload -->
    <Add xmlns="http://tempuri.org/">
      <intA>5</intA>
      <intB>3</intB>
    </Add>
  </soap:Body>
</soap:Envelope>
\`\`\`

## WSDL — The Service Contract

Every SOAP service publishes a **WSDL** (Web Services Description Language) file — an XML document that:
- Lists every available operation (like function signatures)
- Defines the exact data types for inputs and outputs
- Specifies the endpoint URL and protocol binding

WSDL enables tools to auto-generate client code ("stubs") in any language — Java, .NET, Python — guaranteeing type safety across system boundaries.

## Built-in Standards (WS-*)

SOAP's strength lies in its ecosystem of enterprise standards:
- **WS-Security** — Message-level encryption and signing (vs REST's transport-level TLS)
- **WS-ReliableMessaging** — Guaranteed message delivery
- **WS-AtomicTransaction** — Distributed transactions across services
- **WS-Addressing** — Message routing independent of transport

## Transport Flexibility

REST is tied to HTTP. SOAP can run over:
- HTTP/HTTPS (most common)
- SMTP (for asynchronous messaging)
- TCP
- JMS (Java Message Service)

## When to Use SOAP

SOAP is the right choice when:
- You need built-in WS-Security for message-level encryption (banking, healthcare)
- You require ACID transactions across distributed services
- You're integrating with legacy enterprise systems (SAP, Oracle, Salesforce legacy)
- Your organisation mandates WSDL-based service contracts
- You need guaranteed message delivery (WS-ReliableMessaging)

## Why REST Displaced SOAP (for most use cases)

SOAP's verbosity (every call requires a full XML envelope), steep learning curve, and heavyweight tooling made it slower to develop with than REST + JSON. For public APIs and mobile backends where bandwidth and simplicity matter, REST became the clear winner. However, SOAP remains dominant in enterprise integrations, financial services, and government systems where its strict contracts and security standards are required.`,
    comparisonPoints: [
      { label: 'Message Format', value: 'XML (mandatory, strictly structured)' },
      { label: 'Transport Protocol', value: 'HTTP, SMTP, TCP, JMS (transport-agnostic)' },
      { label: 'Contract/Schema', value: 'WSDL (mandatory, machine-readable)' },
      { label: 'Caching', value: 'Not natively supported (all requests via POST)' },
      { label: 'Versioning', value: 'Via WSDL versioning or namespace changes' },
      { label: 'Learning Curve', value: 'High — XML, WSDL, WS-* standards' },
      { label: 'Error Handling', value: 'Formal SOAP Fault element with code, reason, detail' },
      { label: 'Best For', value: 'Enterprise, banking, healthcare, legacy integration' },
      { label: 'Weaknesses', value: 'Verbose XML, complex tooling, slow development' },
      { label: 'Adopted By', value: 'Banks, insurance, government, SAP, Salesforce (legacy)' },
    ],
  },
  {
    protocol: 'GRAPHQL',
    title: 'GraphQL — A Query Language for APIs',
    slug: 'graphql',
    sampleEndpoint: 'https://countries.trevorblades.com/graphql',
    explanation: `GraphQL is a query language for APIs and a runtime for fulfilling those queries, developed internally at Facebook in 2012 and open-sourced in 2015. GraphQL fundamentally rethinks how clients and servers communicate — instead of the server deciding what data to return, **the client specifies exactly what it needs**.

## The Problem GraphQL Solves

With REST, the server defines fixed endpoints that return fixed shapes of data:
- \`GET /users/42\` might return a user object with 20 fields — even if you only need the name and avatar.
- \`GET /users/42/posts\` requires a second round-trip.
- \`GET /users/42/posts/7/comments\` requires a third.

This is **over-fetching** (getting more data than needed) and **under-fetching** (needing multiple requests). On mobile networks, this is expensive.

**GraphQL's solution:** one endpoint (\`POST /graphql\`), infinite flexibility.

## Core Concepts

### Queries — Reading Data
\`\`\`graphql
query {
  user(id: "42") {
    name
    avatar
    posts(first: 3) {
      title
      publishedAt
    }
  }
}
\`\`\`
This single query fetches the user's name, avatar, and their 3 most recent post titles — nothing more, nothing less.

### Mutations — Writing Data
\`\`\`graphql
mutation {
  createPost(input: { title: "Hello GraphQL", body: "..." }) {
    id
    title
    createdAt
  }
}
\`\`\`

### Subscriptions — Real-time Data
\`\`\`graphql
subscription {
  messageAdded(roomId: "general") {
    id
    content
    author { name }
  }
}
\`\`\`
Subscriptions use WebSockets to push data to clients in real-time.

## The Schema — The Contract

GraphQL APIs are defined by a **schema** written in SDL (Schema Definition Language). The schema is the single source of truth for what queries are possible:

\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  user(id: ID!): User
  posts: [Post!]!
}
\`\`\`

The \`!\` means non-nullable. The schema enables introspection (clients can query the API for its own capabilities) and powers excellent tooling.

## Resolvers

On the server, each field in the schema is resolved by a **resolver function** — a function that fetches and returns data for that specific field. This separation of schema from data-fetching logic is a key GraphQL architectural pattern.

## When to Use GraphQL

GraphQL is the right choice when:
- Different clients (web, mobile, third-party) need different data shapes
- You want to reduce over-fetching on mobile clients
- You're building a product API (vs a public/partner API)
- You need real-time subscriptions
- Your data is highly interconnected (social graphs, content hierarchies)

## Tradeoffs

- **Caching is harder** — REST leverages HTTP caching; GraphQL uses POST requests by default
- **N+1 problem** — naive resolvers can generate excessive database queries (mitigated by DataLoader)
- **Learning curve** — schema design and resolver patterns take time to master
- **Over-engineering risk** — REST is simpler for straightforward CRUD APIs`,
    comparisonPoints: [
      { label: 'Message Format', value: 'JSON (request as GraphQL query string, response as JSON)' },
      { label: 'Transport Protocol', value: 'HTTP (single POST endpoint) + WebSockets for subscriptions' },
      { label: 'Contract/Schema', value: 'SDL Schema (mandatory, introspectable)' },
      { label: 'Caching', value: 'Complex — requires client-side (Apollo Cache) or persisted queries' },
      { label: 'Versioning', value: 'Schema evolution (add fields, deprecate old ones) — no version numbers' },
      { label: 'Learning Curve', value: 'Medium — SDL, resolvers, N+1 patterns' },
      { label: 'Error Handling', value: 'HTTP 200 with errors array in response body' },
      { label: 'Best For', value: 'Product APIs, mobile clients, complex data graphs' },
      { label: 'Weaknesses', value: 'Caching complexity, N+1 queries, POST-only limits HTTP cache' },
      { label: 'Adopted By', value: 'GitHub API v4, Shopify, Twitter (now X), Airbnb, Netflix' },
    ],
  },
];

// ─── Challenges ────────────────────────────────────────────────────────────────

const challengesData = {
  rest: [
    {
      type: 'QUIZ',
      difficulty: 'EASY',
      xpReward: 10,
      question: 'What does REST stand for?',
      explanation: 'REST stands for Representational State Transfer. It was defined by Roy Fielding in his 2000 PhD dissertation as an architectural style for distributed hypermedia systems.',
      options: [
        { text: 'Representational State Transfer', isCorrect: true },
        { text: 'Remote Execution State Technology', isCorrect: false },
        { text: 'Resource Endpoint Specification Tool', isCorrect: false },
        { text: 'Relational Entity Service Tier', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'EASY',
      xpReward: 10,
      question: 'Which HTTP method should you use to CREATE a new resource in a RESTful API?',
      explanation: 'POST is used to create new resources. The server generates the resource\'s ID. GET retrieves, PUT replaces, PATCH partially updates, and DELETE removes resources.',
      options: [
        { text: 'POST', isCorrect: true },
        { text: 'GET', isCorrect: false },
        { text: 'PUT', isCorrect: false },
        { text: 'CREATE', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: 'A client sends a GET request to /api/users/99 but user 99 does not exist. What is the most appropriate HTTP status code to return?',
      explanation: '404 Not Found is the correct response when a requested resource does not exist. 400 Bad Request is for malformed syntax, 204 is for success with no content, and 500 is for server errors.',
      options: [
        { text: '404 Not Found', isCorrect: true },
        { text: '400 Bad Request', isCorrect: false },
        { text: '204 No Content', isCorrect: false },
        { text: '500 Internal Server Error', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: 'Which REST constraint states that the server must NOT store any client session state between requests?',
      explanation: 'Statelessness is a core REST constraint: every request must contain all information needed to process it. This makes REST APIs horizontally scalable because any server can handle any request without shared session state.',
      options: [
        { text: 'Statelessness', isCorrect: true },
        { text: 'Layered System', isCorrect: false },
        { text: 'Cacheability', isCorrect: false },
        { text: 'Uniform Interface', isCorrect: false },
      ],
    },
    {
      type: 'PREDICT_RESPONSE',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: `You send this request:\n\nGET https://jsonplaceholder.typicode.com/posts/1\n\nWhat will the response body contain?`,
      explanation: 'JSONPlaceholder returns a post object with id, title, body, and userId fields. The response is JSON. Since we are fetching post with id=1, we get exactly one post object, not an array.',
      options: [
        { text: 'A single JSON object with id, userId, title, and body fields', isCorrect: true },
        { text: 'An array containing one post object', isCorrect: false },
        { text: 'An XML document with post data', isCorrect: false },
        { text: 'A 404 error because /posts/1 does not exist', isCorrect: false },
      ],
    },
    {
      type: 'FIX_REQUEST',
      difficulty: 'HARD',
      xpReward: 50,
      question: `This REST API call is supposed to update ONLY the title of a blog post, but it accidentally wipes out all other fields. Which HTTP method should replace PUT to fix this?\n\nPUT /api/posts/5\n{\n  "title": "Updated Title"\n}`,
      explanation: 'PATCH performs a partial update — only the fields you send are changed. PUT replaces the entire resource, so sending only "title" would clear all other fields (body, userId, etc.). Always use PATCH for partial updates.',
      options: [
        { text: 'PATCH', isCorrect: true },
        { text: 'POST', isCorrect: false },
        { text: 'UPDATE', isCorrect: false },
        { text: 'GET', isCorrect: false },
      ],
    },
  ],
  soap: [
    {
      type: 'QUIZ',
      difficulty: 'EASY',
      xpReward: 10,
      question: 'What data format does SOAP use for all of its messages?',
      explanation: 'SOAP exclusively uses XML for all messages. Unlike REST (which is format-agnostic) or GraphQL (which uses JSON), SOAP mandates XML, which is why SOAP messages are significantly more verbose.',
      options: [
        { text: 'XML', isCorrect: true },
        { text: 'JSON', isCorrect: false },
        { text: 'CSV', isCorrect: false },
        { text: 'Protocol Buffers', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'EASY',
      xpReward: 10,
      question: 'What does WSDL stand for and what is its purpose?',
      explanation: 'WSDL (Web Services Description Language) is an XML document that acts as the contract for a SOAP service. It lists all available operations, their input/output types, and the endpoint URL — allowing tools to auto-generate client code.',
      options: [
        { text: 'Web Services Description Language — defines the service contract', isCorrect: true },
        { text: 'Web Standard Data Layer — manages the database schema', isCorrect: false },
        { text: 'Web Service Definition Library — stores reusable SOAP snippets', isCorrect: false },
        { text: 'Wireless Service Data Link — handles mobile SOAP connections', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: 'A SOAP service call fails. What XML element does the server return to communicate the error?',
      explanation: 'SOAP uses the Fault element inside the soap:Body to report errors. It contains sub-elements like faultcode, faultstring, and detail. This is different from REST which uses HTTP status codes.',
      options: [
        { text: 'soap:Fault', isCorrect: true },
        { text: 'soap:Error', isCorrect: false },
        { text: 'soap:Exception', isCorrect: false },
        { text: 'HTTP 500 status code only', isCorrect: false },
      ],
    },
    {
      type: 'PREDICT_RESPONSE',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: `A SOAP request is sent to a calculator service to add 5 + 3. What format will the response be in, and what HTTP status code will it return on success?`,
      explanation: 'SOAP responses are always XML, wrapped in a soap:Envelope with a soap:Body containing the result. Crucially, SOAP responses use HTTP 200 OK even for operation failures — errors are communicated via soap:Fault inside the Body, not via HTTP status codes.',
      options: [
        { text: 'XML with HTTP 200, even for SOAP-level errors', isCorrect: true },
        { text: 'JSON with HTTP 200', isCorrect: false },
        { text: 'XML with different HTTP codes (400, 500) for different error types', isCorrect: false },
        { text: 'Binary with HTTP 200', isCorrect: false },
      ],
    },
    {
      type: 'FIX_REQUEST',
      difficulty: 'HARD',
      xpReward: 50,
      question: `This SOAP envelope is missing a required element. What needs to be added?\n\n<?xml version="1.0"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Header>\n    <auth>token123</auth>\n  </soap:Header>\n</soap:Envelope>`,
      explanation: 'A SOAP Envelope must always contain a soap:Body element — it is mandatory. The Header is optional, but the Body is required and contains the actual operation and parameters. Without it, the message is invalid.',
      options: [
        { text: 'Add a <soap:Body> element containing the operation payload', isCorrect: true },
        { text: 'Add a <soap:Footer> element after the Header', isCorrect: false },
        { text: 'Move the auth token into the Body', isCorrect: false },
        { text: 'Add a <soap:Namespace> declaration', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'HARD',
      xpReward: 50,
      question: 'Which WS-* standard provides message-level encryption and digital signatures for SOAP, independent of the transport layer?',
      explanation: 'WS-Security provides message-level security for SOAP. Unlike REST which relies on HTTPS (transport-level security), WS-Security encrypts and signs the SOAP message itself — so it remains secure even if stored or routed through intermediaries.',
      options: [
        { text: 'WS-Security', isCorrect: true },
        { text: 'WS-ReliableMessaging', isCorrect: false },
        { text: 'WS-AtomicTransaction', isCorrect: false },
        { text: 'WS-Addressing', isCorrect: false },
      ],
    },
  ],
  graphql: [
    {
      type: 'QUIZ',
      difficulty: 'EASY',
      xpReward: 10,
      question: 'What is the PRIMARY problem GraphQL was designed to solve with REST APIs?',
      explanation: 'GraphQL was created at Facebook to solve over-fetching (getting more data than needed) and under-fetching (needing multiple round-trips to get all required data). It lets clients specify exactly what fields they need in a single request.',
      options: [
        { text: 'Over-fetching and under-fetching of data', isCorrect: true },
        { text: 'Lack of authentication support in REST', isCorrect: false },
        { text: 'REST APIs not supporting real-time updates', isCorrect: false },
        { text: 'REST APIs only supporting JSON format', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'EASY',
      xpReward: 10,
      question: 'What are the three operation types in GraphQL?',
      explanation: 'GraphQL has three operation types: Query (read data), Mutation (write/modify data), and Subscription (real-time streaming data over WebSockets). All three are defined in the GraphQL schema.',
      options: [
        { text: 'Query, Mutation, Subscription', isCorrect: true },
        { text: 'GET, POST, PUT', isCorrect: false },
        { text: 'Query, Update, Delete', isCorrect: false },
        { text: 'Read, Write, Stream', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: 'A GraphQL query executes successfully but the requested user ID does not exist. What will the HTTP response look like?',
      explanation: 'GraphQL always returns HTTP 200 OK, even for application-level errors. Errors are communicated via an "errors" array in the JSON response body, alongside a "data" field (which may be null). This is a key difference from REST.',
      options: [
        { text: 'HTTP 200 with an "errors" array in the JSON body', isCorrect: true },
        { text: 'HTTP 404 with an error message', isCorrect: false },
        { text: 'HTTP 400 with a GraphQL error object', isCorrect: false },
        { text: 'HTTP 200 with an empty "data" object and no indication of error', isCorrect: false },
      ],
    },
    {
      type: 'PREDICT_RESPONSE',
      difficulty: 'MEDIUM',
      xpReward: 25,
      question: `You send this GraphQL query to the Countries API:\n\nquery {\n  country(code: "US") {\n    name\n    capital\n  }\n}\n\nWhat will the response data structure look like?`,
      explanation: 'GraphQL responses always mirror the exact shape of the query. You asked for country.name and country.capital, so the response will have exactly those fields under data.country. No extra fields are included — this is the key benefit of GraphQL.',
      options: [
        { text: '{ "data": { "country": { "name": "United States", "capital": "Washington D.C." } } }', isCorrect: true },
        { text: '{ "country": { "name": "United States", "capital": "Washington D.C.", "code": "US" } }', isCorrect: false },
        { text: '[{ "name": "United States", "capital": "Washington D.C." }]', isCorrect: false },
        { text: '{ "status": 200, "data": { "name": "United States" } }', isCorrect: false },
      ],
    },
    {
      type: 'FIX_REQUEST',
      difficulty: 'HARD',
      xpReward: 50,
      question: `This GraphQL query has a syntax error that will cause it to fail. Find and fix it:\n\nquery {\n  users {\n    id\n    name\n    email\n    posts {\n      title\n      createdAt\n    \n  }\n}`,
      explanation: 'The posts selection set is missing its closing brace. Every opening { in GraphQL must have a matching closing }. The corrected query closes posts with } before closing users with } and the query with }.',
      options: [
        { text: 'Add a missing closing } brace for the posts selection set', isCorrect: true },
        { text: 'Remove the nested posts field (GraphQL does not support nested queries)', isCorrect: false },
        { text: 'Add quotes around field names like "id" and "name"', isCorrect: false },
        { text: 'Replace query { with SELECT to use proper GraphQL syntax', isCorrect: false },
      ],
    },
    {
      type: 'QUIZ',
      difficulty: 'HARD',
      xpReward: 50,
      question: 'What is the N+1 problem in GraphQL, and which tool is the standard solution?',
      explanation: 'The N+1 problem occurs when resolving a list of N items, each triggering an individual database query for related data (1 query for users + N queries for each user\'s posts = N+1 queries). DataLoader, created by Facebook, solves this by batching and caching resolver calls within a single request.',
      options: [
        { text: 'Fetching N related records causing N+1 DB queries; solved by DataLoader', isCorrect: true },
        { text: 'N fields in a query causing 1+N round trips; solved by fragments', isCorrect: false },
        { text: 'N clients making 1 request each; solved by subscriptions', isCorrect: false },
        { text: 'GraphQL only supporting N=1 resolver per field; solved by unions', isCorrect: false },
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

  // Seed concepts + challenges
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

    const protocolKey = conceptFields.protocol.toLowerCase();
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
    }

    console.log(`✓ Seeded ${conceptFields.protocol} concept with ${challenges.length} challenges`);
  }

  console.log('\n✅ Database seed complete!');
  console.log(`   • 3 concepts (REST, SOAP, GraphQL)`);
  console.log(`   • ${Object.values(challengesData).flat().length} challenges total`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
