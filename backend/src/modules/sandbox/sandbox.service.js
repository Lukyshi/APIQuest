'use strict';
const axios = require('axios');
const prisma = require('../../config/db');
const {
  SANDBOX_REST_BASE_URL,
  SANDBOX_GRAPHQL_BASE_URL,
  SANDBOX_SOAP_BASE_URL,
} = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

const logSandbox = async (userId, protocol, requestPayload, responsePayload) => {
  try {
    await prisma.sandboxLog.create({
      data: { userId: userId || null, protocol, requestPayload, responsePayload },
    });
  } catch (e) {
    logger.warn('Failed to write sandbox log', { error: e.message });
  }
};

const proxyRest = async ({ method, path, headers = {}, body }, userId) => {
  const url = `${SANDBOX_REST_BASE_URL}${path}`;
  const startTime = Date.now();

  try {
    const response = await axios({
      method,
      url,
      headers: { 'Content-Type': 'application/json', ...headers },
      data: body,
      validateStatus: () => true, // don't throw on 4xx/5xx
      timeout: 10000,
    });

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      timing: { ms: Date.now() - startTime },
    };

    await logSandbox(userId, 'REST', { method, path, headers, body }, result);
    return result;
  } catch (err) {
    throw ApiError.badRequest(`REST proxy error: ${err.message}`);
  }
};

const proxyGraphQL = async ({ query, variables = {} }, userId) => {
  const startTime = Date.now();
  try {
    const response = await axios.post(
      SANDBOX_GRAPHQL_BASE_URL,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000, validateStatus: () => true }
    );

    const result = {
      status: response.status,
      data: response.data,
      timing: { ms: Date.now() - startTime },
    };

    await logSandbox(userId, 'GRAPHQL', { query, variables }, result);
    return result;
  } catch (err) {
    throw ApiError.badRequest(`GraphQL proxy error: ${err.message}`);
  }
};

const proxySoap = async ({ operation, intA, intB }, userId) => {
  const startTime = Date.now();

  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soap:Body>
    <tem:${operation}>
      <tem:intA>${intA}</tem:intA>
      <tem:intB>${intB}</tem:intB>
    </tem:${operation}>
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await axios.post(SANDBOX_SOAP_BASE_URL, envelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: `http://tempuri.org/${operation}`,
      },
      timeout: 12000,
      validateStatus: () => true,
    });

    const result = {
      status: response.status,
      data: response.data, // raw XML string
      timing: { ms: Date.now() - startTime },
      requestEnvelope: envelope,
    };

    await logSandbox(userId, 'SOAP', { operation, intA, intB, envelope }, result);
    return result;
  } catch (err) {
    // If the real SOAP service is unreachable, return a mock response for demo purposes
    const mockResult = {
      status: 200,
      data: buildMockSoapResponse(operation, intA, intB),
      timing: { ms: Date.now() - startTime },
      requestEnvelope: envelope,
      note: 'Mock response (live SOAP service unreachable)',
    };
    await logSandbox(userId, 'SOAP', { operation, intA, intB, envelope }, mockResult);
    return mockResult;
  }
};

const buildMockSoapResponse = (operation, a, b) => {
  const ops = { Add: a + b, Subtract: a - b, Multiply: a * b, Divide: b !== 0 ? a / b : 'Error: division by zero' };
  const result = ops[operation] ?? 0;
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soap:Body>
    <tem:${operation}Response>
      <tem:${operation}Result>${result}</tem:${operation}Result>
    </tem:${operation}Response>
  </soap:Body>
</soap:Envelope>`;
};

module.exports = { proxyRest, proxyGraphQL, proxySoap };
